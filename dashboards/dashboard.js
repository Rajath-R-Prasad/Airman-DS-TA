// ── Airman Dashboard Data & Logic ──

const METRICS = {
  total: 12000, completed: 8660, delayed: 2102, cancelled: 1238,
  avgDelay: 30.8, aircraftCount: 25, cadetCount: 200, instructorCount: 30,
  totalInvoiced: 67402974, totalPaid: 52322999, totalOutstanding: 15129775,
  riskLow: 59, riskMed: 141, riskHigh: 0,
  collectionPct: ((52322999/67402974)*100).toFixed(1),
  completionPct: ((8660/12000)*100).toFixed(1),
  cancellationPct: ((1238/12000)*100).toFixed(1)
};

const CANCEL_REASONS = [
  { name: 'Weather', count: 664, color: '#6366f1' },
  { name: 'Aircraft Defect', count: 322, color: '#f87171' },
  { name: 'Instructor Unavail.', count: 128, color: '#fbbf24' },
  { name: 'ATC Restriction', count: 124, color: '#22d3ee' }
];

const LESSON_TYPES = [
  { name: 'Cross Country', count: 2208, color: '#6366f1' },
  { name: 'Circuit', count: 2197, color: '#22d3ee' },
  { name: 'Navigation', count: 2178, color: '#34d399' },
  { name: 'General Handling', count: 2104, color: '#a78bfa' },
  { name: 'Night Flying', count: 2075, color: '#fbbf24' }
];

const BASES = [
  { name: 'Bangalore', count: 2830, color: '#6366f1' },
  { name: 'Chennai', count: 2584, color: '#22d3ee' },
  { name: 'Hyderabad', count: 2412, color: '#34d399' },
  { name: 'Mysuru', count: 2367, color: '#a78bfa' },
  { name: 'Pune', count: 1807, color: '#fbbf24' }
];

// Risk scores data (all 200 cadets) - loaded from inline
let RISK_DATA = [];

function formatCurrency(n) {
  if (n >= 10000000) return '₹' + (n/10000000).toFixed(1) + ' Cr';
  if (n >= 100000) return '₹' + (n/100000).toFixed(1) + ' L';
  return '₹' + n.toLocaleString('en-IN');
}

function formatNum(n) { return n.toLocaleString('en-IN'); }

// ── SVG Donut Chart ──
function createDonut(containerId, segments, centerValue, centerLabel) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const r = 72, cx = 90, cy = 90, circumference = 2 * Math.PI * r;
  let offset = 0;
  let circles = '';
  segments.forEach(seg => {
    const pct = seg.value / total;
    const dash = circumference * pct;
    circles += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${seg.color}" stroke-width="14" stroke-dasharray="${dash} ${circumference - dash}" stroke-dashoffset="${-offset}" stroke-linecap="round" opacity="0.9"/>`;
    offset += dash;
  });
  const svg = `<svg width="180" height="180" viewBox="0 0 180 180">${circles}</svg>`;
  const center = `<div class="donut-center"><div class="value">${centerValue}</div><div class="label">${centerLabel}</div></div>`;
  const legendItems = segments.map(s => {
    const pct = ((s.value/total)*100).toFixed(1);
    return `<div class="legend-item"><span class="legend-dot" style="background:${s.color}"></span><span>${s.label}</span><span class="legend-value">${formatNum(s.value)} (${pct}%)</span></div>`;
  }).join('');

  container.innerHTML = `
    <div class="donut-container">
      <div class="donut-wrapper">${svg}${center}</div>
      <div class="donut-legend">${legendItems}</div>
    </div>`;
}

// ── Bar Charts ──
function createBars(containerId, items, maxVal) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const max = maxVal || Math.max(...items.map(i => i.count));
  container.innerHTML = items.map(item => {
    const pct = (item.count / max * 100).toFixed(1);
    return `<div class="bar-row">
      <div class="bar-label">${item.name}</div>
      <div class="bar-track">
        <div class="bar-fill" style="width:0;background:${item.color}" data-width="${pct}%">${formatNum(item.count)}</div>
      </div>
    </div>`;
  }).join('');
}

