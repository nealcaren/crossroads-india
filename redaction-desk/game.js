// ============================================================
//  THE CENSOR'S REDACTION DESK — Game Engine
// ============================================================

// ── State ───────────────────────────────────────────────────
let state = {
    truth: 100,
    risk: 0,
    currentDispatchIndex: 0,
    redactedPhrases: {},   // { dispatchId: Set of phrase keys }
    dispatchHistory: [],   // per-dispatch results
    gameStatus: 'intro',   // intro | playing | outcome | ended
    introPage: 0
};

// ── DOM refs ────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const screens = {
    intro:   $('#screen-intro'),
    game:    $('#screen-game'),
    outcome: $('#screen-outcome'),
    end:     $('#screen-end')
};

// ── Initialization ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);

function init() {
    showScreen('intro');
    renderIntroPage();
    bindIntroNav();
    bindPrintButton();
    bindOutcomeNext();
    bindRestart();
}

// ── Screen Management ───────────────────────────────────────
function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    screens[name].scrollTo?.({ top: 0 });
    window.scrollTo({ top: 0, behavior: 'instant' });
}

// ── INTRO ───────────────────────────────────────────────────
function renderIntroPage() {
    const page = INTRO_PAGES[state.introPage];
    const heading = $('#intro-heading');
    const body = $('#intro-body');
    const flavor = $('#intro-flavor');
    const content = $('#intro-content');

    content.classList.remove('fade-in');
    void content.offsetWidth; // force reflow
    content.classList.add('fade-in');

    heading.textContent = page.subtitle || '';
    body.innerHTML = page.body;
    flavor.textContent = page.flavor || '';

    // Dots
    const dots = $('#intro-dots');
    dots.innerHTML = '';
    INTRO_PAGES.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'page-dot' + (i === state.introPage ? ' active' : '');
        dots.appendChild(dot);
    });

    // Button states
    $('#btn-intro-back').disabled = state.introPage === 0;
    const isLast = state.introPage === INTRO_PAGES.length - 1;
    $('#btn-intro-next').textContent = isLast ? 'Begin' : 'Continue';
}

function bindIntroNav() {
    $('#btn-intro-back').addEventListener('click', () => {
        if (state.introPage > 0) {
            state.introPage--;
            renderIntroPage();
        }
    });

    $('#btn-intro-next').addEventListener('click', () => {
        if (state.introPage < INTRO_PAGES.length - 1) {
            state.introPage++;
            renderIntroPage();
        } else {
            startGame();
        }
    });
}

// ── GAME START ──────────────────────────────────────────────
function startGame() {
    state.gameStatus = 'playing';
    state.truth = 100;
    state.risk = 0;
    state.currentDispatchIndex = 0;
    state.redactedPhrases = {};
    state.dispatchHistory = [];
    showScreen('game');
    renderDispatch();
}

// ── DISPATCH RENDERING ──────────────────────────────────────
function renderDispatch() {
    const dispatch = DISPATCHES[state.currentDispatchIndex];
    const id = dispatch.id;

    // Init redaction set for this dispatch
    if (!state.redactedPhrases[id]) {
        state.redactedPhrases[id] = new Set();
    }

    // Header info
    $('#dispatch-date').textContent = dispatch.date;
    $('#dispatch-headline').textContent = dispatch.headline;
    $('#dispatch-source').textContent = dispatch.source;
    $('#dispatch-counter').textContent =
        `Dispatch ${state.currentDispatchIndex + 1} of ${DISPATCHES.length}`;

    // Parse body — replace {phrase} with clickable spans
    const bodyEl = $('#dispatch-body');
    bodyEl.innerHTML = parseDispatchBody(dispatch.body, dispatch, id);

    // Attach glossary terms
    attachGlossaryTerms(bodyEl);

    // Censor warning
    $('#censor-warning').textContent = dispatch.censorWarning;

    // Update meters display
    updateMetersDisplay();

    // Hint visibility
    $('#redaction-hint').style.display = '';

    // Animate paper in
    const paper = $('#dispatch-paper');
    paper.classList.remove('slide-up');
    void paper.offsetWidth;
    paper.classList.add('slide-up');
}

