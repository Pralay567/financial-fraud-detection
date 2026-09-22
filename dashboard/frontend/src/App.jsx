import { useState } from 'react'

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts'

import './App.css'

const riskData = [
  { level: 'Low', transactions: 196377 },
  { level: 'Medium', transactions: 3025 },
  { level: 'High', transactions: 514 },
  { level: 'Critical', transactions: 84 },
]

function App() {
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    income: 0,
    name_email_similarity: 0,
    prev_address_months_count: 0,
    current_address_months_count: 0,
    customer_age: 0,
    days_since_request: 0,
    intended_balcon_amount: 0,
    payment_type: 'AA',
    zip_count_4w: 0,
    velocity_6h: 0,
    velocity_24h: 0,
    velocity_4w: 0,
    bank_branch_count_8w: 0,
    date_of_birth_distinct_emails_4w: 0,
    employment_status: 'CA',
    credit_risk_score: 0,
    email_is_free: 0,
    housing_status: 'BA',
    phone_home_valid: 0,
    phone_mobile_valid: 0,
    bank_months_count: 0,
    has_other_cards: 0,
    proposed_credit_limit: 0,
    foreign_request: 0,
    source: 'INTERNET',
    session_length_in_minutes: 0,
    device_os: 'windows',
    keep_alive_session: 0,
    device_distinct_emails_8w: 0,
    device_fraud_count: 0,
    month: 0,
  })

  const handlePredict = async () => {
    setLoading(true)
    setError('')
    setPrediction(null)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/predict`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        throw new Error('Prediction request failed')
      }

      const data = await response.json()

      setPrediction(data)
    } catch (error) {
      console.error('Prediction Error:', error)
      setError(
        'Unable to connect to the fraud detection API. Please make sure the backend is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  return (
    <div className="dashboard">

      <header className="dashboard-header">
        <div>
          <h1>Financial Fraud Detection</h1>
          <p>AI-powered fraud detection and risk analysis</p>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          Model Active
        </div>
      </header>

      <main className="dashboard-content">

        {/* Dashboard Statistics */}
        <section className="stats-grid">

          <div className="stat-card">
            <span>Total Transactions</span>
            <strong>200,000</strong>
          </div>

          <div className="stat-card">
            <span>Predicted Fraud</span>
            <strong>3,623</strong>
          </div>

          <div className="stat-card">
            <span>Fraud Rate</span>
            <strong>1.10%</strong>
          </div>

          <div className="stat-card">
            <span>Model Recall</span>
            <strong>31.28%</strong>
          </div>

        </section>

        {/* Fraud Risk Distribution */}
        <section className="chart-card">

          <div className="chart-header">
            <h2>Fraud Risk Distribution by Risk Level</h2>

            <p>
              Transaction distribution across model-defined risk levels
            </p>
          </div>

          <div className="chart-container">

            <ResponsiveContainer width="100%" height={350}>

              <BarChart
                data={riskData}
                layout="vertical"
              >

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  type="number"
                  label={{
                    value: 'Number of Transactions',
                    position: 'insideBottom',
                    offset: -5,
                  }}
                />

                <YAxis
                  dataKey="level"
                  type="category"
                  width="auto"
                  tickMargin={8}
                />

                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toLocaleString()} transactions`,
                    'Count',
                  ]}
                />

                <Bar dataKey="transactions">

                  {riskData.map((entry) => (
                    <Cell
                      key={`cell-${entry.level}`}
                      fill={
                        entry.level === 'Low'
                          ? '#22c55e'
                          : entry.level === 'Medium'
                          ? '#f59e0b'
                          : '#ef4444'
                      }
                    />
                  ))}

                  <LabelList
                    dataKey="transactions"
                    position="right"
                  />

                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </div>

        </section>

        {/* Model Performance */}
        <section className="metrics-section">

          <div className="section-heading">

            <h2>Model Performance</h2>

            <p>
              Performance of the tuned HistGradientBoosting model
            </p>

          </div>

          <div className="metrics-grid">

            <div className="metric-card">
              <span>ROC-AUC</span>
              <strong>89.61%</strong>
            </div>

            <div className="metric-card">
              <span>PR-AUC</span>
              <strong>16.98%</strong>
            </div>

            <div className="metric-card">
              <span>Precision</span>
              <strong>19.04%</strong>
            </div>

            <div className="metric-card">
              <span>Recall</span>
              <strong>31.28%</strong>
            </div>

            <div className="metric-card">
              <span>F1 Score</span>
              <strong>23.67%</strong>
            </div>

            <div className="metric-card">
              <span>Decision Threshold</span>
              <strong>0.10</strong>
            </div>

          </div>

        </section>

        {/* Transaction Risk Prediction */}
        <section className="prediction-card">

          <div className="section-heading">

            <h2>Transaction Risk Prediction</h2>

            <p>
              Enter transaction details to evaluate fraud risk.
            </p>

          </div>

          <div className="prediction-form">

            <div className="form-group">
              <label>Device Distinct Emails (8 Weeks)</label>

              <input
                type="number"
                name="device_distinct_emails_8w"
                value={formData.device_distinct_emails_8w}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Month</label>

              <input
                type="number"
                min="0"
                max="12"
                name="month"
                value={formData.month}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Source</label>

              <select
                name="source"
                value={formData.source}
                onChange={handleInputChange}
              >
                <option value="INTERNET">Internet</option>
                <option value="TELEAPP">Teleapp</option>
              </select>
            </div>

            <div className="form-group">
              <label>Device OS</label>

              <select
                name="device_os"
                value={formData.device_os}
                onChange={handleInputChange}
              >
                <option value="windows">Windows</option>
                <option value="linux">Linux</option>
                <option value="macintosh">Macintosh</option>
                <option value="x11">X11</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Session Length (Minutes)</label>

              <input
                type="number"
                step="0.01"
                name="session_length_in_minutes"
                value={formData.session_length_in_minutes}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Keep Alive Session</label>

              <select
                name="keep_alive_session"
                value={formData.keep_alive_session}
                onChange={handleInputChange}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Bank Months Count</label>

              <input
                type="number"
                name="bank_months_count"
                value={formData.bank_months_count}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Intended Balance Amount</label>

              <input
                type="number"
                step="0.01"
                name="intended_balcon_amount"
                value={formData.intended_balcon_amount}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Home Phone Valid</label>

              <select
                name="phone_home_valid"
                value={formData.phone_home_valid}
                onChange={handleInputChange}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Mobile Phone Valid</label>

              <select
                name="phone_mobile_valid"
                value={formData.phone_mobile_valid}
                onChange={handleInputChange}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Has Other Cards</label>

              <select
                name="has_other_cards"
                value={formData.has_other_cards}
                onChange={handleInputChange}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Employment Status</label>

              <select
                name="employment_status"
                value={formData.employment_status}
                onChange={handleInputChange}
              >
                <option value="CA">CA</option>
                <option value="CB">CB</option>
                <option value="CC">CC</option>
                <option value="CD">CD</option>
                <option value="CE">CE</option>
                <option value="CF">CF</option>
                <option value="CG">CG</option>
              </select>
            </div>

            <div className="form-group">
              <label>Housing Status</label>

              <select
                name="housing_status"
                value={formData.housing_status}
                onChange={handleInputChange}
              >
                <option value="BA">BA</option>
                <option value="BB">BB</option>
                <option value="BC">BC</option>
                <option value="BD">BD</option>
                <option value="BE">BE</option>
                <option value="BF">BF</option>
                <option value="BG">BG</option>
              </select>
            </div>

            <div className="form-group">
              <label>Bank Branch Count (8 Weeks)</label>

              <input
                type="number"
                name="bank_branch_count_8w"
                value={formData.bank_branch_count_8w}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Zip Count (4 Weeks)</label>

              <input
                type="number"
                name="zip_count_4w"
                value={formData.zip_count_4w}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Velocity (6 Hours)</label>

              <input
                type="number"
                step="0.01"
                name="velocity_6h"
                value={formData.velocity_6h}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Velocity (24 Hours)</label>

              <input
                type="number"
                step="0.01"
                name="velocity_24h"
                value={formData.velocity_24h}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Velocity (4 Weeks)</label>

              <input
                type="number"
                step="0.01"
                name="velocity_4w"
                value={formData.velocity_4w}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Income</label>

              <input
                type="number"
                name="income"
                value={formData.income}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Customer Age</label>

              <input
                type="number"
                name="customer_age"
                value={formData.customer_age}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Credit Risk Score</label>

              <input
                type="number"
                name="credit_risk_score"
                value={formData.credit_risk_score}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Proposed Credit Limit</label>

              <input
                type="number"
                name="proposed_credit_limit"
                value={formData.proposed_credit_limit}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Name Email Similarity</label>

              <input
                type="number"
                step="0.01"
                name="name_email_similarity"
                value={formData.name_email_similarity}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Foreign Request</label>

              <select
                name="foreign_request"
                value={formData.foreign_request}
                onChange={handleInputChange}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Free Email</label>

              <select
                name="email_is_free"
                value={formData.email_is_free}
                onChange={handleInputChange}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Payment Type</label>

              <select
                name="payment_type"
                value={formData.payment_type}
                onChange={handleInputChange}
              >
                <option value="AA">AA</option>
                <option value="AB">AB</option>
                <option value="AC">AC</option>
                <option value="AD">AD</option>
                <option value="AE">AE</option>
              </select>
            </div>

            <div className="form-group">
              <label>Previous Address Months</label>

              <input
                type="number"
                name="prev_address_months_count"
                value={formData.prev_address_months_count}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Current Address Months</label>

              <input
                type="number"
                name="current_address_months_count"
                value={formData.current_address_months_count}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Days Since Request</label>

              <input
                type="number"
                step="0.01"
                name="days_since_request"
                value={formData.days_since_request}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Birth-Date Distinct Emails (4 Weeks)</label>

              <input
                type="number"
                name="date_of_birth_distinct_emails_4w"
                value={formData.date_of_birth_distinct_emails_4w}
                onChange={handleInputChange}
              />
            </div>

          </div>

          <button
            className="predict-button"
            onClick={handlePredict}
            disabled={loading}
          >
            {loading
              ? 'Predicting...'
              : 'Check Transaction Risk'}
          </button>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {prediction && (
            <div
              className={`prediction-result risk-${prediction.risk_level.toLowerCase()}`}
            >

              <h3>Prediction Result</h3>

              <p>
                Fraud Probability:{' '}
                <strong>
                  {prediction.fraud_probability}
                </strong>
              </p>

              <p>
                Risk Score:{' '}
                <strong>
                  {prediction.risk_score}
                </strong>
              </p>

              <p>
                Risk Level:{' '}

                <strong
                  className={`risk-level risk-${prediction.risk_level.toLowerCase()}`}
                  style={{
                    color:
                      prediction.risk_level === 'Low'
                        ? '#22c55e'
                        : prediction.risk_level === 'Medium'
                        ? '#f59e0b'
                        : prediction.risk_level === 'High'
                        ? '#ef4444'
                        : '#d61919',
                  }}
                >
                  {prediction.risk_level}
                </strong>
              </p>

              <p>
                Predicted Fraud:{' '}

                <strong>
                  {prediction.predicted_fraud
                    ? 'Yes'
                    : 'No'}
                </strong>
              </p>

              {/* One-Class SVM Anomaly Detection */}
              <p>
                Anomaly Detection:{' '}

                <strong
                  style={{
                    color: prediction.anomaly_detected
                      ? '#ef4444'
                      : '#22c55e',
                  }}
                >
                  {prediction.anomaly_detected
                    ? 'Anomaly Detected'
                    : 'Normal'}
                </strong>
              </p>

              <p>
                Detection Method:{' '}

                <strong>
                  {prediction.anomaly_method}
                </strong>
              </p>

            </div>
          )}

        </section>

        {/* Fraud Risk Overview */}
        <section className="welcome-card">

          <h2>Fraud Risk Overview</h2>

          <p>
            Transactions are assigned a model-defined risk score
            from 0 to 100. The dashboard uses the following risk
            levels:
          </p>

          <div className="risk-guide">

            <div className="risk-guide-low">
              <strong>Low</strong>
              <span>0–9.99</span>
            </div>

            <div className="risk-guide-medium">
              <strong>Medium</strong>
              <span>10–29.99</span>
            </div>

            <div className="risk-guide-high">
              <strong>High</strong>
              <span>30–59.99</span>
            </div>

            <div className="risk-guide-critical">
              <strong>Critical</strong>
              <span>60–100</span>
            </div>

          </div>

          <p className="risk-note">
            Transactions with a risk score of 10 or higher are
            flagged as predicted fraud using the selected decision
            threshold of 0.10.
          </p>

        </section>

        {/* Dashboard Footer */}
        <footer
          style={{
            width: '100%',
            maxWidth: 'none',
            boxSizing: 'border-box',
            textAlign: 'center',
            padding: '24px 20px',
            marginTop: '10px',
          }}
        >
          <strong>Financial Fraud Detection</strong>

          <span
            style={{
              display: 'block',
              marginTop: '6px',
            }}
          >
            AI-Powered Fraud Detection System
          </span>

          <span
            style={{
              display: 'block',
              marginTop: '4px',
            }}
          >
            v1.0.0
          </span>

          <span
            style={{
              display: 'block',
              marginTop: '4px',
            }}
          >
            Made by Pralay Bajkhan
          </span>
        </footer>

      </main>

    </div>
  )
}

export default App