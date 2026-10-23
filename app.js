/**
 * QuizPulse — Main Application Logic
 * Clean, single-source-of-truth quiz engine.
 * ES6 modules, no external dependencies.
 */

import { QUESTION_BANK } from './questions.js';
import { sound } from './sound.js';
import { ConfettiCannon } from './confetti.js';

class QuizApp {
  constructor() {
    // ── Quiz state ────────────────────────────────────────────────────────────
    this.questions       = [];
    this.userAnswers     = {}; // { questionIndex: chosenOptionIndex }
    this.currentIndex    = 0;
    this.timerMode       = 'per-question';
    this.timerInterval   = null;
    this.timeRemaining   = 20;
    this.questionTimeLimit = 20;
    this.totalTimeLimit  = 180;
    this.startTime       = null;
    this.endTime         = null;
    this.passingThreshold = 70;

    this.confetti = new ConfettiCannon(document.getElementById('confetti-canvas'));

    this._cacheDOM();
    this._bindEvents();
    this._initSoundToggle();
    this._loadHighScore();
  }

  // ════════════════════════════════════════════════════════════════════════════
  // DOM CACHE — every getElementById in one place, null-safe
  // ════════════════════════════════════════════════════════════════════════════
  _cacheDOM() {
    const g = (id) => document.getElementById(id);

    // Views
    this.welcomeView  = g('welcome-view');
    this.quizView     = g('quiz-view');
    this.resultsView  = g('results-view');

    // Setup controls
    this.categorySelect        = g('category-select');
    this.difficultySelect      = g('difficulty-select');
    this.countSelect           = g('count-select');
    this.timerSelect           = g('timer-select');
    this.randomizeQuestionsCheck = g('randomize-questions');
    this.randomizeOptionsCheck   = g('randomize-options');
    this.startQuizBtn          = g('start-quiz-btn');

    // High-score area
    this.headerBestScoreText = g('header-best-score-text');
    this.recordStatsDetails  = g('record-stats-details');
    this.resetRecordBtn      = g('reset-record-btn');

    // Active-quiz elements
    this.metaCategory     = g('meta-category');
    this.metaDifficulty   = g('meta-difficulty');
    this.timerContainer   = g('timer-container');
    this.timerDisplay     = g('timer-display');
    this.timerBar         = g('timer-bar');
    this.currentQIndex    = g('current-q-index');
    this.totalQCount      = g('total-q-count');
    this.answeredCountText = g('answered-count-text');
    this.progressBarFill  = g('progress-bar-fill');
    this.questionTitle    = g('question-title');
    this.optionsContainer = g('options-container');
    this.paletteDots      = g('palette-dots');
    this.prevBtn          = g('prev-btn');
    this.nextBtn          = g('next-btn');
    this.submitQuizBtn    = g('submit-quiz-btn');   // nav-bar button (last question)
    this.headerSubmitBtn  = g('header-submit-btn'); // header chip (any question)

    // Results screen
    this.resultStatusBadge  = g('result-status-badge');
    this.resultHeadline     = g('result-headline');
    this.resultSubtext      = g('result-subtext');
    this.scoreCircleFg      = g('score-circle-fg');
    this.resultPercentage   = g('result-percentage');
    this.resultFraction     = g('result-fraction');
    this.newRecordBanner    = g('new-record-banner');
    this.statCorrectCount   = g('stat-correct-count');
    this.statIncorrectCount = g('stat-incorrect-count');
    this.statTimeSpent      = g('stat-time-spent');
    this.playAgainBtn       = g('play-again-btn');
    this.homeViewBtn        = g('home-view-btn');
    this.bottomPlayAgainBtn = g('bottom-play-again-btn');
    this.bottomHomeBtn      = g('bottom-home-btn');

    // Inline answer-review (inside results view)
    this.resultsReviewList        = g('results-review-list');
    this.resultsFilterAllCount    = g('results-filter-all-count');
    this.resultsFilterCorrectCount   = g('results-filter-correct-count');
    this.resultsFilterIncorrectCount = g('results-filter-incorrect-count');

    // Sound toggle
    this.soundToggleBtn = g('sound-toggle-btn');
    this.soundIconOn    = g('sound-icon-on');
    this.soundIconOff   = g('sound-icon-off');
  }

