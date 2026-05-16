# Methodology Report
## Airman Aeronautics — Data Science Technical Assessment

**Report Date:** May 2026  
**Data Period:** January 2025 – June 2025  
**Prepared by:** Data Science Assessment Team

---

## 1. Objective

To conduct a comprehensive data science assessment of Airman Aeronautics' operational and learning platforms (Skynet SaaS and TOGA), identifying data quality issues, computing operational metrics, generating risk scores, and producing actionable insights for management.

---

## 2. Data Sources

The assessment utilized six primary datasets:

| Dataset | Source | Records | Key Fields |
|---------|--------|---------|------------|
| `sorties.csv` | Skynet SaaS | 12,001 | sortie_id, cadet_id, instructor_id, aircraft_id, scheduled/actual times, status, delay, cancel_reason, lesson_type |
| `cadets.csv` | Skynet SaaS | 200 | cadet_id, name, course (PPL/CPL), enrollment_date, base_id |
| `instructors.csv` | Skynet SaaS | 30 | instructor_id, name, certification, base_id |
| `aircraft.csv` | Skynet SaaS | 25 | aircraft_id, type, available_hours, maintenance_downtime, defect_count |
| `toga_study.csv` | TOGA App | 2,000 | cadet_id, subject, progress_pct, quiz_score, last_activity_date |
| `payments.csv` | Finance | 200 | cadet_id, invoiced_amount, paid_amount, outstanding_amount, payment_status |

---

## 3. Analysis Pipeline

The analysis followed an 8-section pipeline implemented in `notebooks/analysis.ipynb`:

### Section 1: Data Quality Validation
- **Missing value detection** across all datasets
- **Logical consistency checks:**
  - Completed sorties must have actual start/end timestamps
  - Outstanding amounts must equal `invoiced - paid`
  - Maintenance downtime cannot exceed available hours
- **Defect threshold flagging** for aircraft with elevated defect counts (≥8)
- All issues exported to `data/data_quality_issues.csv`

### Section 2: Skynet Operations Analysis
- **Sortie status distribution:** completed, delayed, cancelled
- **Completion rate** = completed / total
- **Delay analysis:** mean, median, and distribution of delay_minutes for completed sorties
- **Cancellation breakdown** by `cancel_reason`
- **Aircraft utilization** = actual flight hours / available hours per aircraft

### Section 3: Instructor Workload Analysis
- Sortie counts per instructor
- Average delay per instructor
- Completion rate per instructor

### Section 4: TOGA Study Intelligence
- **Study coverage** = average `progress_pct` per subject per cadet
- **Quiz performance** = average `quiz_score` across subjects
- **Study recency** = days since `last_activity_date`
- **Study readiness score** = composite of coverage, quiz performance, and recency

### Section 5: Finance & Payment Analysis
- **Collection efficiency** = total paid / total invoiced
- **Outstanding distribution** by payment status
- **Payment risk profiling** based on outstanding percentage and overdue days

### Section 6: Composite Risk Scoring Model
A weighted risk score (0–100) was computed for each cadet:

| Component | Weight | Source | Scoring Logic |
|-----------|--------|--------|--------------|
| Training Pace | 25% | Sorties | `(1 - flight_progress_pct) × 100` |
| Study Coverage | 20% | TOGA | `(1 - avg_subject_progress / 100) × 100` |
| Knowledge Quality | 15% | TOGA | `(1 - avg_quiz_score / 100) × 100` |
| Study Activity | 20% | TOGA | `min(days_since_last_study / 90, 1) × 100` |
| Financial Health | 20% | Payments | `outstanding_pct × 100` |

**Risk Levels:**
- **Low:** 0–40
- **Medium:** 40–70
- **High:** 70–100

Each cadet's top 3 contributing risk factors are identified and reported alongside their score.

### Section 7: Visualization Suite
Seven charts were generated and saved to `charts/`:

1. `aircraft_utilization.png` — Bar chart of fleet utilization rates
2. `cancellation_reasons.png` — Breakdown of cancellation drivers
3. `cadet_progress.png` — Flight progress by cadet
4. `study_readiness.png` — TOGA study readiness heatmap
5. `payment_risk.png` — Financial risk distribution
6. `cadet_risk_scores.png` — Explainable risk score bar chart
7. `flight_vs_study_progress.png` — Scatter plot of flight vs. study progress with risk bubbles

### Section 8: Final Exports
- `data/cleaned_outputs.csv` — Cleaned sorties with computed flight durations
- `data/risk_scores.csv` — Full cadet risk scores with reasons
- `data/data_quality_issues.csv` — All validation issues found

---

## 4. Tools & Technologies

| Tool | Purpose |
|------|---------|
| Python 3.12 | Primary analysis language |
| pandas | Data manipulation and aggregation |
| matplotlib | Visualization and chart generation |
| Jupyter Notebook | Interactive analysis environment |

---

## 5. Design Decisions

1. **Risk score normalization:** All components are scaled to 0–100 before weighting to ensure fair contribution regardless of native scale.
2. **Missing data handling:** Cancelled sorties are excluded from delay and duration calculations but included in completion rate denominators.
3. **Study activity decay:** A 90-day window is used to normalize study recency; cadets inactive for >90 days receive the maximum risk contribution from this component.
4. **Visualization theming:** All charts use a dark theme (`#0d1117` background) with a consistent color palette for risk levels (green = low, amber = medium, red = high).

---

## 6. Limitations

- The analysis is based on a **synthetic dataset** generated for assessment purposes. Real-world data may exhibit different patterns and edge cases.
- The risk scoring model weights are **illustrative** and should be calibrated with domain expert input before operational deployment.
- TOGA study data granularity is limited to subject-level progress; session-level analytics would enable more precise learning pattern detection.
- Payment data does not include temporal payment history, limiting the ability to model payment behavior trends.

---

## 7. Reproducibility

The full analysis pipeline can be reproduced by executing `notebooks/analysis.ipynb` in order. All outputs are deterministic given the input datasets in `data/`.
