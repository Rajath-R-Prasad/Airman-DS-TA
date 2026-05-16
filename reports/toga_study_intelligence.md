# TOGA Study Intelligence Report
## Airman Aeronautics — Data Science Technical Assessment

**Report Date:** May 2026 | **Data Period:** Jan–Jun 2025

---

## 1. Overview

This report analyzes cadet learning performance through the **TOGA App**, covering study coverage, quiz performance, study recency, and personalized readiness scoring for 200 cadets across PPL and CPL programs.

---

## 2. Study Coverage

- **Metric:** Average subject progress percentage per cadet
- Study coverage varies widely, with some cadets achieving >80% and others below 30%
- The most common risk factor across cadets is **"Low study coverage"**, appearing as a top-3 risk driver for ~60% of the cohort

## 3. Quiz Performance

- **Metric:** Average quiz score across all subjects per cadet
- Quiz scores generally follow a normal distribution, with the mean around 55–65%
- Low quiz scores appear as a risk driver for a smaller subset (~10–15% of cadets), suggesting quiz performance is generally acceptable but study coverage and consistency need improvement

## 4. Study Activity & Recency

- **Metric:** Days since last TOGA study session
- **Study inactivity** is the single most prevalent risk factor, appearing as a top-3 driver for nearly every cadet
- A 90-day decay window normalizes this metric: cadets inactive for >90 days receive maximum risk contribution

This finding indicates that while cadets may have reasonable cumulative coverage, many are not maintaining consistent study habits.

## 5. Study Readiness Score

The Study Readiness Score is a composite metric combining:
- Subject progress coverage
- Quiz score performance
- Study recency/activity

**Visualization:** `charts/study_readiness.png`

## 6. Flight vs. Study Alignment

A critical finding is the **misalignment between flight progress and study progress** for many cadets:

- **Ideal Zone (High flight + High study):** A minority of cadets
- **High Risk Zone (Low flight + Low study):** Several cadets requiring urgent intervention
- **Flight Ahead of Study:** Cadets progressing through practical training without adequate theoretical grounding — a potential safety concern
- **Study Ahead of Flight:** Less common but indicates scheduling bottlenecks

**Visualization:** `charts/flight_vs_study_progress.png`

## 7. Personalized Recommendations

Based on TOGA data, each cadet can receive targeted interventions:

| Risk Driver | Intervention |
|-------------|-------------|
| Low study coverage | Assign subject-specific study plans with milestone targets |
| Study inactivity | Trigger push notification reminders after 7+ days of inactivity |
| Low quiz scores | Enable remedial quiz modules and spaced repetition |
| Study-flight misalignment | Synchronize study milestones with flight lesson progression |

## 8. Key Recommendations

| # | Recommendation | Priority |
|---|---------------|----------|
| 1 | Deploy automated study inactivity alerts via TOGA | High |
| 2 | Synchronize TOGA study milestones with Skynet flight curriculum | High |
| 3 | Introduce adaptive learning paths based on quiz performance | Medium |
| 4 | Create instructor visibility into cadet study metrics | Medium |
| 5 | Gamify study engagement with streaks and achievements | Low |

---

*Refer to `charts/study_readiness.png`, `charts/cadet_progress.png`, and `charts/flight_vs_study_progress.png` for supporting visualizations.*
