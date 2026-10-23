# QuizPulse — Modern Interactive Quiz Application

A responsive, feature-rich web application built with vanilla HTML5, CSS3, and modern ES6 JavaScript.

---

## 🌟 Feature Checklist & Requirements Mapping

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Display one question at a time** | State-driven question carousel showing a single question with smooth transitions. | ✅ Complete |
| **Each question should have four options** | 4 styled answer choice cards (A, B, C, D) with accessible ARIA radio semantics. | ✅ Complete |
| **Allow only one answer per question** | Mutually exclusive single selection per question. User can also change answer before final submission. | ✅ Complete |
| **Include Next and Previous buttons** | Full back-and-forth navigation controls with disabled state on Question 1. | ✅ Complete |
| **Display current question number** | Live counter header ("Question X of Y") alongside an interactive matrix palette. | ✅ Complete |
| **Calculate the final score** | Automatic tallying of correct vs incorrect answers upon submission. | ✅ Complete |
| **Show correct & incorrect answers after submission** | In-depth answers review view with color coding (green/red), chosen answer, correct answer, and explanation. | ✅ Complete |
| **Display percentage and pass/fail status** | Animated circular SVG score gauge with dynamic pass (≥ 70%) or fail badge & celebratory fanfare. | ✅ Complete |
| **Timer for each question or entire quiz (Bonus)** | Configurable modes: 20s Per-Question countdown (with auto-advance), 3-minute Total Quiz timer, or Zen (untimed). | ✅ Complete |
| **Randomize question order (Bonus)** | Fisher-Yates shuffle algorithm for both questions and answer options with toggle controls. | ✅ Complete |
| **Save highest score in localStorage (Bonus)** | Persists personal best score %, accuracy fraction, category, and date with "New Record" banner. | ✅ Complete |

---

## 🚀 Additional Premium Enhancements

1. **Web Audio API Synthesizer (`sound.js`)**:
   - Zero external audio assets! Pure in-browser synthetic sound effects for option clicks, navigation whooshes, countdown ticks, pass fanfare, and fail chime.
   - Global sound mute toggle with persistence.
2. **Confetti Particle Cannon (`confetti.js`)**:
   - Canvas-based particle explosion when achieving a passing score.
3. **Question Matrix Quick-Jump**:
   - Interactive numbered pills showing answered, current, and unanswered states for instant navigation.
4. **Keyboard Accessibility**:
   - Press `1`, `2`, `3`, `4` or `A`, `B`, `C`, `D` to choose options.
   - Use `←` and `→` arrow keys to navigate between questions.
   - Press `Enter` to advance or submit.
5. **Detailed Review Filtering**:
   - Filter review items by All, Correct Only, or Incorrect Only.
6. **Curated Multi-Category Question Bank (`questions.js`)**:
   - 24+ curated questions across Web Development, Computer Science, Science, and Trivia with comprehensive explanations.

---

## 💻 How to Run Locally

Because the application uses modern standard ES6 modules (`type="module"`), it should be served via any local HTTP server:

### Option A: Using Python (Built-in)
```bash
python -m http.server 8080
```
Then visit `http://localhost:8080` in your web browser.

### Option B: Using Node.js / npx
```bash
npx serve .
```

### Option C: VS Code Live Server
Right-click `index.html` and click **"Open with Live Server"**.
