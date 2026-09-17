from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
from pathlib import Path
from pydantic import BaseModel
import pandas as pd
import numpy as np
import os


app = FastAPI(title="Financial Fraud Detection API")


# CORS configuration
frontend_url = os.getenv("FRONTEND_URL")

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

if frontend_url:
    allowed_origins.append(frontend_url)


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Model path
MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "fraud_detection_model_bundle.joblib"
)


class TransactionInput(BaseModel):
    income: float
    name_email_similarity: float
    prev_address_months_count: float
    current_address_months_count: float
    customer_age: float
    days_since_request: float
    intended_balcon_amount: float
    payment_type: str
    zip_count_4w: float
    velocity_6h: float
    velocity_24h: float
    velocity_4w: float
    bank_branch_count_8w: float
    date_of_birth_distinct_emails_4w: float
    employment_status: str
    credit_risk_score: float
    email_is_free: int
    housing_status: str
    phone_home_valid: int
    phone_mobile_valid: int
    bank_months_count: float
    has_other_cards: int
    proposed_credit_limit: float
    foreign_request: int
    source: str
    session_length_in_minutes: float
    device_os: str
    keep_alive_session: int
    device_distinct_emails_8w: float
    device_fraud_count: float
    month: int


# Load trained model bundle
model_bundle = joblib.load(MODEL_PATH)

model = model_bundle["model"]
encoder = model_bundle["encoder"]
threshold = model_bundle["threshold"]

categorical_features = model_bundle["categorical_features"]
numerical_features = model_bundle["numerical_features"]


@app.get("/")
def root():
    return {
        "message": "Financial Fraud Detection API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": True
    }


@app.post("/predict")
def predict(transaction: TransactionInput):
    data = transaction.model_dump()

    input_df = pd.DataFrame([data])

    # Remove constant feature used during training
    input_df = input_df.drop(columns=["device_fraud_count"])

    # Encode categorical features
    encoded = encoder.transform(
        input_df[categorical_features]
    )

    # Select numerical features
    numerical = input_df[numerical_features].to_numpy()

    # Combine numerical and encoded features
    processed = np.hstack([
        numerical,
        encoded
    ])

    # Generate fraud probability
    fraud_probability = model.predict_proba(
        processed
    )[:, 1][0]

    # Convert probability to risk score
    risk_score = fraud_probability * 100

    # Assign risk level
    if risk_score < 10:
        risk_level = "Low"
    elif risk_score < 30:
        risk_level = "Medium"
    elif risk_score < 60:
        risk_level = "High"
    else:
        risk_level = "Critical"

    # Apply selected decision threshold
    predicted_fraud = fraud_probability >= threshold

    return {
        "fraud_probability": round(
            float(fraud_probability), 4
        ),
        "risk_score": round(
            float(risk_score), 2
        ),
        "risk_level": risk_level,
        "predicted_fraud": bool(predicted_fraud)
    }