# 🎓 College CGPA Calculator

A simple, responsive CGPA/SGPA calculator for college students, built with plain HTML, CSS and JavaScript. No frameworks, no dependencies — just open `index.html`.

## Features

- Add any number of **semesters**, each with its own subjects
- Enter **credits** and **grade** per subject
- Live **SGPA** for every semester and overall **CGPA**
- Total credits and approximate percentage (CGPA × 9.5)
- Data is **saved automatically** in your browser (`localStorage`)
- Add/remove subjects and semesters, or reset everything
- Works on mobile and desktop, dark theme

## Grade scale (10-point)

| Grade | O | A+ | A | B+ | B | C | P | F |
|-------|---|----|---|----|---|---|---|---|
| Points | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 0 |

Formulas:

```
SGPA = Σ(credits × grade points) / Σ credits          (per semester)
CGPA = Σ(credits × grade points) / Σ credits          (across all semesters)
```

> Grade points and the percentage formula vary between universities. Edit the `GRADES` object in `script.js` to match yours.

## Run it

```bash
git clone https://github.com/<your-username>/cgpa-calculator.git
cd cgpa-calculator
# then open index.html in your browser
```

## Project structure

```
cgpa-calculator/
├── index.html   # layout
├── style.css    # styling
├── script.js    # calculation + state + rendering
└── README.md
```

## Ideas for improvement

- Export results as PDF or image
- Support a 4.0 GPA scale
- Target CGPA planner ("what SGPA do I need next sem?")
- Light/dark theme toggle

## License

MIT
