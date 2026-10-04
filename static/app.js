const form = {
  file: document.getElementById("file"),
  drop: document.getElementById("drop"),
  preview: document.getElementById("preview"),
  dropLabel: document.getElementById("dropLabel"),
  grade: document.getElementById("grade"),
  language: document.getElementById("language"),
  subject: document.getElementById("subject"),
  status: document.getElementById("status"),
  result: document.getElementById("result"),
  health: document.getElementById("health"),
  samples: document.getElementById("samples"),
  attemptBox: document.getElementById("attemptBox"),
  attempt: document.getElementById("attempt"),
  attemptStatus: document.getElementById("attemptStatus"),
};

let mode = "next-step";
let file = null;
let lastProblem = "";

function setMode(next) {
  mode = next;
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.mode === next);
  });
}

function showPreview(nextFile) {
  file = nextFile;
  const url = URL.createObjectURL(nextFile);
  form.preview.src = url;
  form.preview.hidden = false;
  form.dropLabel.hidden = true;
}

form.drop.addEventListener("click", () => form.file.click());
form.drop.addEventListener("dragover", (event) => event.preventDefault());
form.drop.addEventListener("drop", (event) => {
  event.preventDefault();
  if (event.dataTransfer.files[0]) showPreview(event.dataTransfer.files[0]);
});
form.file.addEventListener("change", () => {
  if (form.file.files[0]) showPreview(form.file.files[0]);
});
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => setMode(chip.dataset.mode));
});

function renderResult(data) {
  lastProblem = data.extracted_problem || "";
  const practice = (data.practice || [])
    .map(
      (item) =>
        `<div class="block"><div class="kicker">Practice</div><p>${item.question}</p><p class="hint">Hint: ${item.hint}</p></div>`
    )
    .join("");
  const found = (data.found_questions || [])
    .map((item) => `<span class="tag">${item.label}: ${item.text}</span>`)
    .join(" ");
  form.result.innerHTML = `
    <div class="meta">
      <span class="tag">${data.subject}</span>
      <span class="tag">${Math.round((data.confidence || 0) * 100)}% confidence</span>
      ${data.demo_mode ? `<span class="tag">demo mode</span>` : ""}
    </div>
    ${data.warning ? `<p class="warn">${data.warning}</p>` : ""}
    ${found ? `<div class="block"><div class="kicker">Questions on the page</div><div class="meta">${found}</div></div>` : ""}
    <div class="block"><div class="kicker">On the page</div><p>${data.extracted_problem}</p></div>
    <div class="block"><div class="kicker">Goal</div><p>${data.student_goal}</p></div>
    <div class="block"><div class="kicker">Hint</div><p>${data.hint}</p></div>
    <div class="block"><div class="kicker">Next step</div><p>${data.next_step}</p></div>
    <div class="block"><div class="kicker">Watch out</div><p>${data.common_mistake}</p></div>
    <div class="block"><div class="kicker">Worked solution</div><pre>${data.worked_solution}</pre></div>
    ${practice}
  `;
  form.attemptBox.hidden = false;
}

async function askTutor() {
  if (!file) {
    form.status.textContent = "Add a worksheet photo first.";
    return;
  }
  form.status.textContent = "Reading the page...";
  const body = new FormData();
  body.append("image", file);
  body.append("grade_band", form.grade.value);
  body.append("language", form.language.value);
  body.append("mode", mode);
  body.append("subject_hint", form.subject.value);
  try {
    const response = await fetch("/api/tutor", { method: "POST", body });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(err.detail || "Request failed");
    }
    renderResult(await response.json());
    form.status.textContent = "Ready.";
  } catch (error) {
    form.status.textContent = error.message;
  }
}

async function checkAttempt() {
  form.attemptStatus.textContent = "Checking your step...";
  try {
    const response = await fetch("/api/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problem: lastProblem, attempt: form.attempt.value }),
    });
    const data = await response.json();
    form.attemptStatus.textContent = `${data.verdict}: ${data.feedback} ${data.next_nudge}`;
  } catch (error) {
    form.attemptStatus.textContent = error.message;
  }
}

async function loadSamples() {
  const items = await fetch("/api/samples").then((r) => r.json());
  form.samples.innerHTML = "";
  items.forEach((item) => {
    const button = document.createElement("button");
    button.className = "ghost";
    button.type = "button";
    button.textContent = item.title;
    button.addEventListener("click", async () => {
      const blob = await fetch(item.file).then((r) => r.blob());
      showPreview(new File([blob], item.filename, { type: blob.type || "image/jpeg" }));
    });
    form.samples.appendChild(button);
  });
}

async function ping() {
  try {
    const data = await fetch("/api/health").then((r) => r.json());
    form.health.textContent = data.demo_mode
      ? "Demo mode. Add a Gemini or OpenAI key for live vision."
      : `Live tutor on ${data.provider}.`;
  } catch {
    form.health.textContent = "Backend not reachable.";
  }
}

document.getElementById("ask").addEventListener("click", askTutor);
document.getElementById("checkAttempt").addEventListener("click", checkAttempt);
document.getElementById("reset").addEventListener("click", () => {
  file = null;
  lastProblem = "";
  form.file.value = "";
  form.preview.hidden = true;
  form.dropLabel.hidden = false;
  form.attemptBox.hidden = true;
  form.attempt.value = "";
  form.attemptStatus.textContent = "";
  form.result.innerHTML = `<p class="result-empty">Upload a problem photo or choose a sample worksheet.</p>`;
  form.status.textContent = "";
});

ping();
loadSamples();
setMode("next-step");
