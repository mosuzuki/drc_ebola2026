const DATA_PATHS = {
  cases: 'data/cases_by_hz.csv',
  reports: 'data/report_summary.csv',
  finalSize: 'data/final_size_projection.json'
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

function updateStatusAndKpis() {
  const r = latestReport();
  if (!r.reporting_date) return;
  const cfr = toNumber(r.drc_confirmed_cases) ? (100 * toNumber(r.drc_confirmed_deaths) / toNumber(r.drc_confirmed_cases)) : 0;
  setText('dataStatus', `${r.report_no || t('latest')} | ${t('asOf')}: ${r.reporting_date}`);
  setText('lastUpdated', `${t('autoUpdate')} ${r.publication_date ? `Publication: ${r.publication_date}.` : ''}`);
  setText('kpiTotal', fmt(r.drc_confirmed_cases));
  setText('kpiDrcDeaths', fmt(r.drc_confirmed_deaths));
  setText('kpiUgandaCases', fmt(r.uganda_confirmed_cases));
  setText('kpiUgandaDeaths', fmt(r.uganda_confirmed_deaths));
  setText('kpiTotalNote', `${safeText(r.report_no)} | ${t('asOf')}: ${safeText(r.reporting_date)}`);
  setText('kpiDrcDeathsNote', `${t('cfr')}: ${cfr.toFixed(1)}%`);
  setText('kpiUgandaCasesNote', `${t('source')}: ${safeText(r.source)}`);
  setText('kpiUgandaDeathsNote', `${t('asOf')}: ${safeText(r.reporting_date)}`);
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
  const deaths = state.reports.map(r => toNumber(r.drc_confirmed_deaths));
  const sel = selectedDate();
  const selReport = reportsByDate().get(sel) || {};
  const traces = [
    { x: dates, y: cases, type: 'scatter', mode: 'lines+markers', name: t('cases'), line: { width: 3 } },
    { x: dates, y: deaths, type: 'scatter', mode: 'lines+markers', name: t('deaths'), line: { width: 2, dash: 'dot' } }
  ];
  if (selReport.reporting_date) {
    traces.push({ x: [sel], y: [toNumber(selReport.drc_confirmed_cases)], type: 'scatter', mode: 'markers', name: t('selectedDate'), marker: { size: 13, symbol: 'diamond' } });
  }
  Plotly.react('epiTimelineChart', traces, { ...commonLayout(), yaxis: { ...commonLayout().yaxis, title: t('confirmedCases') } }, plotConfig());
}

function modelForSelectedDate(key = 'ensemble') {
  const date = selectedDate();
  const entry = state.finalSize?.dates?.[date];
  return entry?.models?.[key] || null;
}

function drawForecast() {
  const horizon = Number($('forecastHorizonSelect').value || 7);
  const report = reportsByDate().get(selectedDate()) || {};
  const model = modelForSelectedDate('ensemble') || modelForSelectedDate('branching') || modelForSelectedDate('historical_ai');
  if (!model || !model.trajectory || !report.reporting_date) {
    Plotly.react('forecastChart', [], commonLayout(), plotConfig());
    setText('forecastStats', t('noData'));
    return;
  }
  const trajectory = model.trajectory.slice(0, horizon);
  const x = [selectedDate(), ...trajectory.map(p => p.date)];
  const yMedian = [toNumber(report.drc_confirmed_cases), ...trajectory.map(p => toNumber(p.median))];
  const yHi = [toNumber(report.drc_confirmed_cases), ...trajectory.map(p => toNumber(p.q95 ?? p.q75))];
  const yLo = [toNumber(report.drc_confirmed_cases), ...trajectory.map(p => toNumber(p.q05 ?? p.q25))];
  const traces = [
    { x, y: yHi, type: 'scatter', mode: 'lines', line: { width: 0 }, showlegend: false, hoverinfo: 'skip' },
    { x, y: yLo, type: 'scatter', mode: 'lines', fill: 'tonexty', name: t('uncertainty'), line: { width: 0 }, hoverinfo: 'skip' },
    { x, y: yMedian, type: 'scatter', mode: 'lines+markers', name: t('projected'), line: { width: 3 } },
    { x: [selectedDate()], y: [toNumber(report.drc_confirmed_cases)], type: 'scatter', mode: 'markers', name: t('currentCases'), marker: { size: 12, symbol: 'diamond' } }
  ];
  Plotly.react('forecastChart', traces, { ...commonLayout(), yaxis: { ...commonLayout().yaxis, title: t('confirmedCases') } }, plotConfig());
  const last = trajectory[trajectory.length - 1] || {};
  setText('forecastStats', `${horizon} days: ${t('median')} ${fmt(last.median)} (${t('interval90')}: ${fmt(last.q05)}–${fmt(last.q95)}).`);
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
  const model = modelForSelectedDate(key);
  if (!model) {
    Plotly.react('finalSizeChart', [], commonLayout(), plotConfig());
    setText('finalSizeStats', t('noData'));
    $('finalSizeSummary').innerHTML = '';
    return;
  }
  const fs = model.final_size || {};
  const end = model.end_date || {};
  $('finalSizeSummary').innerHTML = `
    <div><span>${t('model')}</span><strong>${finalSizeLabel(key)}</strong></div>
    <div><span>${t('median')}</span><strong>${fmt(fs.median)}</strong></div>
    <div><span>${t('endDate')}</span><strong>${safeText(end.median)}</strong></div>
  `;
  const trajectory = model.trajectory || [];
  const x = [selectedDate(), ...trajectory.map(p => p.date)];
  const current = (reportsByDate().get(selectedDate()) || {}).drc_confirmed_cases;
  const yMedian = [toNumber(current), ...trajectory.map(p => toNumber(p.median))];
  const yHi = [toNumber(current), ...trajectory.map(p => toNumber(p.q95 ?? p.q75))];
  const yLo = [toNumber(current), ...trajectory.map(p => toNumber(p.q05 ?? p.q25))];
  const traces = [
    { x, y: yHi, type: 'scatter', mode: 'lines', line: { width: 0 }, showlegend: false, hoverinfo: 'skip' },
    { x, y: yLo, type: 'scatter', mode: 'lines', fill: 'tonexty', name: t('uncertainty'), line: { width: 0 }, hoverinfo: 'skip' },
    { x, y: yMedian, type: 'scatter', mode: 'lines', name: t('median'), line: { width: 3 } }
  ];
  Plotly.react('finalSizeChart', traces, { ...commonLayout(), yaxis: { ...commonLayout().yaxis, title: t('confirmedCases') } }, plotConfig());
  const pi90 = fs.pi90 || [];
  setText('finalSizeStats', `${t('interval90')}: ${fmt(pi90[0])}–${fmt(pi90[1])}. ${state.finalSize?.caveat || ''}`);
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
    const [cases, reports, finalSize] = await Promise.all([
      parseCsv(DATA_PATHS.cases),
      parseCsv(DATA_PATHS.reports),
      loadJson(DATA_PATHS.finalSize)
    ]);
    state.cases = cases.filter(r => r.date && r.health_zone);
    state.reports = sortReports(reports);
    state.finalSize = finalSize;
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
