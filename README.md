# Airman Aeronautics — Data Science Technical Assessment

## 1. Project Overview

This project is a **Data Science Technical Assessment** for Airman Aeronautics, a flight training organization (FTO). The assessment analyzes two core platforms:

- **Skynet SaaS** — Flight dispatch, scheduling, and operations management system
- **TOGA App** — Pilot learning application for study tracking and knowledge assessment

The goal is to ingest synthetic operational data, identify data quality issues, compute key operational and learning metrics, build an explainable cadet risk scoring model, and generate actionable insights through visualizations and written reports.

**Scope:** 200 cadets, 30 instructors, 25 aircraft, 12,001 sortie records across 5 bases (Bangalore, Chennai, Hyderabad, Mysuru, Pune) over a 6-month period (January–June 2025).

---

## 2. Tools & Libraries Used

| Tool / Library | Version | Purpose |
|---------------|---------|---------|
| Python | 3.12 | Primary analysis language |
| pandas | latest | Data loading, cleaning, aggregation, and manipulation |
| numpy | latest | Numerical computations |
| matplotlib | 3.10.8 | Static chart generation and visualization |
| seaborn | latest | Statistical visualization enhancements |
| plotly | latest | Interactive chart generation |
| Jupyter Notebook | latest | Interactive analysis environment |

---

## 3. Setup Instructions

### Prerequisites
- Python 3.10+ installed
- `pip` package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Airman-DS-TA

# (Optional) Create and activate a virtual environment
python -m venv venv
source venv/bin/activate       # Linux/macOS
# venv\Scripts\activate        # Windows

# Install dependencies
pip install pandas numpy matplotlib seaborn plotly jupyter nbformat
```

---

## 4. How to Run the Notebook

```bash
# Navigate to the notebooks directory
cd notebooks