  // ════════════════════════════════════════════════════════════════════════════
  // EVENT BINDING
  // ════════════════════════════════════════════════════════════════════════════
  _bindEvents() {
    // Welcome screen
    this.startQuizBtn.addEventListener('click', () => this.startQuiz());

    // Quiz navigation
    this.prevBtn.addEventListener('click', () => this.navigatePrev());
    this.nextBtn.addEventListener('click', () => this.navigateNext());

    // ── Submit buttons ────────────────────────────────────────────────────────
    // Both call the same proceedSubmission() directly — no modal, no confirm().
    if (this.submitQuizBtn) {
      this.submitQuizBtn.addEventListener('click', () => this.finishQuiz());
    }
    if (this.headerSubmitBtn) {
      this.headerSubmitBtn.addEventListener('click', () => this.finishQuiz());
    }

    // Results-screen actions
    if (this.playAgainBtn)       this.playAgainBtn.addEventListener('click', () => this.startQuiz());
    if (this.homeViewBtn)        this.homeViewBtn.addEventListener('click', () => this._switchView('welcome'));
    if (this.bottomPlayAgainBtn) this.bottomPlayAgainBtn.addEventListener('click', () => this.startQuiz());
    if (this.bottomHomeBtn)      this.bottomHomeBtn.addEventListener('click', () => this._switchView('welcome'));

    // High-score reset
    if (this.resetRecordBtn) {
      this.resetRecordBtn.addEventListener('click', () => this._resetHighScore());
    }

    // Sound toggle
    if (this.soundToggleBtn) {
      this.soundToggleBtn.addEventListener('click', () => {
        const muted = sound.toggleMute();
        this._updateSoundIcons(muted);
        if (!muted) sound.playSelect();
      });
    }

    // Answer-review filter pills (inside results view)
    document.querySelectorAll('#results-review-section .filter-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('#results-review-section .filter-pill')
          .forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this._renderReviewList(e.currentTarget.dataset.filter);
      });
    });

    // Keyboard shortcuts (quiz only)
    window.addEventListener('keydown', (e) => this._handleKeyboard(e));
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SOUND
  // ════════════════════════════════════════════════════════════════════════════
  _initSoundToggle() {
    this._updateSoundIcons(sound.isMuted());
  }

  _updateSoundIcons(isMuted) {
    if (!this.soundIconOn || !this.soundIconOff) return;
    this.soundIconOn.classList.toggle('hidden', isMuted);
    this.soundIconOff.classList.toggle('hidden', !isMuted);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // KEYBOARD SHORTCUTS
  // ════════════════════════════════════════════════════════════════════════════
  _handleKeyboard(e) {
    if (!this.quizView || !this.quizView.classList.contains('active')) return;

    if (e.key === 'ArrowLeft' && this.currentIndex > 0) {
      this.navigatePrev();
    } else if (e.key === 'ArrowRight' && this.currentIndex < this.questions.length - 1) {
      this.navigateNext();
    } else if (['1','2','3','4'].includes(e.key)) {
      this.selectOption(parseInt(e.key, 10) - 1);
    } else if (['a','b','c','d'].includes(e.key.toLowerCase())) {
      this.selectOption({ a:0, b:1, c:2, d:3 }[e.key.toLowerCase()]);
    } else if (e.key === 'Enter') {
      if (this.currentIndex === this.questions.length - 1) {
        this.finishQuiz();
      } else {
        this.navigateNext();
      }
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // VIEW SWITCHING
  // ════════════════════════════════════════════════════════════════════════════
  _switchView(name) {
    [this.welcomeView, this.quizView, this.resultsView].forEach(v => {
      if (v) v.classList.remove('active');
    });

    const map = {
      welcome: this.welcomeView,
      quiz:    this.quizView,
      results: this.resultsView,
    };

    if (map[name]) {
      map[name].classList.add('active');
    }

    if (name === 'welcome') this._loadHighScore();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // HIGH SCORE (localStorage)
  // ════════════════════════════════════════════════════════════════════════════
  _loadHighScore() {
    const raw = localStorage.getItem('quiz_high_score');
    if (!raw) {
      if (this.headerBestScoreText) this.headerBestScoreText.textContent = 'Best: --%';
      if (this.recordStatsDetails)  this.recordStatsDetails.textContent  = 'No quiz attempts yet. Start your first session!';
      if (this.resetRecordBtn)      this.resetRecordBtn.classList.add('hidden');
      return;
    }
    try {
      const s = JSON.parse(raw);
      if (this.headerBestScoreText) this.headerBestScoreText.textContent = `Best: ${s.percentage}%`;
      if (this.recordStatsDetails)  this.recordStatsDetails.textContent  =
        `${s.percentage}% (${s.score}/${s.total}) in ${s.category} • ${s.date}`;
      if (this.resetRecordBtn)      this.resetRecordBtn.classList.remove('hidden');
    } catch {
      localStorage.removeItem('quiz_high_score');
    }
  }

  _resetHighScore() {
    if (!confirm('Reset your personal best score?')) return;
    localStorage.removeItem('quiz_high_score');
    this._loadHighScore();
    sound.playSelect();
  }

  _saveHighScore(percentage, score, total) {
    const category = this.categorySelect
      ? this.categorySelect.options[this.categorySelect.selectedIndex].text.replace(/^[^\w]+/, '')
      : 'Mixed';
    const entry = {
      percentage,
      score,
      total,
      category,
      date: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }),
    };

    const raw = localStorage.getItem('quiz_high_score');
    let isNew = false;

    if (!raw) {
      isNew = true;
    } else {
      try {
        const prev = JSON.parse(raw);
        if (percentage > prev.percentage) isNew = true;
      } catch {
        isNew = true;
      }
    }

    if (isNew) localStorage.setItem('quiz_high_score', JSON.stringify(entry));

    if (this.newRecordBanner) {
      this.newRecordBanner.classList.toggle('hidden', !(isNew && percentage > 0));
    }

    this._loadHighScore();
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SHUFFLE (Fisher-Yates)
  // ════════════════════════════════════════════════════════════════════════════
  _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // START QUIZ
  // ════════════════════════════════════════════════════════════════════════════
  startQuiz() {
    sound.playSelect();

    const cat   = this.categorySelect.value;
    const diff  = this.difficultySelect.value;
    const count = parseInt(this.countSelect.value, 10);
    this.timerMode = this.timerSelect.value;

    // Filter pool
    let pool = QUESTION_BANK.filter(q =>
      (cat  === 'all' || q.category  === cat)  &&
      (diff === 'all' || q.difficulty === diff)
    );

    // Fallback: loosen difficulty if pool is too small
    if (pool.length < count) {
      pool = QUESTION_BANK.filter(q => cat === 'all' || q.category === cat);
    }
    if (pool.length === 0) pool = [...QUESTION_BANK];

    // Randomise question order
    if (this.randomizeQuestionsCheck.checked) pool = this._shuffle(pool);

    // Build question objects (with optionally shuffled options)
    this.questions = pool.slice(0, count).map(q => {
      const withMeta = q.options.map((text, i) => ({ text, isCorrect: i === q.correctAnswer }));
      const ordered  = this.randomizeOptionsCheck.checked ? this._shuffle(withMeta) : withMeta;
      return {
        id:          q.id,
        category:    q.category,
        difficulty:  q.difficulty,
        question:    q.question,
        options:     ordered.map(o => o.text),
        correctAnswer: ordered.findIndex(o => o.isCorrect),
        explanation: q.explanation,
      };
    });

    // Reset state
    this.currentIndex = 0;
    this.userAnswers  = {};
    this.startTime    = Date.now();
    this.endTime      = null;

    this._renderPalette();
    this._displayQuestion(0);
    this._switchView('quiz');
    this._initTimer();
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TIMER
  // ════════════════════════════════════════════════════════════════════════════
  _initTimer() {
    this._clearTimer();
    if (this.timerMode === 'none') {
      if (this.timerContainer) this.timerContainer.classList.add('hidden');
      return;
    }
    if (this.timerContainer) this.timerContainer.classList.remove('hidden');

    if (this.timerMode === 'per-question') {
      this.timeRemaining = this.questionTimeLimit;
      this._startPerQuestionTimer();
    } else {
      this.timeRemaining = this.totalTimeLimit;
      this._startTotalTimer();
    }
  }

  _clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.timerContainer) this.timerContainer.classList.remove('warning', 'critical');
  }

  _startPerQuestionTimer() {
    this._clearTimer();
    this.timeRemaining = this.questionTimeLimit;
    this._updateTimerUI(this.timeRemaining, this.questionTimeLimit);

    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this._updateTimerUI(this.timeRemaining, this.questionTimeLimit);
      if (this.timeRemaining <= 5 && this.timeRemaining > 0) sound.playTick();
      if (this.timeRemaining <= 0) {
        this._clearTimer();
        if (this.currentIndex < this.questions.length - 1) {
          this.navigateNext();
        } else {
          this.proceedSubmission(); // time up on last question → submit
        }
      }
    }, 1000);
  }

  _startTotalTimer() {
    this._clearTimer();
    this._updateTimerUI(this.timeRemaining, this.totalTimeLimit);

    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this._updateTimerUI(this.timeRemaining, this.totalTimeLimit);
      if (this.timeRemaining <= 10 && this.timeRemaining > 0) sound.playTick();
      if (this.timeRemaining <= 0) {
        this._clearTimer();
        this.proceedSubmission(); // time up → submit directly, no alert
      }
    }, 1000);
  }

  _updateTimerUI(left, total) {
    if (!this.timerDisplay) return;
    const m = Math.floor(left / 60);
    const s = left % 60;
    this.timerDisplay.textContent = m > 0 ? `${m}:${s < 10 ? '0' : ''}${s}` : `${left}s`;

    if (this.timerBar) {
      this.timerBar.style.width = `${Math.max(0, (left / total) * 100)}%`;
    }

    if (!this.timerContainer) return;
    if (left <= 5) {
      this.timerContainer.classList.add('critical');
      this.timerContainer.classList.remove('warning');
    } else if (left <= 8) {
      this.timerContainer.classList.add('warning');
      this.timerContainer.classList.remove('critical');
    } else {
      this.timerContainer.classList.remove('warning', 'critical');
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // QUESTION PALETTE (dot matrix)
  // ════════════════════════════════════════════════════════════════════════════
  _renderPalette() {
    if (!this.paletteDots) return;
    this.paletteDots.innerHTML = '';
    this.questions.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className   = 'palette-dot';
      btn.textContent = i + 1;
      btn.title       = `Jump to question ${i + 1}`;
      btn.addEventListener('click', () => {
        sound.playSelect();
        this._displayQuestion(i);
      });
      this.paletteDots.appendChild(btn);
    });
  }

  _updatePalette() {
    if (!this.paletteDots) return;
    this.paletteDots.querySelectorAll('.palette-dot').forEach((dot, i) => {
      dot.classList.remove('current', 'answered');
      if (i === this.currentIndex) {
        dot.classList.add('current');
      } else if (this.userAnswers[i] !== undefined) {
        dot.classList.add('answered');
      }
    });

    const answered = Object.keys(this.userAnswers).length;
    if (this.answeredCountText) {
      this.answeredCountText.textContent = `${answered} of ${this.questions.length} answered`;
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // DISPLAY QUESTION
  // ════════════════════════════════════════════════════════════════════════════
  _displayQuestion(index) {
    this.currentIndex = index;
    const q = this.questions[index];

    // Badges
    if (this.metaCategory)   this.metaCategory.textContent  = q.category;
    if (this.metaDifficulty) {
      this.metaDifficulty.textContent = q.difficulty;
      this.metaDifficulty.className   = 'badge difficulty-badge';
      if (q.difficulty.toLowerCase() === 'easy') this.metaDifficulty.classList.add('easy');
      if (q.difficulty.toLowerCase() === 'hard') this.metaDifficulty.classList.add('hard');
    }

    // Progress
    if (this.currentQIndex)    this.currentQIndex.textContent   = index + 1;
    if (this.totalQCount)      this.totalQCount.textContent     = this.questions.length;
    if (this.progressBarFill)  this.progressBarFill.style.width = `${((index + 1) / this.questions.length) * 100}%`;

    // Question text
    if (this.questionTitle) this.questionTitle.textContent = q.question;

    // Options
    if (this.optionsContainer) {
      this.optionsContainer.innerHTML = '';
      const LETTERS = ['A', 'B', 'C', 'D'];

      q.options.forEach((text, oi) => {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.setAttribute('role', 'radio');
        card.setAttribute('aria-checked', this.userAnswers[index] === oi ? 'true' : 'false');
        card.setAttribute('tabindex', '0');
        if (this.userAnswers[index] === oi) card.classList.add('selected');

        card.innerHTML = `
          <div class="option-badge">${LETTERS[oi]}</div>
          <div class="option-text">${text}</div>
          <div class="option-check">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>`;

        card.addEventListener('click', () => this.selectOption(oi));
        card.addEventListener('keydown', e => {
          if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this.selectOption(oi); }
        });
        this.optionsContainer.appendChild(card);
      });
    }

    // Nav buttons
    if (this.prevBtn) this.prevBtn.disabled = (index === 0);

    const isLast = index === this.questions.length - 1;
    if (this.nextBtn)       this.nextBtn.classList.toggle('hidden', isLast);
    if (this.submitQuizBtn) this.submitQuizBtn.classList.toggle('hidden', !isLast);

    this._updatePalette();

    // Per-question timer reset
    if (this.timerMode === 'per-question') this._startPerQuestionTimer();
  }

  // ════════════════════════════════════════════════════════════════════════════
  // ANSWER SELECTION
  // ════════════════════════════════════════════════════════════════════════════
  selectOption(oi) {
    if (oi < 0 || oi > 3) return;
    sound.playSelect();
    this.userAnswers[this.currentIndex] = oi;

    if (this.optionsContainer) {
      this.optionsContainer.querySelectorAll('.option-card').forEach((card, i) => {
        const sel = i === oi;
        card.classList.toggle('selected', sel);
        card.setAttribute('aria-checked', sel ? 'true' : 'false');
      });
    }
    this._updatePalette();
  }

  // ════════════════════════════════════════════════════════════════════════════
  // NAVIGATION
  // ════════════════════════════════════════════════════════════════════════════
  navigateNext() {
    if (this.currentIndex < this.questions.length - 1) {
      sound.playNavigate();
      this._displayQuestion(this.currentIndex + 1);
    }
  }

  navigatePrev() {
    if (this.currentIndex > 0) {
      sound.playNavigate();
      this._displayQuestion(this.currentIndex - 1);
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SUBMIT — two-step: check → confirm or go straight
  // ════════════════════════════════════════════════════════════════════════════
  finishQuiz() {
    const answered   = Object.keys(this.userAnswers).length;
    const unanswered = this.questions.length - answered;

    if (unanswered > 0) {
      // Use native confirm so there are zero DOM dependencies
      const ok = confirm(
        `You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}.\n\nSubmit anyway? Skipped questions count as incorrect.`
      );
      if (!ok) return; // user wants to keep answering
    }

    this.proceedSubmission();
  }

  // ── The ONE place that commits the quiz ────────────────────────────────────
  proceedSubmission() {
    this._clearTimer();
    this.endTime = Date.now();
    this._calculateResults();
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCORING & RESULTS
  // ════════════════════════════════════════════════════════════════════════════
  _calculateResults() {
    let correct = 0;
    this.questions.forEach((q, i) => {
      if (this.userAnswers[i] === q.correctAnswer) correct++;
    });

    const total      = this.questions.length;
    const incorrect  = total - correct;
    const pct        = Math.round((correct / total) * 100);
    const passed     = pct >= this.passingThreshold;

    // Time
    const elapsed = Math.max(1, Math.round((this.endTime - this.startTime) / 1000));
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');
    const timeStr = `${mm}:${ss}`;

    // ── Populate results screen ──────────────────────────────────────────────
    if (this.resultFraction)     this.resultFraction.textContent     = `${correct} / ${total}`;
    if (this.resultPercentage)   this.resultPercentage.textContent   = `${pct}%`;
    if (this.statCorrectCount)   this.statCorrectCount.textContent   = correct;
    if (this.statIncorrectCount) this.statIncorrectCount.textContent = incorrect;
    if (this.statTimeSpent)      this.statTimeSpent.textContent      = timeStr;

    if (passed) {
      if (this.resultStatusBadge) { this.resultStatusBadge.className = 'result-badge pass'; this.resultStatusBadge.textContent = 'PASSED'; }
      if (this.resultHeadline)    this.resultHeadline.textContent  = pct === 100 ? 'Perfection Achieved! 🏆' : 'Outstanding Job! 🎉';
      if (this.resultSubtext)     this.resultSubtext.textContent   = `You exceeded the ${this.passingThreshold}% passing mark!`;
      if (this.scoreCircleFg)     this.scoreCircleFg.className     = 'score-circle-fg pass';
      sound.playVictory();
      this.confetti.fire();
    } else {
      if (this.resultStatusBadge) { this.resultStatusBadge.className = 'result-badge fail'; this.resultStatusBadge.textContent = 'FAILED'; }
      if (this.resultHeadline)    this.resultHeadline.textContent  = 'Keep Striving! 💪';
      if (this.resultSubtext)     this.resultSubtext.textContent   = `Need ${this.passingThreshold}% to pass. Review the answers below and try again!`;
      if (this.scoreCircleFg)     this.scoreCircleFg.className     = 'score-circle-fg fail';
      sound.playFail();
    }

    // Animated score ring
    if (this.scoreCircleFg) {
      const C = 2 * Math.PI * 58; // r = 58, circumference ≈ 364.4
      this.scoreCircleFg.style.strokeDasharray  = C;
      this.scoreCircleFg.style.strokeDashoffset = C;
      setTimeout(() => {
        this.scoreCircleFg.style.strokeDashoffset = C - (pct / 100) * C;
      }, 120);
    }

    // Save high score
    this._saveHighScore(pct, correct, total);

    // Filter pill counts
    if (this.resultsFilterAllCount)      this.resultsFilterAllCount.textContent      = total;
    if (this.resultsFilterCorrectCount)  this.resultsFilterCorrectCount.textContent  = correct;
    if (this.resultsFilterIncorrectCount) this.resultsFilterIncorrectCount.textContent = incorrect;

    // Reset filter pills to "All"
    document.querySelectorAll('#results-review-section .filter-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.filter === 'all');
    });

    // Render answer breakdown immediately
    this._renderReviewList('all');

    // Navigate to results view
    this._switchView('results');
  }

  // ════════════════════════════════════════════════════════════════════════════
  // ANSWER REVIEW LIST
  // ════════════════════════════════════════════════════════════════════════════
  _renderReviewList(filter = 'all') {
    const container = this.resultsReviewList;
    if (!container) return;

    container.innerHTML = '';
    const L = ['A', 'B', 'C', 'D'];

    this.questions.forEach((q, i) => {
      const pick        = this.userAnswers[i];
      const isCorrect   = pick === q.correctAnswer;
      const isSkipped   = pick === undefined;

      if (filter === 'correct'   && !isCorrect)  return;
      if (filter === 'incorrect' &&  isCorrect)  return;

      const userLabel    = isSkipped ? 'None (Skipped)' : `${L[pick]}. ${q.options[pick]}`;
      const correctLabel = `${L[q.correctAnswer]}. ${q.options[q.correctAnswer]}`;
      const badgeLabel   = isSkipped ? '⏱ Skipped'
                         : isCorrect  ? '✓ Your Answer (Correct)'
                         :              '✗ Your Answer (Incorrect)';

      const card = document.createElement('div');
      card.className = `review-card ${isCorrect ? 'is-correct' : 'is-incorrect'}`;
      card.innerHTML = `
        <div class="review-q-meta">
          <span class="review-q-number">Question ${i + 1} of ${this.questions.length}</span>
          <span class="review-status-tag ${isCorrect ? 'correct' : 'incorrect'}">
            ${isCorrect ? '✓ Correct' : (isSkipped ? '⏱ Skipped' : '✗ Incorrect')}
          </span>
        </div>
        <div class="review-q-text">${q.question}</div>
        <div class="review-answers-grid">
          <div class="review-answer-pill user-pick ${isCorrect ? 'correct-pick' : 'wrong'}">
            <small>${badgeLabel}</small>
            <span>${userLabel}</span>
          </div>
          <div class="review-answer-pill correct-pick">
            <small>★ Correct Answer</small>
            <span>${correctLabel}</span>
          </div>
        </div>
        <div class="review-explanation">
          <span class="explanation-icon">💡</span>
          <div><strong>Explanation:</strong> ${q.explanation}</div>
        </div>`;

      container.appendChild(card);
    });

    if (container.children.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:2.5rem 1rem;color:var(--text-muted);">
          No questions match the selected filter.
        </div>`;
    }
  }
}

// ════════════════════════════════════════════════════════════════════════════
// BOOTSTRAP
// ════════════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  window.quizApp = new QuizApp();
});
