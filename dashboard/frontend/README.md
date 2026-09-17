# Financial Fraud Detection

An AI-powered financial fraud detection and risk analysis system that uses a tuned **HistGradientBoosting** machine learning model to estimate transaction fraud probability and classify transactions into different risk levels.

The project provides an interactive web dashboard where users can enter transaction details and receive a real-time fraud prediction through a **FastAPI** backend.

---

## Project Overview

Financial fraud detection is a classification problem where the objective is to identify potentially fraudulent transactions while minimizing incorrect predictions.

This project uses transaction-level features related to customer information, payment behavior, device activity, addresses, banking information, and transaction velocity.

The trained machine learning model produces a fraud probability, which is converted into a risk score from **0 to 100**.

### Risk Classification

| Risk Level | Risk Score |
| ---------- | ---------: |
| Low        |     0–9.99 |
| Medium     |   10–29.99 |
| High       |   30–59.99 |
| Critical   |     60–100 |

Transactions with a predicted probability of **0.10 or higher** are flagged as predicted fraud.

---

## Key Features

* AI-powered financial fraud prediction
* Real-time transaction risk prediction
* Fraud probability calculation
* Risk score from 0–100
* Four-level risk classification
* Interactive React dashboard
* FastAPI prediction API
* Swagger API documentation
* Model performance metrics
* Fraud risk distribution visualization
* Input validation and API error handling
* Responsive dashboard interface

---

## Model

The project uses a tuned **HistGradientBoosting** classification model.

### Model Performance

| Metric             | Result |
| ------------------ | -----: |
| ROC-AUC            | 89.61% |
| PR-AUC             | 16.98% |
| Precision          | 19.04% |
| Recall             | 31.28% |
| F1 Score           | 23.67% |
| Decision Threshold |   0.10 |

The decision threshold is set to **0.10** to determine the predicted fraud classification.

---

## Dashboard

The dashboard provides:

### Dashboard Statistics

* Total Transactions: **200,000**
* Predicted Fraud: **3,623**
* Fraud Rate: **1.10%**
* Model Recall: **31.28%**

### Risk Distribution

The dashboard displays transaction counts across:

* Low
* Medium
* High
* Critical

### Transaction Risk Prediction

Users can enter transaction characteristics including:

* Income
* Customer age
* Credit risk score
* Payment type
* Employment status
* Housing status
* Device information
* Address history
* Banking information
* Transaction velocity
* Email-related features
* Phone validation
* Session information
* Credit limit
* Foreign request status

The application sends these values to the FastAPI backend and displays the resulting fraud probability, risk score, risk level, and predicted fraud status.

---

## Tech Stack

### Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* HistGradientBoosting

### Backend

* FastAPI
* Uvicorn
* Pydantic

### Frontend

* React
* Vite
* Recharts
* CSS

### Data & Storage

* CSV
* SQLite
* Joblib

---

## Project Structure

```text
Financial-Fraud-Detection/
│
├── api/
│   ├── main.py
│   └── __pycache__/
│
├── dashboard/
│   └── frontend/
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── ...
│
├── data/
│
├── models/
│
├── notebooks/
│
├── reports/
│
├── tests/
│
├── fraud_detection.db
├── fraud_detection_model_bundle.joblib
├── final_model_evaluation.csv
├── fraud_risk_results.csv
├── requirements.txt
├── package.json
└── README.md
```

---

## Backend Setup

Open PowerShell in the project root:

```powershell
cd C:\Users\prala\Financial-Fraud-Detection
```

Install the Python dependencies:

```powershell
pip install -r requirements.txt
```

Start the FastAPI server:

```powershell
uvicorn api.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

### Swagger Documentation

FastAPI automatically provides interactive API documentation at:

```text
http://127.0.0.1:8000/docs
```

---

## API Endpoint

### POST `/predict`

The `/predict` endpoint accepts transaction information and returns a fraud prediction.

### Example Response

```json
{
  "fraud_probability": 0.0283,
  "risk_score": 2.83,
  "risk_level": "Low",
  "predicted_fraud": false
}
```

Another example prediction:

```json
{
  "fraud_probability": 0.3538,
  "risk_score": 35.38,
  "risk_level": "High",
  "predicted_fraud": true
}
```

---

## Frontend Setup

Open another PowerShell window.

Navigate to the frontend:

```powershell
cd C:\Users\prala\Financial-Fraud-Detection\dashboard\frontend
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Vite will provide a local URL, normally similar to:

```text
http://localhost:5173
```

---

## Running the Complete Application

Two terminals are required.

### Terminal 1 — Backend

```powershell
cd C:\Users\prala\Financial-Fraud-Detection
uvicorn api.main:app --reload
```

### Terminal 2 — Frontend

```powershell
cd C:\Users\prala\Financial-Fraud-Detection\dashboard\frontend
npm run dev
```

Then open the frontend URL provided by Vite.

---

## Prediction Workflow

```text
User enters transaction details
            ↓
React Frontend
            ↓
POST /predict
            ↓
FastAPI Backend
            ↓
Trained HistGradientBoosting Model
            ↓
Fraud Probability
            ↓
Risk Score (0–100)
            ↓
Risk Level
            ↓
Predicted Fraud
            ↓
Result displayed in Dashboard
```

---

## API Validation

The API validates incoming request data.

A valid request returns:

```text
200 OK
```

Invalid request data can return:

```text
422 Validation Error
```

---

## Current Status

The project has been tested for:

* Frontend rendering
* Dashboard statistics
* Risk distribution chart
* Transaction input form
* Loading state
* Error handling
* Frontend-to-backend communication
* FastAPI `/predict` endpoint
* Model prediction
* Fraud probability
* Risk score
* Risk-level classification
* Fraud decision threshold
* Swagger API documentation
* Request validation

---

## Version

**v1.0.0**

**Financial Fraud Detection — AI-Powered Fraud Detection System**

Made by **Pralay Bajkhan**