# Launch Jupyter
jupyter notebook analysis.ipynb
```

Run all cells in order (Cell → Run All). The notebook is structured in 8 sequential sections:

| Section | Description |
|---------|-------------|
| 0 | Setup & Data Loading |
| 1 | Data Cleaning & Validation |
| 2 | Skynet Operations Analytics |
| 3 | Training Progress Analytics |
| 4 | TOGA Study Intelligence |
| 5 | Finance & Operational Risk |
| 6 | Explainable Cadet Risk Score |
| 7 | Visualizations & Charts |
| 8 | Export Outputs |

All outputs (charts, CSVs, reports) are generated automatically into their respective directories.

---

## 5. Data Assumptions

1. **Synthetic data:** All datasets were generated programmatically via `notebooks/Data_generator.ipynb` for assessment purposes. Patterns are intentionally seeded to simulate realistic scenarios.
2. **Cancelled sorties** have null `actual_start` and `actual_end` fields by design — these are not treated as data quality errors when the status is `cancelled`.
3. **cancel_reason** is only populated for cancelled sorties; ~89.7% null values in this column reflect completed/delayed flights and are expected.
4. **Flight duration** is a fixed 1.5 hours per sortie (scheduled block time).
5. **Payment records** are 1:1 with cadets (one summary record per cadet, not transactional).
6. **Study activity** is measured relative to a reference date of `2026-05-15` (the assessment date).
7. **Risk scoring** uses a 90-day decay window for study inactivity — cadets inactive for >90 days receive maximum risk contribution from that component.
8. **Bases** are assumed to operate independently with no cross-base resource sharing.

---

## 6. Metrics Calculated

### Skynet Operations Metrics
| Metric | Description |
|--------|-------------|
| Sortie Completion Rate | Completed sorties / Total sorties |
| Average Delay | Mean delay_minutes for non-cancelled sorties |
| Cancellation Rate | Cancelled sorties / Total sorties |
| Cancellation Breakdown | Distribution by cancel_reason (Weather, Aircraft Defect, ATC Restriction, Instructor Unavailable) |
| Aircraft Utilization | Actual flight hours / Available hours per aircraft |

### TOGA Study Metrics
| Metric | Description |
|--------|-------------|
| Study Coverage | Average subject progress_pct per cadet |
| Quiz Performance | Average quiz_score across all subjects per cadet |
| Study Recency | Days since last TOGA activity per cadet |
| Study Readiness Score | Composite of coverage + quiz performance + recency |

### Finance Metrics
| Metric | Description |
|--------|-------------|
| Collection Efficiency | Total paid / Total invoiced |
| Outstanding Percentage | Outstanding amount / Invoiced amount per cadet |

### Training Progress Metrics
| Metric | Description |
|--------|-------------|
| Flight Progress | Completed sorties / Expected sorties per cadet |

---

## 7. Risk Score Explanation

Each cadet receives a **composite risk score from 0 to 100**, computed as a weighted average of five dimensions:

| Component | Weight | Source | Scoring Logic |
|-----------|--------|--------|--------------|
| Training Pace | 25% | Sorties | `(1 - flight_progress_pct) × 100` — lower flight progress = higher risk |
| Study Coverage | 20% | TOGA | `(1 - avg_subject_progress / 100) × 100` — lower coverage = higher risk |
| Knowledge Quality | 15% | TOGA | `(1 - avg_quiz_score / 100) × 100` — lower quiz scores = higher risk |
| Study Activity | 20% | TOGA | `min(days_since_last_study / 90, 1) × 100` — longer inactivity = higher risk |
| Financial Health | 20% | Payments | `outstanding_pct × 100` — higher outstanding = higher risk |

### Risk Levels
| Level | Score Range | Interpretation |
|-------|-----------|----------------|
| **Low** | 0–40 | On track; no intervention needed |
| **Medium** | 40–70 | Requires monitoring and targeted support |
| **High** | 70–100 | Critical; immediate intervention required |

Each cadet's **top 3 contributing risk factors** are identified and reported alongside their score, making the model fully explainable and actionable (e.g., *"Low flight progress (35%) | Study inactivity (22%) | Low study coverage (18%)"*).

---

## 8. Key Outputs

### Data Exports (`data/`)
| File | Description |
|------|-------------|
| `cleaned_outputs.csv` | Cleaned sorties with computed flight durations |
| `risk_scores.csv` | Risk scores for all 200 cadets with top reasons |
| `data_quality_issues.csv` | All data validation issues found |

### Visualizations (`charts/`)
| Chart | Description |
|-------|-------------|
| `aircraft_utilization.png` | Fleet utilization rates by aircraft |
| `cancellation_reasons.png` | Breakdown of sortie cancellation drivers |
| `cadet_progress.png` | Flight training progress by cadet |
| `study_readiness.png` | TOGA study readiness heatmap |
| `payment_risk.png` | Financial risk distribution |
| `cadet_risk_scores.png` | Explainable risk score bar chart |
| `flight_vs_study_progress.png` | Flight vs. study progress scatter (bubble = risk) |

### Written Reports (`reports/`)
| Report | Description |
|--------|-------------|
| `data_quality_report.md` | Data quality issues, scoring, and remediation recommendations |
| `executive_insights.md` | High-level strategic findings and action items |
| `methodology.md` | Analysis pipeline, model design, and technical documentation |
| `skynet_operations_analysis.md` | Flight operations metrics and operational recommendations |
| `toga_study_intelligence.md` | Study analytics, alignment analysis, and learning interventions |
| `finance_risk_analysis.md` | Revenue metrics, risk model results, and financial recommendations |

---

## 9. Known Limitations

1. **Synthetic data:** The analysis operates on generated data. Real-world datasets would likely exhibit different distributions, edge cases, and noise patterns.
2. **Static risk weights:** The risk scoring model uses fixed, illustrative weights (25/20/15/20/20). In production, these should be calibrated through domain expert consultation and validated against historical outcomes.
3. **No temporal payment history:** Payment data is a single snapshot per cadet (total invoiced/paid), not a time-series. This limits the ability to model payment behavior trends or predict future defaults.
4. **Study data granularity:** TOGA data is aggregated at the subject level. Session-level records would enable more precise learning pattern analysis (e.g., study duration, time-of-day preferences, spaced repetition effectiveness).
5. **Fixed flight duration:** All sorties use a fixed 1.5-hour block. Variable-duration flights would require different utilization calculations.
6. **No instructor effectiveness model:** While instructor workload is computed, no model exists to correlate instructor assignment with cadet outcomes.
7. **Cross-base effects ignored:** The analysis treats each base independently; cross-base transfers, shared resources, or weather correlation between nearby bases are not modeled.

---

## 10. What I Would Improve with More Time

1. **Machine learning risk model:** Replace the weighted-average approach with a trained classifier (e.g., gradient-boosted trees) using historical dropout/failure labels as the target.
2. **Time-series forecasting:** Build ARIMA/Prophet models for sortie demand forecasting and seasonal delay prediction.
3. **Interactive dashboard:** Deploy a Streamlit or Dash app with real-time filtering, drill-down, and cadet-level detail views.
4. **Network analysis:** Model instructor-cadet-aircraft relationships as a graph to identify scheduling bottlenecks and optimal resource allocation.
5. **Automated report generation:** Programmatically generate the markdown reports from notebook outputs, eliminating manual transcription.
6. **Payment behavior modeling:** With temporal payment data, build a churn/default prediction model to flag at-risk accounts before they become delinquent.
7. **Study path optimization:** Use TOGA quiz results to build an adaptive learning algorithm that recommends personalized study sequences.
8. **CI/CD pipeline:** Add automated data validation, notebook execution, and report generation as part of a continuous integration pipeline.
9. **Statistical testing:** Apply hypothesis tests (e.g., chi-square for cancellation patterns, t-tests for delay differences across bases) to validate insights with statistical rigor.

---

## 11. AI Tool Usage & Verification

**AI tools were used** in this project to assist with:

- **Report writing:** AI assisted in drafting the markdown reports in the `reports/` directory, synthesizing findings from the notebook analysis into structured documents.
- **README creation:** This README was drafted with AI assistance.

### Verification Process

All AI-generated content was verified through the following steps:

1. **Cross-referencing with source data:** Every metric, statistic, and finding mentioned in the reports was verified against the actual data files (`data/*.csv`) and the notebook outputs in `notebooks/analysis.ipynb`.
2. **Notebook execution:** The analysis notebook was executed end-to-end, and all chart outputs and CSV exports were validated to exist and contain expected data.
3. **Logical consistency checks:** Risk score formulas, data quality issue descriptions, and metric calculations were reviewed against the notebook source code to ensure accuracy.
4. **Manual spot-checking:** Sample records from `risk_scores.csv` and `data_quality_issues.csv` were manually verified against the raw data.

The core analytical logic — data cleaning, metric computation, risk scoring, and visualization — was implemented in the Jupyter notebook by the analyst. AI tools were used as a drafting aid for documentation, not as a replacement for analysis.

---

## Project Structure

```
Airman-DS-TA/
├── README.md                          # This file
├── data/
│   ├── aircraft.csv                   # Aircraft fleet metadata (25 records)
│   ├── cadets.csv                     # Cadet enrollment data (200 records)
│   ├── instructors.csv                # Instructor assignments (30 records)
│   ├── sorties.csv                    # Flight sortie records (12,001 records)
│   ├── toga_study.csv                 # TOGA study sessions (2,000 records)
│   ├── payments.csv                   # Cadet payment records (200 records)
│   ├── cleaned_outputs.csv            # [Generated] Cleaned sorties
│   ├── risk_scores.csv                # [Generated] Cadet risk scores
│   └── data_quality_issues.csv        # [Generated] Validation issues
├── notebooks/
│   ├── analysis.ipynb                 # Main analysis notebook
│   └── Data_generator.ipynb           # Synthetic data generation script
├── charts/
│   ├── aircraft_utilization.png       # Fleet utilization chart
│   ├── cancellation_reasons.png       # Cancellation drivers chart
│   ├── cadet_progress.png             # Training progress chart
│   ├── study_readiness.png            # Study readiness heatmap
│   ├── payment_risk.png               # Payment risk distribution
│   ├── cadet_risk_scores.png          # Risk score bar chart
│   └── flight_vs_study_progress.png   # Flight vs study scatter plot
├── dashboards/
│   ├── index.html                     # Interactive intelligence dashboard
│   ├── styles.css                     # Dashboard styling
│   ├── dashboard.js                   # Chart rendering & interactivity
│   └── risk_data.js                   # Cadet risk data (auto-generated)
└── reports/
    ├── data_quality_report.md         # Data quality findings
    ├── executive_insights.md          # Strategic insights summary
    ├── methodology.md                 # Analysis methodology
    ├── skynet_operations_analysis.md   # Skynet operations report
    ├── toga_study_intelligence.md      # TOGA study report
    └── finance_risk_analysis.md       # Finance & risk report
```

### Interactive Dashboard

To view the interactive dashboard, open `dashboards/index.html` in any modern browser:

```bash
# Option 1: Direct file open
open dashboards/index.html          # macOS
xdg-open dashboards/index.html     # Linux

# Option 2: Serve locally (recommended)
cd dashboards && python3 -m http.server 8080
# Then visit http://localhost:8080
```

The dashboard features animated KPIs, SVG donut charts, bar visualizations, a data quality summary, and a searchable/filterable risk table for all 200 cadets.
