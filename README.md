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
|------------|-----------:|
| Low | 0–9.99 |
| Medium | 10–29.99 |
| High | 30–59.99 |
| Critical | 60–100 |

Transactions with a predicted probability of **0.10 or higher** are flagged as predicted fraud.

---

## Key Features

- AI-powered financial fraud prediction
- Real-time transaction risk prediction
- Fraud probability calculation
- Risk score from 0–100
- Four-level risk classification
- Interactive React dashboard
- FastAPI prediction API
- Swagger API documentation
- Model performance metrics
- Fraud risk distribution visualization
- Input validation and API error handling
- Responsive dashboard interface

---

## Machine Learning Model

The project uses a tuned **HistGradientBoosting** classification model.

### Model Performance

| Metric | Result |
|--------|-------:|
| ROC-AUC | 89.61% |
| PR-AUC | 16.98% |
| Precision | 19.04% |
| Recall | 31.28% |
| F1 Score | 23.67% |
| Decision Threshold | 0.10 |

The decision threshold is set to **0.10** for the predicted fraud classification.

---

## Dashboard

The dashboard provides an interactive interface for viewing model statistics, fraud-risk distribution, and individual transaction predictions.

### Dashboard Statistics

- Total Transactions: **200,000**
- Predicted Fraud: **3,623**
- Fraud Rate: **1.10%**
- Model Recall: **31.28%**

### Risk Distribution

The dashboard displays transaction counts across four model-defined risk levels:

- Low
- Medium
- High
- Critical

### Transaction Risk Prediction

Users can enter transaction characteristics including:

- Income
- Customer age
- Credit risk score
- Payment type
- Employment status
- Housing status
- Device information
- Address history
- Banking information
- Transaction velocity
- Email-related features
- Phone validation
- Session information
- Credit limit
- Foreign request status

The application sends these values to the FastAPI backend and displays:

- Fraud probability
- Risk score
- Risk level
- Predicted fraud status

---

## Tech Stack

### Machine Learning

- Python
- Pandas
- NumPy
- Scikit-learn
- HistGradientBoosting

### Backend

- FastAPI
- Uvicorn
- Pydantic

### Frontend

- React
- Vite
- Recharts
- CSS

### Data & Storage

- CSV
- SQLite
- Joblib

---

## Project Structure

```text
Financial-Fraud-Detection/
│
├── api/
│   └── main.py
│
├── dashboard/
│   └── frontend/
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── ...
│
├── data/
│   └── raw/
│
├── models/
│
├── notebooks/
│   ├── 01_dataset_inspection.ipynb
│   ├── 02_baseline_model.ipynb
│   ├── 03_sqlite_etl.ipynb
│   ├── 04_unsupervised_model.ipynb
│   └── 05_monitoring_alerts.ipynb
│
├── reports/
│   ├── figures/
│   └── results/
│
├── src/
│   ├── data/
│   ├── features/
│   ├── models/
│   └── utils/
│
├── tests/
│
├── fraud_detection_model_bundle.joblib
├── final_model_evaluation.csv
├── fraud_risk_results.csv
├── requirements.txt
└── README.md