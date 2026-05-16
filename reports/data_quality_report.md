# Data Quality Report
## Airman Aeronautics — Data Science Technical Assessment

**Report Date:** May 2026  
**Data Period:** January 2025 – June 2025  
**Prepared by:** Data Science Assessment Team

---

## 1. Executive Summary

This report documents the data quality issues identified across the Airman Aeronautics data ecosystem, spanning the **Skynet SaaS** (flight operations) and **TOGA** (study/learning) platforms. A total of **7 distinct data quality issues** were flagged across 3 datasets (`sorties.csv`, `payments.csv`, `aircraft.csv`), with severities ranging from Medium to High.

---

## 2. Data Sources Audited

| Dataset | Records | Fields | Description |
|---------|---------|--------|-------------|
| `sorties.csv` | 12,001 | 14 | Flight sortie records (scheduling, execution, outcomes) |
| `payments.csv` | 200 | 8 | Cadet payment and invoicing records |
| `aircraft.csv` | 25 | 8 | Aircraft fleet metadata and maintenance logs |
| `cadets.csv` | 200 | 6 | Cadet enrollment and course information |
| `instructors.csv` | 30 | 4 | Instructor assignment and certification data |
| `toga_study.csv` | 2,000 | 7 | TOGA study session records |

---

## 3. Issues Identified

### 3.1 Missing Values — Sorties

| Field | Missing Count | Missing % | Severity |
|-------|--------------|-----------|----------|
| `actual_start` | 1,253 | 10.4% | Medium |
| `actual_end` | 1,238 | 10.3% | Medium |
| `cancel_reason` | 10,762 | 89.7% | High |

**Analysis:**
- The `actual_start` and `actual_end` fields have ~10% missing values. These correspond to cancelled sorties where no actual flight took place. This is expected behavior but requires careful handling during flight duration calculations.
- The `cancel_reason` field shows 89.7% missing values. This is **not a true data quality issue** — the field is only populated for cancelled sorties. Of the ~1,240 cancelled sorties, all have valid cancel reasons. The remaining ~10,760 completed/delayed sorties correctly have null values for this field.

### 3.2 Completed Sorties Without Actual Times (High Severity)

**Affected Records:** 11 sortie IDs  
`S03241, S03264, S03777, S04381, S04622, S05044, S07084, S07735, S07871, S09951, S11472`

**Impact:** These sorties are recorded as `completed` but lack `actual_start` and `actual_end` timestamps. This prevents accurate computation of:
- Flight duration
- Delay metrics
- Aircraft utilization rates

**Recommendation:** Flag for manual review. Cross-reference with instructor logs and ATC records to recover missing timestamps, or reclassify status if flights did not actually occur.

### 3.3 Outstanding Amount Mismatch — Payments (High Severity)

**Affected Cadet IDs:** `C010, C032, C054, C062, C088, C096, C100, C104, C132, C151`

**Issue:** The computed outstanding amount (`invoiced_amount - paid_amount`) does not match the recorded `outstanding_amount` field for these 10 cadets.

**Impact:** Financial reporting and risk scoring accuracy is compromised. Downstream cadet risk models that incorporate payment health may produce skewed results.

**Recommendation:** Reconcile payment records with the billing system. Implement automated validation checks to flag discrepancies in real time.

### 3.4 Maintenance Downtime Exceeds Available Hours — Aircraft (High Severity)

**Affected Aircraft IDs:** `A001, A004, A005`

**Issue:** For these 3 aircraft, `maintenance_downtime_hours` exceeds the total `available_hours`, which is logically impossible.

**Impact:** Aircraft utilization calculations become unreliable. Fleet availability metrics will be inflated or deflated depending on how the anomaly is handled.

**Recommendation:** Audit maintenance logs for these aircraft. Likely causes include data entry errors or overlapping maintenance windows that were double-counted.

### 3.5 High Defect Counts — Aircraft (Medium Severity)

**Affected Aircraft:**

| Aircraft ID | Defect Count |
|-------------|-------------|
| A001 | 10 |
| A010 | 13 |
| A012 | 15 |
| A013 | 9 |
| A015 | 8 |
| A017 | 14 |
| A024 | 15 |
| A025 | 9 |

**Impact:** While not a data integrity issue per se, elevated defect counts signal potential fleet reliability concerns. Aircraft with ≥8 defects should be flagged for priority maintenance reviews.

---

## 4. Data Quality Scoring

| Dimension | Score | Notes |
|-----------|-------|-------|
| **Completeness** | 7/10 | Missing actual times for some completed sorties |
| **Accuracy** | 6/10 | Payment mismatches and impossible maintenance values |
| **Consistency** | 8/10 | Most cross-dataset references are valid |
| **Timeliness** | 9/10 | Data appears current within the assessment period |
| **Validity** | 7/10 | Logical violations in aircraft maintenance data |

**Overall Data Quality Score: 7.4 / 10**

---

## 5. Recommendations

1. **Implement validation rules** at the data ingestion layer to catch null `actual_start`/`actual_end` for completed sorties before they enter the warehouse.
2. **Automate payment reconciliation** to flag outstanding amount mismatches daily.
3. **Add constraint checks** for aircraft maintenance data (downtime cannot exceed available hours).
4. **Establish a defect threshold alerting system** for aircraft with ≥8 active defects.
5. **Create a data quality dashboard** that monitors these metrics in real time across Skynet and TOGA systems.

---

## 6. Appendix

- Raw issues exported to: `data/data_quality_issues.csv`
- Cleaned sortie data exported to: `data/cleaned_outputs.csv`
- Analysis notebook: `notebooks/analysis.ipynb`
