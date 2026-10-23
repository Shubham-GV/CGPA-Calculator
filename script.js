const GRADES = { "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "P": 4, "F": 0 };
const STORAGE_KEY = "cgpa-calculator-data";

const semestersEl = document.getElementById("semesters");
const cgpaEl = document.getElementById("cgpa");
const creditsEl = document.getElementById("total-credits");
const percentEl = document.getElementById("percentage");

let semesters = load();

// ---------- State ----------
function newSubject() {
  return { name: "", credits: "", grade: "" };
}

function newSemester() {
  return { subjects: [newSubject(), newSubject(), newSubject()] };
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch (e) { /* ignore */ }
  return [newSemester()];
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(semesters));
  } catch (e) { /* storage unavailable */ }
}

// ---------- Calculation ----------
function semesterTotals(sem) {
  let credits = 0;
  let points = 0;
  sem.subjects.forEach((s) => {
    const c = parseFloat(s.credits);
    if (c > 0 && s.grade in GRADES) {
      credits += c;
      points += c * GRADES[s.grade];
    }
  });
  return { credits, points };
}

function updateResults() {
  let totalCredits = 0;
  let totalPoints = 0;

  semesters.forEach((sem, i) => {
    const { credits, points } = semesterTotals(sem);
    totalCredits += credits;
    totalPoints += points;
    const badge = document.getElementById(`sgpa-${i}`);
    if (badge) badge.textContent = `SGPA: ${credits ? (points / credits).toFixed(2) : "0.00"}`;
  });

  const cgpa = totalCredits ? totalPoints / totalCredits : 0;
  cgpaEl.textContent = cgpa.toFixed(2);
  creditsEl.textContent = totalCredits;
  percentEl.textContent = (cgpa * 9.5).toFixed(1);
}

// ---------- Rendering ----------
function render() {
  semestersEl.innerHTML = "";

  semesters.forEach((sem, si) => {
    const card = document.createElement("section");
    card.className = "sem";

    const head = document.createElement("div");
    head.className = "sem-head";
    head.innerHTML = `
      <h2>Semester ${si + 1}</h2>
      <span class="sgpa" id="sgpa-${si}">SGPA: 0.00</span>
      <button class="btn danger small" data-action="remove-sem" data-sem="${si}">Remove</button>
    `;
    card.appendChild(head);

    const header = document.createElement("div");
    header.className = "row header";
    header.innerHTML = "<span>Subject</span><span>Credits</span><span>Grade</span><span></span>";
    card.appendChild(header);

    sem.subjects.forEach((sub, subi) => {
      const row = document.createElement("div");
      row.className = "row";

      const options = ['<option value="">Grade</option>']
        .concat(Object.keys(GRADES).map(
          (g) => `<option value="${g}" ${sub.grade === g ? "selected" : ""}>${g}</option>`
        ))
        .join("");

      row.innerHTML = `
        <input type="text" placeholder="Subject (optional)" value="${escapeHtml(sub.name)}"
               data-field="name" data-sem="${si}" data-sub="${subi}">
        <input type="number" min="0" step="0.5" placeholder="Cr" value="${sub.credits}"
               data-field="credits" data-sem="${si}" data-sub="${subi}">
        <select data-field="grade" data-sem="${si}" data-sub="${subi}">${options}</select>
        <button class="icon-btn" title="Delete subject"
                data-action="remove-sub" data-sem="${si}" data-sub="${subi}">✕</button>
      `;
      card.appendChild(row);
    });

    const add = document.createElement("button");
    add.className = "btn ghost small";
    add.textContent = "+ Add subject";
    add.dataset.action = "add-sub";
    add.dataset.sem = si;
    card.appendChild(add);

    semestersEl.appendChild(card);
  });

  updateResults();
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// ---------- Events ----------
semestersEl.addEventListener("input", (e) => {
  const t = e.target;
  if (!t.dataset.field) return;
  semesters[t.dataset.sem].subjects[t.dataset.sub][t.dataset.field] = t.value;
  save();
  updateResults();
});

semestersEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const si = Number(btn.dataset.sem);
  const subi = Number(btn.dataset.sub);

  switch (btn.dataset.action) {
    case "add-sub":
      semesters[si].subjects.push(newSubject());
      break;
    case "remove-sub":
      semesters[si].subjects.splice(subi, 1);
      if (!semesters[si].subjects.length) semesters[si].subjects.push(newSubject());
      break;
    case "remove-sem":
      semesters.splice(si, 1);
      if (!semesters.length) semesters.push(newSemester());
      break;
  }
  save();
  render();
});

document.getElementById("add-sem").addEventListener("click", () => {
  semesters.push(newSemester());
  save();
  render();
});

document.getElementById("reset").addEventListener("click", () => {
  if (!confirm("Clear all semesters and subjects?")) return;
  semesters = [newSemester()];
  save();
  render();
});

render();