function parseDispatchBody(body, dispatch, dispatchId) {
    // Replace {phrase} with <span class="redactable" data-phrase="phrase">phrase</span>
    return body.replace(/\{([^}]+)\}/g, (match, phrase) => {
        const isRedacted = state.redactedPhrases[dispatchId]?.has(phrase);
        const cls = 'redactable' + (isRedacted ? ' redacted' : '');
        const escaped = escapeHtml(phrase);
        return `<span class="${cls}" data-phrase="${escaped}" role="button" tabindex="0" aria-pressed="${isRedacted}" aria-label="${isRedacted ? 'Redacted: ' : ''}${escaped}">${escaped}</span>`;
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ── REDACTION INTERACTION ───────────────────────────────────
document.addEventListener('click', (e) => {
    const span = e.target.closest('.redactable');
    if (!span || state.gameStatus !== 'playing') return;
    toggleRedaction(span);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const span = e.target.closest('.redactable');
        if (!span || state.gameStatus !== 'playing') return;
        e.preventDefault();
        toggleRedaction(span);
    }
});

function toggleRedaction(span) {
    const dispatch = DISPATCHES[state.currentDispatchIndex];
    const phrase = span.dataset.phrase;
    const set = state.redactedPhrases[dispatch.id];

    if (set.has(phrase)) {
        set.delete(phrase);
        span.classList.remove('redacted');
        span.setAttribute('aria-pressed', 'false');
        span.setAttribute('aria-label', phrase);
    } else {
        set.add(phrase);
        span.classList.add('redacted');
        span.setAttribute('aria-pressed', 'true');
        span.setAttribute('aria-label', 'Redacted: ' + phrase);
    }

    updateMetersPreview();
}

// ── METER CALCULATIONS ──────────────────────────────────────
function calculateCurrentMeters() {
    // Start from base values
    let truth = 100;
    let risk = 0;

    // Apply all committed dispatch history
    for (const record of state.dispatchHistory) {
        truth -= record.truthLost;
        risk += record.riskGained;
    }

    return { truth: clamp(truth, 0, 100), risk: clamp(risk, 0, 100) };
}

function calculatePreviewMeters() {
    const base = calculateCurrentMeters();
    const dispatch = DISPATCHES[state.currentDispatchIndex];
    const redacted = state.redactedPhrases[dispatch.id] || new Set();

    let truthPenalty = 0;
    let riskGain = 0;

    for (const [phrase, values] of Object.entries(dispatch.phrases)) {
        if (redacted.has(phrase)) {
            // Redacting: lose truth
            truthPenalty += values.truth;
        } else {
            // Not redacting: gain risk
            riskGain += values.risk;
        }
    }

    return {
        truth: clamp(base.truth - truthPenalty, 0, 100),
        risk: clamp(base.risk + riskGain, 0, 100),
        truthPenalty,
        riskGain
    };
}

function updateMetersPreview() {
    const preview = calculatePreviewMeters();
    animateMeters(preview.truth, preview.risk);
}

function updateMetersDisplay() {
    const base = calculateCurrentMeters();
    // Show preview including current dispatch defaults (nothing redacted yet shows full risk)
    updateMetersPreview();
}

function animateMeters(truth, risk) {
    $('#fill-truth').style.width = truth + '%';
    $('#fill-risk').style.width = risk + '%';
    $('#val-truth').textContent = truth;
    $('#val-risk').textContent = risk;

    // Color coding
    const truthFill = $('#fill-truth');
    const riskFill = $('#fill-risk');

    if (truth <= 30) {
        truthFill.style.background = '#a33';
    } else if (truth <= 50) {
        truthFill.style.background = '#b8860b';
    } else {
        truthFill.style.background = '';
    }

    if (risk >= 60) {
        riskFill.style.background = '#c00';
    } else if (risk >= 40) {
        riskFill.style.background = '#b8860b';
    } else {
        riskFill.style.background = '';
    }
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

// ── PRINT EDITION ───────────────────────────────────────────
function bindPrintButton() {
    $('#btn-print').addEventListener('click', commitDispatch);
}

function commitDispatch() {
    const dispatch = DISPATCHES[state.currentDispatchIndex];
    const redacted = state.redactedPhrases[dispatch.id] || new Set();

    // Calculate what this dispatch costs
    let truthLost = 0;
    let riskGained = 0;

    for (const [phrase, values] of Object.entries(dispatch.phrases)) {
        if (redacted.has(phrase)) {
            truthLost += values.truth;
        } else {
            riskGained += values.risk;
        }
    }

    // Record this dispatch
    const record = {
        dispatchId: dispatch.id,
        date: dispatch.date,
        headline: dispatch.headline,
        truthLost,
        riskGained,
        phrasesRedacted: redacted.size,
        totalPhrases: Object.keys(dispatch.phrases).length
    };
    state.dispatchHistory.push(record);

    // Update cumulative state
    state.truth = clamp(state.truth - truthLost, 0, 100);
    state.risk = clamp(state.risk + riskGained, 0, 100);

    // Determine redaction level for reactions
    const totalPhrases = Object.keys(dispatch.phrases).length;
    const redactedCount = redacted.size;
    const redactRatio = redactedCount / totalPhrases;

    let level;
    if (redactRatio >= 0.6) level = 'heavy';
    else if (redactRatio >= 0.25) level = 'moderate';
    else level = 'light';

    record.level = level;

    // Show outcome
    showOutcome(dispatch, record, level);
}

// ── OUTCOME SCREEN ──────────────────────────────────────────
function showOutcome(dispatch, record, level) {
    state.gameStatus = 'outcome';
    showScreen('outcome');

    // Stamp
    const stamp = $('#outcome-stamp');
    stamp.className = 'stamp'; // reset
    void stamp.offsetWidth;

    if (level === 'heavy') {
        stamp.textContent = 'APPROVED';
        stamp.classList.add('approved');
    } else if (level === 'moderate') {
        stamp.textContent = 'CAUTION';
        stamp.classList.add('caution');
    } else {
        stamp.textContent = 'WARNING';
        stamp.classList.add('warning');
    }

    // Headline
    $('#outcome-headline').textContent = dispatch.headline;

    // Reactions
    $('#reaction-censor-text').textContent = dispatch.censorReaction[level];
    $('#reaction-public-text').textContent = dispatch.publicReaction[level];

    // Meters
    const current = calculateCurrentMeters();
    const truthEl = $('#outcome-truth');
    const riskEl = $('#outcome-risk');
    truthEl.textContent = current.truth;
    truthEl.className = 'outcome-meter-value truth';
    riskEl.textContent = current.risk;
    riskEl.className = 'outcome-meter-value risk';

    // Historical note
    $('#outcome-history-text').textContent = dispatch.historicalNote;

    // Check loss conditions
    const lost = checkLossCondition(current);

    // Next button
    const btn = $('#btn-next');
    if (lost) {
        btn.textContent = 'SEE YOUR FATE';
    } else if (state.currentDispatchIndex >= DISPATCHES.length - 1) {
        btn.textContent = 'SEE YOUR LEGACY';
    } else {
        btn.textContent = 'NEXT DISPATCH';
    }
}

function checkLossCondition(meters) {
    if (meters.truth <= 20) return 'truthCollapse';
    if (meters.risk >= 80) return 'riskCollapse';
    return null;
}

function bindOutcomeNext() {
    $('#btn-next').addEventListener('click', () => {
        const current = calculateCurrentMeters();
        const lost = checkLossCondition(current);

        if (lost) {
            endGame(lost);
        } else if (state.currentDispatchIndex >= DISPATCHES.length - 1) {
            endGame(determineWinEnding(current));
        } else {
            state.currentDispatchIndex++;
            state.gameStatus = 'playing';
            showScreen('game');
            renderDispatch();
        }
    });
}

// ── END GAME ────────────────────────────────────────────────
function determineWinEnding(meters) {
    if (meters.truth >= 70 && meters.risk <= 40) return 'fearlessEditor';
    if (meters.truth <= 40 && meters.risk <= 30) return 'survivingVoice';
    return 'tightrope';
}

function endGame(endingKey) {
    state.gameStatus = 'ended';
    const ending = ENDINGS[endingKey];
    const meters = calculateCurrentMeters();

    showScreen('end');

    // Stamp
    const stamp = $('#end-stamp');
    stamp.className = 'end-stamp';
    void stamp.offsetWidth;

    const isVictory = !['truthCollapse', 'riskCollapse'].includes(endingKey);
    if (isVictory) {
        stamp.textContent = ending.icon === 'fearless' ? 'FEARLESS' : 'SURVIVED';
        stamp.classList.add('victory');
    } else {
        stamp.textContent = endingKey === 'riskCollapse' ? 'CONFISCATED' : 'ABANDONED';
        stamp.classList.add('defeat');
    }

    // Title and description
    $('#end-title').textContent = ending.title;
    $('#end-description').textContent = ending.description;

    // Stats
    $('#end-truth').textContent = meters.truth;
    $('#end-risk').textContent = meters.risk;
    $('#end-dispatches').textContent =
        `${state.dispatchHistory.length} / ${DISPATCHES.length}`;

    // Per-dispatch summary
    const summaryEl = $('#end-summary');
    summaryEl.innerHTML = '';
    for (const record of state.dispatchHistory) {
        const row = document.createElement('div');
        row.className = 'summary-dispatch';

        const date = document.createElement('span');
        date.className = 'summary-date';
        date.textContent = record.date.split(' ').slice(0, 2).join(' ');

        const headline = document.createElement('span');
        headline.className = 'summary-headline';
        // Truncate long headlines
        const shortHeadline = record.headline.length > 40
            ? record.headline.substring(0, 37) + '...'
            : record.headline;
        headline.textContent = shortHeadline;

        const redactions = document.createElement('span');
        redactions.className = 'summary-redactions ' + record.level;
        redactions.textContent = `${record.phrasesRedacted}/${record.totalPhrases} redacted`;

        row.appendChild(date);
        row.appendChild(headline);
        row.appendChild(redactions);
        summaryEl.appendChild(row);
    }

    // Epilogue
    $('#end-epilogue').textContent = ending.epilogue;

    // Historical reflection
    $('#end-reflection-text').textContent = ending.historicalReflection;
}

function bindRestart() {
    $('#btn-restart').addEventListener('click', () => {
        state = {
            truth: 100,
            risk: 0,
            currentDispatchIndex: 0,
            redactedPhrases: {},
            dispatchHistory: [],
            gameStatus: 'intro',
            introPage: 0
        };
        showScreen('intro');
        renderIntroPage();
    });
}

// ── GLOSSARY TOOLTIPS ───────────────────────────────────────
function attachGlossaryTerms(container) {
    const text = container.innerHTML;
    let updated = text;

    for (const term of Object.keys(GLOSSARY)) {
        // Only wrap the term if it's not already inside a tag attribute or glossary span
        const regex = new RegExp(
            `(?<![">])\\b(${escapeRegex(term)})\\b(?![^<]*>)`,
            'gi'
        );
        // Only replace first occurrence
        let replaced = false;
        updated = updated.replace(regex, (match) => {
            if (replaced) return match;
            replaced = true;
            return `<span class="glossary-term" data-term="${escapeHtml(term)}">${match}</span>`;
        });
    }

    container.innerHTML = updated;

    // Rebind redactable click handlers (innerHTML replacement destroys them)
    // The click handler is on document so this is fine — just need to restore redacted state
    const dispatch = DISPATCHES[state.currentDispatchIndex];
    const redacted = state.redactedPhrases[dispatch.id] || new Set();
    container.querySelectorAll('.redactable').forEach(span => {
        const phrase = span.dataset.phrase;
        if (redacted.has(phrase)) {
            span.classList.add('redacted');
            span.setAttribute('aria-pressed', 'true');
        }
    });
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Glossary tooltip behavior
const tooltip = $('#glossary-tooltip');

document.addEventListener('mouseover', (e) => {
    const term = e.target.closest('.glossary-term');
    if (!term) return;

    const termKey = term.dataset.term;
    const definition = GLOSSARY[termKey];
    if (!definition) return;

    tooltip.textContent = definition;
    tooltip.classList.add('visible');
    tooltip.setAttribute('aria-hidden', 'false');

    positionTooltip(e, term);
});

document.addEventListener('mousemove', (e) => {
    if (tooltip.classList.contains('visible')) {
        positionTooltip(e);
    }
});

document.addEventListener('mouseout', (e) => {
    const term = e.target.closest('.glossary-term');
    if (term) {
        tooltip.classList.remove('visible');
        tooltip.setAttribute('aria-hidden', 'true');
    }
});

function positionTooltip(e, term) {
    const pad = 12;
    let x = e.clientX + pad;
    let y = e.clientY + pad;

    // Keep on screen
    const rect = tooltip.getBoundingClientRect();
    if (x + rect.width > window.innerWidth - pad) {
        x = e.clientX - rect.width - pad;
    }
    if (y + rect.height > window.innerHeight - pad) {
        y = e.clientY - rect.height - pad;
    }

    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}
