# Skynet Operations Analysis
## Airman Aeronautics — Data Science Technical Assessment

**Report Date:** May 2026 | **Data Period:** Jan–Jun 2025

---

## 1. Sortie Execution Summary

| Metric | Value |
|--------|-------|
| Total Sorties | 12,001 |
| Completed | ~10,760 (~89.7%) |
| Cancelled | ~1,240 (~10.3%) |
| Average Delay | ~16–26 min |

## 2. Delay Analysis

- Majority of delays fall in the 0–30 minute range
- ~30% of non-cancelled sorties experience delays >60 minutes
- Delays are systemic, not concentrated on specific instructors or aircraft

**Recommendation:** Dynamic buffer allocation in scheduling.

## 3. Cancellation Analysis

| Reason | Share |
|--------|-------|
| Weather | ~40–45% |
| Aircraft Defect | ~25–30% |
| ATC Restriction | ~15–20% |
| Instructor Unavailable | ~5–10% |

Weather is the dominant driver. Integration of weather APIs into Skynet's scheduling engine could enable proactive rescheduling. Aircraft defect cancellations correlate with aircraft flagged for high defect counts (A001, A010, A012, A013, A015, A017, A024, A025).

**Visualization:** `charts/cancellation_reasons.png`

## 4. Aircraft Utilization

- **Fleet Size:** 25 aircraft
- **Average Utilization:** ~2.9%
- No aircraft exceeds 10% utilization — the underutilization is systemic

This indicates the fleet is significantly oversized relative to demand, or scheduling is not optimized for maximum aircraft rotation.

**Visualization:** `charts/aircraft_utilization.png`

## 5. Key Recommendations

| # | Recommendation | Priority |
|---|---------------|----------|
| 1 | Integrate weather forecasting into scheduling | High |
| 2 | Implement predictive maintenance | High |
| 3 | Optimize fleet utilization via dynamic scheduling | High |
| 4 | Conduct fleet right-sizing analysis | Medium |
| 5 | Introduce delay KPI dashboards | Medium |
| 6 | Improve instructor availability management | Low |
