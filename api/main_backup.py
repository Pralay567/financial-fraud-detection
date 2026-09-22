from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
from pathlib import Path
from pydantic import BaseModel
import pandas as pd
import numpy as np
import os
import smtplib
from email.mime.text import MIMEText


# ============================================================
# Paths
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "fraud_detection_model_bundle.joblib"
OCSVM_PATH = BASE_DIR / "ocsvm_model_bundle.joblib"


# ============================================================
# FastAPI Application
# ============================================================

app = FastAPI(title="Financial Fraud Detection API")


# ============================================================
# CORS Configuration
# ============================================================

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


# ============================================================
# Load One-Class SVM
# ============================================================

ocsvm_bundle = joblib.load(OCSVM_PATH)

ocsvm_model = ocsvm_bundle["model"]
ocsvm_scaler = ocsvm_bundle["scaler"]
ocsvm_features = ocsvm_bundle["features"]


# ============================================================
# Load Supervised Fraud Detection Model
# ============================================================

model_bundle = joblib.load(MODEL_PATH)

model = model_bundle["model"]
encoder = model_bundle["encoder"]
threshold = model_bundle["threshold"]

categorical_features = model_bundle["categorical_features"]
numerical_features = model_bundle["numerical_features"]


# ============================================================
# Email Alert Configuration
# ============================================================

SENDER_EMAIL = os.getenv("SENDER_EMAIL")
RECIPIENT_EMAIL = os.getenv("RECIPIENT_EMAIL")
EMAIL_APP_PASSWORD = os.getenv("EMAIL_APP_PASSWORD")


def send_alert(
    fraud_probability,
    risk_score,
    risk_level,
    predicted_fraud,
    anomaly_detected
):
    """
    Send an email alert for high-risk transactions.

    Gmail SMTP is used for sending the alert.
    Credentials are read from environment variables.
    """

    # Check whether email configuration exists
    if not all([
        SENDER_EMAIL,
        RECIPIENT_EMAIL,
        EMAIL_APP_PASSWORD
    ]):
        print(
            "Email alert skipped: "
            "email environment variables are not configured."
        )
        return False


    # --------------------------------------------------------
    # Email subject
    # --------------------------------------------------------

    subject = (
        f"🚨 Fraud Alert - {risk_level} Risk Transaction"
    )


    # --------------------------------------------------------
    # Email body
    # --------------------------------------------------------

    body = f"""
Financial Fraud Detection Alert

A high-risk transaction has been detected.

----------------------------------------
Fraud Probability : {fraud_probability * 100:.2f}%
Risk Score        : {risk_score:.2f}
Risk Level        : {risk_level}
Predicted Fraud   : {"Yes" if predicted_fraud else "No"}
Anomaly Detected  : {"Yes" if anomaly_detected else "No"}
Detection Method  : One-Class SVM
----------------------------------------

This alert was generated automatically by the
Financial Fraud Detection System.

Please review the transaction for further investigation.
"""


    # --------------------------------------------------------
    # Create email message
    # --------------------------------------------------------

    message = MIMEText(body)

    message["Subject"] = subject
    message["From"] = SENDER_EMAIL
    message["To"] = RECIPIENT_EMAIL


    # --------------------------------------------------------
    # Send email using Gmail SMTP
    # --------------------------------------------------------

    try:

        server = smtplib.SMTP(
            "smtp.gmail.com",
            587,
            timeout=20
        )

        server.starttls()

        server.login(
            SENDER_EMAIL,
            EMAIL_APP_PASSWORD
        )

        server.sendmail(
            SENDER_EMAIL,
            RECIPIENT_EMAIL,
            message.as_string()
        )

        server.quit()

        print("Fraud alert email sent successfully.")

        return True


    except Exception as e:

        print(
            f"Email alert failed: {str(e)}"
        )

        return False


# ============================================================
# Request Schema
# ============================================================

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


# ============================================================
# Root Endpoint
# ============================================================

@app.get("/")
def root():
    return {
        "message": "Financial Fraud Detection API is running"
    }


# ============================================================
# Health Endpoint
# ============================================================

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": True,
        "ocsvm_loaded": True
    }


# ============================================================
# Prediction Endpoint
# ============================================================

@app.post("/predict")
def predict(transaction: TransactionInput):

    # --------------------------------------------------------
    # Convert request to DataFrame
    # --------------------------------------------------------

    data = transaction.model_dump()

    input_df = pd.DataFrame([data])


    # --------------------------------------------------------
    # Remove constant feature used during supervised training
    # --------------------------------------------------------

    input_df = input_df.drop(
        columns=["device_fraud_count"]
    )


    # ========================================================
    # One-Class SVM Anomaly Detection
    # ========================================================

    ocsvm_input = input_df[ocsvm_features].copy()

    # Replace infinite values
    ocsvm_input = ocsvm_input.replace(
        [np.inf, -np.inf],
        np.nan
    )

    # Handle missing values
    ocsvm_input = ocsvm_input.fillna(0)

    # Apply the same scaler used during training
    ocsvm_processed = ocsvm_scaler.transform(
        ocsvm_input
    )

    # Generate One-Class SVM prediction
    ocsvm_prediction = ocsvm_model.predict(
        ocsvm_processed
    )

    # One-Class SVM:
    #  1  = normal
    # -1  = anomaly

    is_anomaly = ocsvm_prediction[0] == -1


    # ========================================================
    # Supervised Fraud Detection
    # ========================================================

    # Encode categorical features
    encoded = encoder.transform(
        input_df[categorical_features]
    )

    # Select numerical features
    numerical = input_df[
        numerical_features
    ].to_numpy()

    # Combine numerical and encoded features
    processed = np.hstack([
        numerical,
        encoded
    ])


    # --------------------------------------------------------
    # Generate fraud probability
    # --------------------------------------------------------

    fraud_probability = model.predict_proba(
        processed
    )[:, 1][0]


    # --------------------------------------------------------
    # Convert probability to risk score
    # --------------------------------------------------------

    risk_score = fraud_probability * 100


    # --------------------------------------------------------
    # Assign risk level
    # --------------------------------------------------------

    if risk_score < 10:

        risk_level = "Low"

    elif risk_score < 30:

        risk_level = "Medium"

    elif risk_score < 60:

        risk_level = "High"

    else:

        risk_level = "Critical"


    # --------------------------------------------------------
    # Apply selected decision threshold
    # --------------------------------------------------------

    predicted_fraud = fraud_probability >= threshold


    # ========================================================
    # Automated Email Alert
    # ========================================================

    alert_sent = False

    if risk_level in ["High", "Critical"]:

        alert_sent = send_alert(
            fraud_probability=fraud_probability,
            risk_score=risk_score,
            risk_level=risk_level,
            predicted_fraud=predicted_fraud,
            anomaly_detected=is_anomaly
        )


    # ========================================================
    # Final Response
    # ========================================================

    return {
        "fraud_probability": round(
            float(fraud_probability),
            4
        ),
        "risk_score": round(
            float(risk_score),
            2
        ),
        "risk_level": risk_level,
        "predicted_fraud": bool(predicted_fraud),
        "anomaly_detected": bool(is_anomaly),
        "anomaly_method": "One-Class SVM",
        "alert_sent": bool(alert_sent)
    }