// ── Risk Table ──
function renderRiskTable(data) {
  const tbody = document.getElementById('risk-tbody');
  if (!tbody) return;
  tbody.innerHTML = data.map(r => {
    const cls = r.risk_level === 'Low' ? 'risk-low' : r.risk_level === 'Medium' ? 'risk-medium' : 'risk-high';
    const barColor = r.risk_level === 'Low' ? '#34d399' : r.risk_level === 'Medium' ? '#fbbf24' : '#f87171';
    const score = parseFloat(r.risk_score);
    return `<tr>
      <td style="font-weight:600;color:var(--text-primary)">${r.cadet_id}</td>
      <td style="color:var(--text-primary)">${r.name}</td>
      <td><span style="padding:2px 8px;border-radius:4px;background:rgba(99,102,241,0.12);color:#a78bfa;font-weight:600;font-size:0.72rem">${r.course}</span></td>
      <td><div class="score-bar-mini"><div class="fill" style="width:${score}%;background:${barColor}"></div></div><span style="font-family:'JetBrains Mono';font-weight:600;color:var(--text-primary)">${score.toFixed(1)}</span></td>
      <td><span class="risk-badge ${cls}">${r.risk_level}</span></td>
      <td class="reasons-text">${r.main_reasons}</td>
    </tr>`;
  }).join('');
}

function filterRiskTable() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  const filtered = RISK_DATA.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(query) || r.cadet_id.toLowerCase().includes(query);
    const matchFilter = activeFilter === 'all' || r.risk_level.toLowerCase() === activeFilter;
    return matchSearch && matchFilter;
  });
  renderRiskTable(filtered);
  document.getElementById('showing-count').textContent = `Showing ${filtered.length} of ${RISK_DATA.length} cadets`;
}

// ── Animate bars on scroll ──
function animateBars() {
  document.querySelectorAll('.bar-fill').forEach(bar => {
    const w = bar.dataset.width;
    if (w) setTimeout(() => { bar.style.width = w; }, 100);
  });
}

// ── Animate numbers ──
function animateValue(el, end, duration, prefix, suffix) {
  prefix = prefix || '';
  suffix = suffix || '';
  let start = 0;
  const step = end / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= end) { start = end; clearInterval(timer); }
    if (end >= 1000000) el.textContent = prefix + formatCurrency(Math.floor(start));
    else if (Number.isInteger(end)) el.textContent = prefix + formatNum(Math.floor(start)) + suffix;
    else el.textContent = prefix + start.toFixed(1) + suffix;
  }, 16);
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  // Animate KPI values
  document.querySelectorAll('[data-animate-to]').forEach(el => {
    const val = parseFloat(el.dataset.animateTo);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    animateValue(el, val, 1200, prefix, suffix);
  });

  // Donut: Sortie Status
  createDonut('donut-sorties', [
    { value: 8660, color: '#34d399', label: 'Completed' },
    { value: 2102, color: '#fbbf24', label: 'Delayed' },
    { value: 1238, color: '#f87171', label: 'Cancelled' }
  ], METRICS.completionPct + '%', 'Completion');

  // Donut: Risk Distribution
  createDonut('donut-risk', [
    { value: 59, color: '#34d399', label: 'Low Risk (0-40)' },
    { value: 141, color: '#fbbf24', label: 'Medium Risk (40-70)' },
    { value: 0, color: '#f87171', label: 'High Risk (70-100)' }
  ], '200', 'Cadets');

  // Donut: Finance
  createDonut('donut-finance', [
    { value: METRICS.totalPaid, color: '#34d399', label: 'Collected' },
    { value: METRICS.totalOutstanding, color: '#f87171', label: 'Outstanding' }
  ], METRICS.collectionPct + '%', 'Collection');

  // Bar charts
  createBars('bars-cancel', CANCEL_REASONS);
  createBars('bars-lessons', LESSON_TYPES);
  createBars('bars-bases', BASES);

  // Animate bars after a short delay
  setTimeout(animateBars, 300);

  // Stagger card animations
  document.querySelectorAll('.animate-in').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.08}s`;
  });

  // Risk table search & filter
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.addEventListener('input', filterRiskTable);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterRiskTable();
    });
  });

  // Initial render
  if (RISK_DATA.length > 0) {
    renderRiskTable(RISK_DATA);
    document.getElementById('showing-count').textContent = `Showing ${RISK_DATA.length} of ${RISK_DATA.length} cadets`;
  }
});
