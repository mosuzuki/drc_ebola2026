const DATA_PATHS = {
  cases: 'data/cases_by_hz.csv',
  reports: 'data/report_summary.csv',
  finalSize: 'data/final_size_projection.json',
  ugandaEvd: 'data/uganda_evd_summary.csv'
};

const I18N = {
  ja: {
    pageEyebrow: '自動更新型 SitRep ダッシュボード',
    pageTitle: 'DRC エボラ流行ダッシュボード 2026',
    pageSubtitle: 'DRCのSitRepから抽出した確定症例・死亡例・health zone別分布・短期予測・最終サイズ推定を簡潔に表示します。',
    dataStatusLabel: 'データ更新状況',
    loading: '読み込み中',
    autoUpdate: 'SitRep自動取得機能はGitHub Actionsで6時間ごとに実行されます。OpenAI API keyを設定すると、ルールベース抽出が失敗した場合の補助抽出に使われます。',
    kpiTotalLabel: 'DRC 確定症例数',
    kpiDrcDeathsLabel: 'DRC 確定死亡数',
    kpiUgandaCasesLabel: 'ウガンダ 確定症例数',
    kpiUgandaDeathsLabel: 'ウガンダ 確定死亡数',
    cfr: 'CFR',
    asOf: '報告日',
    source: '出典',
    mapTitle: 'Health zone別エボラ確定症例',
    mapDescription: '確定症例をhealth zone重心上の比例円で表示します。',
    fitMap: '地図を合わせる',
    sitrepTimePointTitle: 'SitRep時点',
    sitrepTimePointHelp: '報告日別に累積症例または直近1週間の増加を表示します。',
    reportingDateMapTitle: '地図に表示する報告日',
    cumulativeCases: '累積症例',
    recentIncrease: '直近1週間の増加',
    cumulative: '累積',
    recentButton: '直近1週間',
    legendCases: '確定症例',
    legendRecent: '直近1週間の増加',
    reportedCasesTitle: '累積症例数',
    reportedCasesDesc: 'DRC確定症例数をSitRep報告日別に表示します。地図で選択中の日付を強調します。',
    forecastTitle: '短期予測',
    forecastDesc: '選択したSitRep時点からの短期予測です。最終サイズ推定データ内のensemble軌道を使用しています。',
    finalSizeTitle: 'アウトブレイク最終サイズ推定',
    finalSizeDesc: 'Branching processとAI支援による過去流行マッチングを組み合わせた推定です。',
    footerText: 'INSP DRC SitRep PDFからGitHub Actionsで自動更新します。予測は探索的推定であり、専門家による確認が必要です。',
    median: '中央値',
    interval90: '90%区間',
    endDate: '終息日の中央値',
    currentCases: '現在の累積症例数',
    model: 'モデル',
    noData: '表示できるデータがありません。',
    selectedDate: '選択日',
    cases: '症例',
    deaths: '死亡',
    projected: '予測中央値',
    uncertainty: '不確実性区間',
    healthZone: 'Health zone',
    province: 'Province',
    confirmedCases: '確定症例',
    confirmedDeaths: '確定死亡',
    unknown: '不明',
    latest: '最新'
  },
  en: {
    pageEyebrow: 'Auto-updated SitRep dashboard',
    pageTitle: 'DRC Ebola Outbreak Dashboard 2026',
    pageSubtitle: 'A simplified dashboard showing confirmed cases, deaths, health-zone distribution, short-term projection and final-size estimation extracted from DRC SitReps.',
    dataStatusLabel: 'Data status',
    loading: 'Loading',
    autoUpdate: 'The SitRep auto-update workflow runs every 6 hours in GitHub Actions. Once configured, the OpenAI API key is used only as a fallback when rule-based extraction fails.',
    kpiTotalLabel: 'DRC confirmed cases',
    kpiDrcDeathsLabel: 'DRC confirmed deaths',
    kpiUgandaCasesLabel: 'Uganda confirmed cases',
    kpiUgandaDeathsLabel: 'Uganda confirmed deaths',
    cfr: 'CFR',
    asOf: 'Reporting date',
    source: 'Source',
    mapTitle: 'Confirmed Ebola cases by health zone',
    mapDescription: 'Confirmed cases are shown as proportional bubbles at health-zone centroids.',
    fitMap: 'Fit map',
    sitrepTimePointTitle: 'SitRep time point',
    sitrepTimePointHelp: 'Show cumulative cases or the most recent 1-week increase by reporting date.',
    reportingDateMapTitle: 'Reporting date shown on map',
    cumulativeCases: 'Cumulative cases',
    recentIncrease: 'Recent 1-week increase',
    cumulative: 'Cumulative',
    recentButton: 'Recent 1 week',
    legendCases: 'Confirmed cases',
    legendRecent: 'Recent 1-week increase',
    reportedCasesTitle: 'Cumulative cases',
    reportedCasesDesc: 'DRC confirmed cases by SitRep reporting date. The date selected on the map is highlighted.',
    forecastTitle: 'Short-term projection',
    forecastDesc: 'Short-term projection from the selected SitRep time point using the ensemble trajectory in the final-size projection data.',
    finalSizeTitle: 'Estimated final outbreak size',
    finalSizeDesc: 'A projection combining a branching process model and AI-assisted historical matching.',
    footerText: 'Data are updated from INSP DRC SitRep PDFs by scheduled GitHub Actions. Projections are exploratory and should be reviewed by experts.',
    median: 'Median',
    interval90: '90% interval',
    endDate: 'Median end date',
    currentCases: 'Current cumulative cases',
    model: 'Model',
    noData: 'No displayable data.',
    selectedDate: 'Selected date',
    cases: 'Cases',
    deaths: 'Deaths',
    projected: 'Projected median',
    uncertainty: 'Uncertainty interval',
    healthZone: 'Health zone',
    province: 'Province',
    confirmedCases: 'Confirmed cases',
    confirmedDeaths: 'Confirmed deaths',
    unknown: 'Unknown',
    latest: 'Latest'
  }
};

