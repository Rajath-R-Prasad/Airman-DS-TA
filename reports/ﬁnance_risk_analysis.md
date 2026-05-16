# Finance & Risk Analysis Report
## Airman Aeronautics — Data Science Technical Assessment

**Report Date:** May 2026 | **Data Period:** Jan–Jun 2025

---

## 1. Overview

This report analyzes the financial health of Airman Aeronautics' cadet payment ecosystem and the composite risk scoring model applied to all 200 cadets.

---

## 2. Revenue & Collection Summary

| Metric | Value |
|--------|-------|
| Total Invoiced | ₹8,50,000 |
| Total Paid | ₹6,10,000 |
| Total Outstanding | ₹2,40,000 |
| Collection Efficiency | ~71.8% |

A collection efficiency of ~72% is below industry benchmarks for training academies (typically 85–90%). The ₹2,40,000 outstanding balance represents material cash flow risk.

## 3. Payment Status Distribution

Cadets fall into the following payment categories:
- **Fully Paid:** Cadets with zero outstanding balance
- **Partially Paid:** Cadets with partial payments and remaining outstanding
- **Overdue:** Cadets with payments past due date

**Visualization:** `charts/payment_risk.png`

## 4. Data Integrity Flags

10 cadets have been flagged with **outstanding amount mismatches** (see Data Quality Report):
`C010, C032, C054, C062, C088, C096, C100, C104, C132, C151`

For these cadets, the recorded `outstanding_amount` does not match `invoiced_amount - paid_amount`, indicating data entry errors or system reconciliation failures.

## 5. Composite Risk Scoring Model

### 5.1 Model Design

Each cadet receives a weighted risk score (0–100):

| Component | Weight | Description |
|-----------|--------|-------------|
| Training Pace | 25% | Flight progress relative to expected |
| Study Coverage | 20% | Average TOGA subject completion |
| Knowledge Quality | 15% | Average quiz scores |
| Study Activity | 20% | Days since last study session (90-day decay) |
| Financial Health | 20% | Outstanding payment percentage |

### 5.2 Risk Distribution

| Risk Level | Score Range | Cadet Count | Percentage |
|------------|-----------|-------------|------------|
| **Low** | 0–40 | ~70 | ~35% |
| **Medium** | 40–70 | ~130 | ~65% |
| **High** | 70–100 | 0 | 0% |

No cadets currently fall into the High Risk category, but the concentration of ~65% in Medium Risk warrants proactive monitoring.

### 5.3 Top Risk Drivers

The most frequently appearing risk factors (as primary contributors):

1. **Low flight progress** — most common primary driver
2. **Study inactivity** — nearly universal secondary driver
3. **Low study coverage** — frequently in top 3
4. **Payment outstanding** — appears for ~15% of cadets
5. **Low quiz scores** — appears for ~10% of cadets

**Visualization:** `charts/cadet_risk_scores.png`

## 6. Sample Risk Profiles

| Cadet | Course | Risk Score | Level | Top Risk Drivers |
|-------|--------|-----------|-------|-----------------|
| Arjun Menon (sample) | PPL | 26.5 | Low | Study inactivity, Low quiz scores |
| Meera Iyer (sample) | CPL | 49.3 | Medium | Low flight progress, Study inactivity |
| Rahul Nair (sample) | CPL | 67.0 | Medium | Low flight progress, Low study coverage, Payment outstanding |

*Note: Sample names from the assessment notebook. Full risk profiles for all 200 cadets are available in `data/risk_scores.csv`.*

## 7. Key Recommendations

| # | Recommendation | Priority |
|---|---------------|----------|
| 1 | Automate payment reminders for overdue accounts | High |
| 2 | Reconcile payment data for the 10 flagged cadets | High |
| 3 | Implement early-warning triggers at 50+ risk score | Medium |
| 4 | Offer structured payment plans for financially stressed cadets | Medium |
| 5 | Operationalize risk scoring into Skynet/TOGA dashboards | Medium |
| 6 | Calibrate model weights with domain expert input | Low |

---

*Refer to `charts/payment_risk.png` and `charts/cadet_risk_scores.png` for supporting visualizations. Full risk data: `data/risk_scores.csv`.*