let state = {
  lang: localStorage.getItem('drcEbola2026Lang') || 'ja',
  cases: [],
  reports: [],
  finalSize: null,
  ugandaEvd: [],
  dates: [],
  selectedIndex: 0,
  caseMode: 'cumulative',
  map: null,
  baseLayer: null,
  caseLayer: null
};

const nf = new Intl.NumberFormat('en-US');
const $ = (id) => document.getElementById(id);
const t = (key) => (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || key;
const toNumber = (v) => {
  if (v === null || v === undefined || v === '') return 0;
  const n = Number(String(v).replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};
const fmt = (v) => nf.format(Math.round(toNumber(v)));
const safeText = (v, fallback = '—') => (v === null || v === undefined || v === '' ? fallback : String(v));

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value;
}

function parseCsv(path) {
  return new Promise((resolve, reject) => {
    Papa.parse(path, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (res) => resolve(res.data || []),
      error: reject
    });
  });
}

async function loadJson(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function latestReport() {
  return state.reports[state.reports.length - 1] || {};
}

function selectedDate() {
  return state.dates[state.selectedIndex] || '';
}

function sortReports(rows) {
  return rows
    .filter(r => r.reporting_date)
    .sort((a, b) => String(a.reporting_date).localeCompare(String(b.reporting_date)));
}

function reportsByDate() {
  const map = new Map();
  state.reports.forEach(r => map.set(r.reporting_date, r));
  return map;
}

function caseRowsForDate(date) {
  return state.cases.filter(r => r.date === date && toNumber(r.confirmed_cases) > 0);
}

function dateDaysBefore(date, days) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function previousDateAtLeast7Days(date) {
  const threshold = dateDaysBefore(date, 7);
  const candidates = state.dates.filter(d => d <= threshold);
  return candidates[candidates.length - 1] || null;
}

function casesByZone(date) {
  const out = new Map();
  caseRowsForDate(date).forEach(r => {
    const key = r.zone_id || `${r.province}:${r.health_zone}`;
    out.set(key, { ...r, confirmed_cases: toNumber(r.confirmed_cases), confirmed_deaths: toNumber(r.confirmed_deaths) });
  });
  return out;
}

function mapRowsForSelectedDate() {
  const date = selectedDate();
  const current = casesByZone(date);
  if (state.caseMode === 'cumulative') return Array.from(current.values());

  const prevDate = previousDateAtLeast7Days(date);
  const previous = prevDate ? casesByZone(prevDate) : new Map();
  const rows = [];
  current.forEach((r, key) => {
    const prevCases = previous.get(key)?.confirmed_cases || 0;
    const inc = Math.max(0, toNumber(r.confirmed_cases) - prevCases);
    if (inc > 0) rows.push({ ...r, recent_cases: inc, previous_date: prevDate });
  });
  return rows;
}

function applyLanguage() {
  document.documentElement.lang = state.lang;
  $('langJa').classList.toggle('active', state.lang === 'ja');
  $('langEn').classList.toggle('active', state.lang === 'en');

  ['pageEyebrow','pageTitle','pageSubtitle','dataStatusLabel','kpiTotalLabel','kpiDrcDeathsLabel','kpiUgandaCasesLabel','kpiUgandaDeathsLabel','mapTitle','mapDescription','fitMap','sitrepTimePointTitle','sitrepTimePointHelp','reportingDateMapTitle','legendCases','legendRecent','reportedCasesTitle','reportedCasesDesc','forecastTitle','forecastDesc','finalSizeTitle','finalSizeDesc','footerText'].forEach(id => setText(id, t(id)));
  setText('modeCumulativeCases', t('cumulative'));
  setText('modeRecentIncrease', t('recentButton'));
  updateAll();
}

function latestUgandaEvd() {
  return (state.ugandaEvd || [])
    .filter(r => r.as_of_date)
    .slice()
    .sort((a, b) => String(a.as_of_date).localeCompare(String(b.as_of_date)))
    .slice(-1)[0] || null;
}

function updateStatusAndKpis() {
  const r = latestReport();
  if (!r.reporting_date) return;
  const ug = latestUgandaEvd();
  const ugCases = ug ? toNumber(ug.cumulative_confirmed_cases) : toNumber(r.uganda_confirmed_cases);
  const ugDeaths = ug ? toNumber(ug.cumulative_deaths) : toNumber(r.uganda_confirmed_deaths);
  const cfr = toNumber(r.drc_confirmed_cases) ? (100 * toNumber(r.drc_confirmed_deaths) / toNumber(r.drc_confirmed_cases)) : 0;
  setText('dataStatus', `${r.report_no || t('latest')} | ${t('asOf')}: ${r.reporting_date}`);
  setText('lastUpdated', `${t('autoUpdate')} ${r.publication_date ? `Publication: ${r.publication_date}.` : ''}`);
  setText('kpiTotal', fmt(r.drc_confirmed_cases));
  setText('kpiDrcDeaths', fmt(r.drc_confirmed_deaths));
  setText('kpiUgandaCases', fmt(ugCases));
  setText('kpiUgandaDeaths', fmt(ugDeaths));
  setText('kpiTotalNote', `${safeText(r.report_no)} | ${t('asOf')}: ${safeText(r.reporting_date)}`);
  setText('kpiDrcDeathsNote', `${t('cfr')}: ${cfr.toFixed(1)}%`);
  setText('kpiUgandaCasesNote', ug ? `Uganda MoH EVD daily page | ${t('asOf')}: ${safeText(ug.as_of_date)}` : `${t('source')}: ${safeText(r.source)}`);
  setText('kpiUgandaDeathsNote', ug ? `Imported ${fmt(ug.imported_cases)} / local ${fmt(ug.local_cases)}` : `${t('asOf')}: ${safeText(r.reporting_date)}`);
}

function initControls() {
  $('langJa').addEventListener('click', () => { state.lang = 'ja'; localStorage.setItem('drcEbola2026Lang', state.lang); applyLanguage(); });
  $('langEn').addEventListener('click', () => { state.lang = 'en'; localStorage.setItem('drcEbola2026Lang', state.lang); applyLanguage(); });
  $('modeCumulativeCases').addEventListener('click', () => { state.caseMode = 'cumulative'; updateAll(); });
  $('modeRecentIncrease').addEventListener('click', () => { state.caseMode = 'recent'; updateAll(); });
  $('reportDateSlider').addEventListener('input', (e) => { state.selectedIndex = Number(e.target.value); syncDateControls(); updateAll(); });
  $('reportDateSelect').addEventListener('change', (e) => { state.selectedIndex = state.dates.indexOf(e.target.value); syncDateControls(); updateAll(); });
  $('fitMap').addEventListener('click', fitMapToCases);
  $('forecastHorizonSelect').addEventListener('change', drawForecast);
  $('forecastSiSelect')?.addEventListener('change', drawForecast);
  $('finalSizeScenarioSelect').addEventListener('change', drawFinalSize);
  window.addEventListener('resize', () => {
    ['epiTimelineChart', 'forecastChart', 'finalSizeChart'].forEach(id => Plotly.Plots.resize($(id)));
    if (state.map) setTimeout(() => state.map.invalidateSize(), 100);
  });
}

function initDateControls() {
  const slider = $('reportDateSlider');
  const select = $('reportDateSelect');
  const ticks = $('reportDateTicks');
  slider.min = 0;
  slider.max = Math.max(0, state.dates.length - 1);
  state.selectedIndex = Math.max(0, state.dates.length - 1);
  select.innerHTML = '';
  ticks.innerHTML = '';
  state.dates.forEach((d, i) => {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    select.appendChild(opt);
    const tick = document.createElement('option');
    tick.value = i;
    tick.label = d.slice(5);
    ticks.appendChild(tick);
  });
  syncDateControls();
}

function syncDateControls() {
  const d = selectedDate();
  $('reportDateSlider').value = state.selectedIndex;
  $('reportDateSelect').value = d;
  setText('reportDateSliderLabel', d ? `${d}${state.selectedIndex === state.dates.length - 1 ? ` (${t('latest')})` : ''}` : '—');
  setText('caseModeLabel', state.caseMode === 'cumulative' ? t('cumulativeCases') : t('recentIncrease'));
  setText('reportDateStartLabel', state.dates[0] || '—');
  setText('reportDateEndLabel', state.dates[state.dates.length - 1] || '—');
  $('modeCumulativeCases').classList.toggle('active', state.caseMode === 'cumulative');
  $('modeRecentIncrease').classList.toggle('active', state.caseMode === 'recent');
}

function initMap() {
  state.map = L.map('map', { zoomControl: true }).setView([0.8, 29.6], 7);
  state.baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(state.map);
  state.caseLayer = L.layerGroup().addTo(state.map);
}

function drawMap() {
  if (!state.map) return;
  syncDateControls();
  state.caseLayer.clearLayers();
  const rows = mapRowsForSelectedDate().filter(r => Number.isFinite(toNumber(r.lat)) && Number.isFinite(toNumber(r.lon)) && toNumber(r.lat) !== 0 && toNumber(r.lon) !== 0);
  const maxValue = Math.max(1, ...rows.map(r => state.caseMode === 'cumulative' ? toNumber(r.confirmed_cases) : toNumber(r.recent_cases)));
  const color = state.caseMode === 'cumulative' ? '#b83b30' : '#1f5f99';
  rows.forEach(r => {
    const value = state.caseMode === 'cumulative' ? toNumber(r.confirmed_cases) : toNumber(r.recent_cases);
    if (value <= 0) return;
    const radius = 5 + Math.sqrt(value / maxValue) * 26;
    const popup = `
      <strong>${safeText(r.health_zone)}</strong><br>
      ${t('province')}: ${safeText(r.province, t('unknown'))}<br>
      ${state.caseMode === 'cumulative' ? t('confirmedCases') : t('recentIncrease')}: <strong>${fmt(value)}</strong><br>
      ${t('confirmedDeaths')}: ${fmt(r.confirmed_deaths)}<br>
      ${t('asOf')}: ${selectedDate()}
    `;
    L.circleMarker([toNumber(r.lat), toNumber(r.lon)], {
      radius,
      color: '#ffffff',
      weight: 1.5,
      fillColor: color,
      fillOpacity: 0.72
    }).bindPopup(popup).addTo(state.caseLayer);
  });
}

function fitMapToCases() {
  const layers = [];
  state.caseLayer?.eachLayer(l => layers.push(l));
  if (!layers.length) return;
  const group = L.featureGroup(layers);
  state.map.fitBounds(group.getBounds().pad(0.2));
}

function plotConfig() {
  return { responsive: true, displaylogo: false, modeBarButtonsToRemove: ['lasso2d', 'select2d'] };
}

function commonLayout() {
  return {
    margin: { l: 48, r: 18, t: 18, b: 48 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Inter, Segoe UI, Noto Sans JP, sans-serif', color: '#162033' },
    xaxis: { gridcolor: '#e8eef6', zeroline: false },
    yaxis: { gridcolor: '#e8eef6', zeroline: false },
    legend: { orientation: 'h', y: -0.25 }
  };
}

function drawTimeline() {
  const dates = state.reports.map(r => r.reporting_date);
  const cases = state.reports.map(r => toNumber(r.drc_confirmed_cases));
  const sel = selectedDate();
  const selReport = reportsByDate().get(sel) || {};
  const traces = [
    { x: dates, y: cases, type: 'scatter', mode: 'lines+markers', name: t('cases'), line: { width: 3, color: '#175cd3' }, marker: { size: 7, color: '#175cd3' } }
  ];
  if (selReport.reporting_date) {
    traces.push({ x: [sel], y: [toNumber(selReport.drc_confirmed_cases)], type: 'scatter', mode: 'markers', name: t('selectedDate'), marker: { size: 13, symbol: 'diamond', color: '#d92d20' } });
  }
  Plotly.react('epiTimelineChart', traces, { ...commonLayout(), yaxis: { ...commonLayout().yaxis, title: t('confirmedCases') } }, plotConfig());
}

function modelForSelectedDate(key = 'ensemble') {
  const date = selectedDate();
  const entry = state.finalSize?.dates?.[date];
  return entry?.models?.[key] || null;
}


function addDaysIso(dateStr, days) {
  const d = new Date(String(dateStr) + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function daysBetweenIso(a, b) {
  const da = new Date(String(a) + 'T00:00:00Z');
  const db = new Date(String(b) + 'T00:00:00Z');
  const diff = (db - da) / 86400000;
  return Number.isFinite(diff) ? Math.round(diff) : 0;
}

function displayDateLabel(dateStr) {
  const d = new Date(String(dateStr) + 'T00:00:00Z');
  if (!Number.isFinite(d.getTime())) return dateStr || '—';
  if (state.lang === 'ja') return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' });
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

function formatDateLong(dateStr) { return displayDateLabel(dateStr); }
function formatCaseCount(v) { return fmt(v); }
function pct(v) { return Number.isFinite(Number(v)) ? `${(Number(v) * 100).toFixed(0)}%` : '—'; }

function seedFromString(str) {
  let h = 2166136261;
  for (let i = 0; i < String(str).length; i++) {
    h ^= String(str).charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function normalRand(rng) {
  const u1 = Math.max(rng(), 1e-12);
  const u2 = Math.max(rng(), 1e-12);
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function logGamma(z) {
  const p = [676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
  z -= 1;
  let x = 0.99999999999980993;
  for (let i = 0; i < p.length; i++) x += p[i] / (z + i + 1);
  const tt = z + p.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(tt) - tt + Math.log(x);
}

function gammaPdf(x, shape, scale) {
  if (x <= 0 || shape <= 0 || scale <= 0) return 0;
  return Math.exp((shape - 1) * Math.log(x) - x / scale - logGamma(shape) - shape * Math.log(scale));
}

function discretizedGammaWeights(mean = 12, sd = 5, maxLag = 40) {
  const shape = (mean / sd) ** 2;
  const scale = (sd * sd) / mean;
  const w = [0];
  let total = 0;
  for (let k = 1; k <= maxLag; k++) {
    const v = gammaPdf(k - 0.5, shape, scale);
    w[k] = v;
    total += v;
  }
  if (total <= 0) return w.map(() => 0);
  for (let k = 1; k <= maxLag; k++) w[k] /= total;
  return w;
}

function gammaRand(shape, scale, rng) {
  if (shape <= 0 || scale <= 0) return 0;
  if (shape < 1) {
    const u = Math.max(rng(), 1e-12);
    return gammaRand(shape + 1, scale, rng) * Math.pow(u, 1 / shape);
  }
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    let x, v;
    do {
      x = normalRand(rng);
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = rng();
    if (u < 1 - 0.0331 * x ** 4) return scale * d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return scale * d * v;
  }
}

function poissonRand(lambda, rng) {
  lambda = Math.max(0, lambda);
  if (lambda <= 0) return 0;
  if (lambda < 30) {
    const L = Math.exp(-lambda);
    let k = 0, p = 1;
    do { k++; p *= rng(); } while (p > L);
    return k - 1;
  }
  return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * normalRand(rng)));
}

function negativeBinomialRand(mean, dispersion, rng) {
  mean = Math.max(0, mean);
  const k = Math.max(0.05, dispersion || 0.4);
  if (mean <= 0) return 0;
  const lambda = gammaRand(k, mean / k, rng);
  return poissonRand(lambda, rng);
}

function quantile(values, q) {
  const arr = values.filter(Number.isFinite).slice().sort((a, b) => a - b);
  if (!arr.length) return NaN;
  const pos = (arr.length - 1) * q;
  const lo = Math.floor(pos), hi = Math.ceil(pos);
  if (lo === hi) return arr[lo];
  return arr[lo] + (arr[hi] - arr[lo]) * (pos - lo);
}

function dailyObservedSeriesUntil(date = selectedDate()) {
  const rows = state.reports
    .filter(r => r.reporting_date && toNumber(r.drc_confirmed_cases) > 0 && String(r.reporting_date) <= String(date))
    .slice()
    .sort((a, b) => String(a.reporting_date).localeCompare(String(b.reporting_date)));
  if (!rows.length) return [];
  const out = [];
  let prevDate = null;
  let prevCum = 0;
  for (const r of rows) {
    const d = String(r.reporting_date);
    const cum = Math.max(0, toNumber(r.drc_confirmed_cases));
    if (!prevDate) {
      out.push({ date: d, incidence: cum, cumulative: cum, report_no: r.report_no || '' });
    } else {
      const gap = Math.max(1, daysBetweenIso(prevDate, d));
      const inc = Math.max(0, cum - prevCum);
      const daily = inc / gap;
      for (let j = 1; j <= gap; j++) {
        const nd = addDaysIso(prevDate, j);
        out.push({ date: nd, incidence: daily, cumulative: prevCum + daily * j, report_no: j === gap ? (r.report_no || '') : '' });
      }
    }
    prevDate = d;
    prevCum = cum;
  }
  return out.filter(r => String(r.date) <= String(date));
}

function infectiousnessAt(incidence, tIndex, weights) {
  let lam = 0;
  const maxLag = Math.min(weights.length - 1, tIndex);
  for (let lag = 1; lag <= maxLag; lag++) lam += Math.max(0, incidence[tIndex - lag] || 0) * weights[lag];
  return lam;
}

function estimateRtFromSeries(incidence, weights, window = 10) {
  const n = incidence.length;
  const start = Math.max(1, n - window);
  let num = 0, den = 0;
  for (let i = start; i < n; i++) {
    num += Math.max(0, incidence[i] || 0);
    den += infectiousnessAt(incidence, i, weights);
  }
  const priorShape = 1;
  const priorRate = 1;
  const shape = priorShape + num;
  const rate = priorRate + den;
  const mean = rate > 0 ? shape / rate : 1;
  return { mean, shape, rate, numerator: num, denominator: den, startIndex: start };
}

function makeForecast(date = selectedDate()) {
  const horizon = Math.max(1, Number($('forecastHorizonSelect')?.value || 7));
  const siMean = Math.max(1, Number($('forecastSiSelect')?.value || 12));
  const siSd = Math.max(1, siMean * (5 / 12));
  const observed = dailyObservedSeriesUntil(date);
  if (observed.length < 4) return null;
  const weights = discretizedGammaWeights(siMean, siSd, 40);
  const obsInc = observed.map(r => Math.max(0, toNumber(r.incidence)));
  const rt = estimateRtFromSeries(obsInc, weights, 10);
  const seed = seedFromString(`${date}|${horizon}|${siMean}|${obsInc.map(x => x.toFixed(3)).join(',')}`);
  const rng = mulberry32(seed);
  const nSim = 1000;
  const dispersion = 0.4;
  const trajectories = [];
  const rtSamples = [];
  const sums = [];
  const finalCums = [];
  const observedCum = observed.length ? toNumber(observed[observed.length - 1].cumulative) : 0;
  for (let i = 0; i < nSim; i++) {
    const sampledRt = gammaRand(rt.shape, 1 / Math.max(rt.rate, 1e-9), rng);
    rtSamples.push(sampledRt);
    const inc = obsInc.slice();
    const future = [];
    for (let h = 1; h <= horizon; h++) {
      const tIdx = inc.length;
      const lam = infectiousnessAt(inc, tIdx, weights);
      const mean = Math.max(0, sampledRt * lam);
      const val = negativeBinomialRand(mean, dispersion, rng);
      inc.push(val);
      future.push(val);
    }
    trajectories.push(future);
    const totalNew = future.reduce((a, b) => a + b, 0);
    sums.push(totalNew);
    finalCums.push(observedCum + totalNew);
  }
  const futureDates = Array.from({ length: horizon }, (_, i) => addDaysIso(date, i + 1));
  const daily = futureDates.map((d, j) => {
    const vals = trajectories.map(tr => tr[j]);
    return { date: d, median: quantile(vals, 0.5), lo50: quantile(vals, 0.25), hi50: quantile(vals, 0.75), lo90: quantile(vals, 0.05), hi90: quantile(vals, 0.95) };
  });
  return {
    selectedDate: date, horizon, siMean, observed, daily, rt,
    rtMedian: quantile(rtSamples, 0.5), rtLo: quantile(rtSamples, 0.025), rtHi: quantile(rtSamples, 0.975),
    probRtAbove1: rtSamples.filter(x => x > 1).length / rtSamples.length,
    newMedian: quantile(sums, 0.5), newLo: quantile(sums, 0.05), newHi: quantile(sums, 0.95),
    finalCumMedian: quantile(finalCums, 0.5), finalCumLo: quantile(finalCums, 0.05), finalCumHi: quantile(finalCums, 0.95)
  };
}

function drawForecast() {
  const fc = makeForecast(selectedDate());
  if (!fc) {
    Plotly.react('forecastChart', [], { ...commonLayout(), annotations: [{ text: 'Not enough SitRep observations for projection', x: 0.5, y: 0.5, xref: 'paper', yref: 'paper', showarrow: false, font: { size: 13, color: '#667085' } }] }, plotConfig());
    setText('forecastStats', t('noData'));
    return;
  }
  const obs = fc.observed.slice(-21);
  const obsDates = obs.map(r => r.date);
  const obsY = obs.map(r => Number(r.incidence.toFixed(2)));
  const fDates = fc.daily.map(r => r.date);
  const maxY = Math.max(...obsY, ...fc.daily.map(r => r.hi90), 1);
  const traces = [
    { type: 'bar', name: 'Observed reported cases', x: obsDates, y: obsY, marker: { color: '#344054', opacity: 0.55 }, hovertemplate: '%{x}<br>Estimated reported cases: %{y:.1f}<extra></extra>' },
    { type: 'scatter', mode: 'lines', name: '90% PI lower', x: fDates, y: fc.daily.map(r => r.lo90), line: { width: 0 }, hoverinfo: 'skip', showlegend: false },
    { type: 'scatter', mode: 'lines', name: '90% prediction interval', x: fDates, y: fc.daily.map(r => r.hi90), line: { width: 0 }, fill: 'tonexty', fillcolor: 'rgba(46, 144, 250, 0.14)', hovertemplate: '%{x}<br>90% upper: %{y:.1f}<extra></extra>' },
    { type: 'scatter', mode: 'lines', name: '50% PI lower', x: fDates, y: fc.daily.map(r => r.lo50), line: { width: 0 }, hoverinfo: 'skip', showlegend: false },
    { type: 'scatter', mode: 'lines', name: '50% prediction interval', x: fDates, y: fc.daily.map(r => r.hi50), line: { width: 0 }, fill: 'tonexty', fillcolor: 'rgba(46, 144, 250, 0.24)', hovertemplate: '%{x}<br>50% upper: %{y:.1f}<extra></extra>' },
    { type: 'scatter', mode: 'lines+markers', name: 'Forecast median', x: fDates, y: fc.daily.map(r => r.median), line: { width: 2.5, color: '#175cd3' }, marker: { size: 6, color: '#175cd3' }, hovertemplate: '%{x}<br>Median projected cases: %{y:.1f}<extra></extra>' }
  ];
  Plotly.react('forecastChart', traces, {
    margin: { l: 62, r: 24, t: 18, b: 120 },
    xaxis: { title: { text: 'Date', standoff: 12 }, tickangle: -35, gridcolor: '#eef3f8', automargin: true },
    yaxis: { title: 'Daily reported confirmed cases', gridcolor: '#e7eef7', rangemode: 'tozero', automargin: true },
    legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.66, yanchor: 'top' },
    shapes: [{ type: 'line', xref: 'x', yref: 'y', x0: fc.selectedDate, x1: fc.selectedDate, y0: 0, y1: maxY, line: { width: 2, dash: 'dot', color: '#667085' } }],
    annotations: [{ x: fc.selectedDate, y: maxY, xref: 'x', yref: 'y', text: 'projection start', showarrow: false, yshift: 8, font: { size: 10, color: '#667085' } }],
    paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)'
  }, plotConfig());
  setText('forecastStats', `Projection from ${displayDateLabel(fc.selectedDate)} using a renewal/branching-process model; generation-interval mean ${fc.siMean} days, SD approximately ${(fc.siMean * 5 / 12).toFixed(1)} days. Estimated Rt: ${fc.rtMedian.toFixed(2)} (95% CrI ${fc.rtLo.toFixed(2)}–${fc.rtHi.toFixed(2)}); P(Rt > 1): ${pct(fc.probRtAbove1)}. Projected new cases over ${fc.horizon} days: ${fmt(fc.newMedian)} (90% PI ${fmt(fc.newLo)}–${fmt(fc.newHi)}); projected cumulative cases: ${fmt(fc.finalCumMedian)} (90% PI ${fmt(fc.finalCumLo)}–${fmt(fc.finalCumHi)}). Reporting-date data are not adjusted for onset date or reporting delay.`);
}


function finalSizeLabel(key) {
  const labels = state.finalSize?.model_labels || state.finalSize?.scenario_labels || {};
  const item = labels[key];
  if (item && item[state.lang]) return item[state.lang];
  const fallback = { ensemble: 'Ensemble', branching: 'Branching process', historical_ai: 'AI-assisted historical matching' };
  return fallback[key] || key;
}

function drawFinalSize() {
  const key = $('finalSizeScenarioSelect').value || 'ensemble';
  const record = state.finalSize?.dates?.[selectedDate()] || (() => {
    const keys = Object.keys(state.finalSize?.dates || {}).sort();
    const prior = keys.filter(d => String(d) <= String(selectedDate())).pop();
    return prior ? state.finalSize.dates[prior] : null;
  })();
  const models = record?.models || record?.scenarios || {};
  const model = models[key] || models.ensemble || models.branching || models.baseline || null;
  const summaryEl = $('finalSizeSummary');
  const statsEl = $('finalSizeStats');
  if (!record || !model || !Array.isArray(model.trajectory) || !model.trajectory.length) {
    Plotly.react('finalSizeChart', [], { ...commonLayout(), annotations: [{ text: t('noData'), x: 0.5, y: 0.5, xref: 'paper', yref: 'paper', showarrow: false, font: { size: 13, color: '#667085' } }] }, plotConfig());
    if (summaryEl) summaryEl.innerHTML = '';
    if (statsEl) statsEl.textContent = t('noData');
    return;
  }

  const fs = model.final_size || {};
  const ed = model.end_date || {};
  const rt = model.rt || {};
  const topMatches = Array.isArray(model.matches) ? model.matches.slice(0, 3).map(m => m.outbreak_label).filter(Boolean) : [];
  const matchCard = topMatches.length
    ? `<div class="final-size-stat-card"><span>${state.lang === 'ja' ? '類似した過去流行' : 'Closest historical analogs'}</span><strong>${topMatches[0]}</strong><small>${topMatches.slice(1).join(' / ')}</small></div>`
    : '';
  if (summaryEl) {
    if (state.lang === 'ja') {
      summaryEl.innerHTML = `
        <div class="final-size-stat-card"><span>推定最終累積症例数</span><strong>${formatCaseCount(fs.median)}</strong><small>90%予測区間 ${formatCaseCount(fs.pi90?.[0])}–${formatCaseCount(fs.pi90?.[1])}</small></div>
        <div class="final-size-stat-card"><span>推定終息日</span><strong>${formatDateLong(ed.median)}</strong><small>90%予測区間 ${formatDateLong(ed.pi90?.[0])}–${formatDateLong(ed.pi90?.[1])}</small></div>
        ${matchCard}`;
    } else {
      summaryEl.innerHTML = `
        <div class="final-size-stat-card"><span>Estimated final cumulative cases</span><strong>${formatCaseCount(fs.median)}</strong><small>90% PI ${formatCaseCount(fs.pi90?.[0])}–${formatCaseCount(fs.pi90?.[1])}</small></div>
        <div class="final-size-stat-card"><span>Estimated end date</span><strong>${formatDateLong(ed.median)}</strong><small>90% PI ${formatDateLong(ed.pi90?.[0])}–${formatDateLong(ed.pi90?.[1])}</small></div>
        ${matchCard}`;
    }
  }

  const projectionDate = record.reporting_date || selectedDate();
  const currentCum = toNumber(record.current_cumulative_cases || (reportsByDate().get(projectionDate) || {}).drc_confirmed_cases);
  const obs = dailyObservedSeriesUntil(projectionDate).filter(r => String(r.date) <= String(projectionDate));
  const obsDates = obs.map(r => r.date);
  const obsCum = obs.map(r => r.cumulative);
  const pred = [{ date: projectionDate, median: currentCum, q25: currentCum, q75: currentCum, q05: currentCum, q95: currentCum }].concat(model.trajectory || []);
  const x = pred.map(r => r.date);
  const traces = [
    { type: 'scatter', mode: 'lines+markers', name: state.lang === 'ja' ? '観測累積症例数' : 'Observed cumulative cases', x: obsDates, y: obsCum, line: { width: 2 }, marker: { size: 5 }, hovertemplate: '%{x}<br>%{y:,.0f}<extra></extra>' },
    { type: 'scatter', mode: 'lines', name: '90% PI lower', x, y: pred.map(r => r.q05), line: { width: 0 }, hoverinfo: 'skip', showlegend: false },
    { type: 'scatter', mode: 'lines', name: state.lang === 'ja' ? '90%予測区間' : '90% prediction interval', x, y: pred.map(r => r.q95), line: { width: 0 }, fill: 'tonexty', fillcolor: 'rgba(46, 144, 250, 0.12)', hoverinfo: 'skip' },
    { type: 'scatter', mode: 'lines', name: '50% PI lower', x, y: pred.map(r => r.q25), line: { width: 0 }, hoverinfo: 'skip', showlegend: false },
    { type: 'scatter', mode: 'lines', name: state.lang === 'ja' ? '50%予測区間' : '50% prediction interval', x, y: pred.map(r => r.q75), line: { width: 0 }, fill: 'tonexty', fillcolor: 'rgba(46, 144, 250, 0.22)', hoverinfo: 'skip' },
    { type: 'scatter', mode: 'lines', name: state.lang === 'ja' ? '中央値' : 'Median trajectory', x, y: pred.map(r => r.median), line: { width: 2.5, color: '#175cd3' }, hovertemplate: '%{x}<br>%{y:,.0f}<extra></extra>' }
  ];
  const maxY = Math.max(...obsCum, ...pred.map(r => toNumber(r.q95)), 1);
  const chartEndDate = pred.length ? pred[pred.length - 1].date : projectionDate;
  const shapes = [{ type: 'line', xref: 'x', yref: 'y', x0: projectionDate, x1: projectionDate, y0: 0, y1: maxY, line: { width: 2, dash: 'dot', color: '#667085' } }];
  const annotations = [{ x: projectionDate, y: maxY, xref: 'x', yref: 'y', text: state.lang === 'ja' ? '推定開始' : 'projection start', showarrow: false, yshift: 8, font: { size: 10, color: '#667085' } }];
  if (ed.median && String(ed.median) <= String(chartEndDate)) {
    shapes.push({ type: 'line', xref: 'x', yref: 'y', x0: ed.median, x1: ed.median, y0: 0, y1: maxY, line: { width: 2, dash: 'dash', color: '#12b76a' } });
    annotations.push({ x: ed.median, y: maxY * 0.82, xref: 'x', yref: 'y', text: state.lang === 'ja' ? '推定終息日' : 'estimated end', showarrow: false, yshift: 8, font: { size: 10, color: '#027a48' } });
  }
  Plotly.react('finalSizeChart', traces, {
    margin: { l: 68, r: 24, t: 18, b: 124 },
    xaxis: { title: { text: state.lang === 'ja' ? '日付' : 'Date', standoff: 12 }, tickangle: -35, gridcolor: '#eef3f8', automargin: true, nticks: window.innerWidth < 700 ? 5 : 7 },
    yaxis: { title: state.lang === 'ja' ? '累積確定症例数' : 'Cumulative confirmed cases', gridcolor: '#e7eef7', rangemode: 'tozero', automargin: true },
    legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.56, yanchor: 'top' },
    shapes, annotations,
    paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)'
  }, plotConfig());
  if (statsEl) {
    const sourceSitrep = record.report_no || state.finalSize?.source_sitrep || '';
    const top = Array.isArray(model.matches) ? model.matches.slice(0, 3).map(m => `${m.outbreak_label}${m.normalized_weight ? ' ' + Math.round(m.normalized_weight * 100) + '%' : ''}`).join('、') : '';
    const weights = model.weights || null;
    const rtTextJa = Number.isFinite(rt.median) ? `Rt中央値 <strong>${rt.median.toFixed(2)}</strong>（95% CrI ${Number.isFinite(rt.q025) ? rt.q025.toFixed(2) : '—'}–${Number.isFinite(rt.q975) ? rt.q975.toFixed(2) : '—'}）。` : '';
    const rtTextEn = Number.isFinite(rt.median) ? `Rt median <strong>${rt.median.toFixed(2)}</strong> (95% CrI ${Number.isFinite(rt.q025) ? rt.q025.toFixed(2) : '—'}–${Number.isFinite(rt.q975) ? rt.q975.toFixed(2) : '—'}). ` : '';
    const weightTextJa = weights ? `Ensemble重みはBranching process ${Math.round((weights.branching_process || 0) * 100)}%、AI支援過去流行マッチング ${Math.round((weights.ai_assisted_historical_matching || 0) * 100)}%です。` : '';
    const weightTextEn = weights ? `Ensemble weights: branching process ${Math.round((weights.branching_process || 0) * 100)}%, AI-assisted historical matching ${Math.round((weights.ai_assisted_historical_matching || 0) * 100)}%. ` : '';
    if (state.lang === 'ja') {
      if (key === 'historical_ai') statsEl.innerHTML = `モデル：<strong>${finalSizeLabel(key)}</strong>。${sourceSitrep ? sourceSitrep + '（' : ''}${formatDateLong(projectionDate)}${sourceSitrep ? '）' : ''}までの報告確定例の累積曲線を、過去DRCエボラ流行曲線にスケーリングして照合します。近い過去流行：<strong>${top || '—'}</strong>。これはAI支援によるアナログ推定であり、都市部侵入、医療機関内伝播、制御活動の変化により大きく外れる可能性があります。`;
      else if (key === 'ensemble') statsEl.innerHTML = `モデル：<strong>${finalSizeLabel(key)}</strong>。${sourceSitrep ? sourceSitrep + '（' : ''}${formatDateLong(projectionDate)}${sourceSitrep ? '）' : ''}までの報告確定例を用い、Branching processとAI支援による過去流行マッチングを統合した推奨表示です。${weightTextJa}${rtTextJa}推定終息日は、モデル上で日別新規確定例が42日間連続して0となる最初の日です。これは確定的な予測ではありません。`;
      else statsEl.innerHTML = `モデル：<strong>${finalSizeLabel(key)}</strong>。${sourceSitrep ? sourceSitrep + '（' : ''}${formatDateLong(projectionDate)}${sourceSitrep ? '）' : ''}までの報告確定例を用い、GitHub Actions側で事前計算したrenewal / branching-process negative-binomialモデルです。${rtTextJa}推定終息日は、シミュレーション上で日別新規確定例が42日間連続して0となる最初の日です。これは確定的な予測ではありません。`;
    } else {
      if (key === 'historical_ai') statsEl.innerHTML = `Model: <strong>${finalSizeLabel(key)}</strong>. The cumulative trajectory through ${formatDateLong(projectionDate)}${sourceSitrep ? ' (' + sourceSitrep + ')' : ''} is scaled and matched to previous DRC Ebola outbreak curves. Closest analogs: <strong>${top || '—'}</strong>. This is an AI-assisted analog forecast; urban spread, nosocomial transmission and response changes may substantially alter the projection.`;
      else if (key === 'ensemble') statsEl.innerHTML = `Model: <strong>${finalSizeLabel(key)}</strong>. Recommended display combining branching process and AI-assisted historical matching using reported confirmed cases through ${formatDateLong(projectionDate)}${sourceSitrep ? ' (' + sourceSitrep + ')' : ''}. ${weightTextEn}${rtTextEn}The estimated end date is the first date followed by 42 consecutive days with zero incident confirmed cases in the model. This is not a deterministic prediction.`;
      else statsEl.innerHTML = `Model: <strong>${finalSizeLabel(key)}</strong>. Precomputed in GitHub Actions using a renewal / branching-process negative-binomial model with reported confirmed cases through ${formatDateLong(projectionDate)}${sourceSitrep ? ' (' + sourceSitrep + ')' : ''}. ${rtTextEn}The estimated end date is the first date followed by 42 consecutive days with zero incident confirmed cases in the simulations. This is not a deterministic prediction.`;
    }
  }
}

function updateAll() {
  syncDateControls();
  updateStatusAndKpis();
  drawMap();
  drawTimeline();
  drawForecast();
  drawFinalSize();
}

async function init() {
  initControls();
  try {
    const [cases, reports, finalSize, ugandaEvd] = await Promise.all([
      parseCsv(DATA_PATHS.cases),
      parseCsv(DATA_PATHS.reports),
      loadJson(DATA_PATHS.finalSize),
      parseCsv(DATA_PATHS.ugandaEvd).catch(() => [])
    ]);
    state.cases = cases.filter(r => r.date && r.health_zone);
    state.reports = sortReports(reports);
    state.finalSize = finalSize;
    state.ugandaEvd = ugandaEvd || [];
    state.dates = Array.from(new Set(state.reports.map(r => r.reporting_date))).filter(Boolean).sort();
    initDateControls();
    initMap();
    applyLanguage();
    setTimeout(fitMapToCases, 250);
  } catch (err) {
    console.error(err);
    setText('dataStatus', 'Error');
    setText('lastUpdated', String(err.message || err));
  }
}

document.addEventListener('DOMContentLoaded', init);
