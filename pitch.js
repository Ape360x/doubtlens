const pptxgen = require("pptxgenjs");

const COLORS = {
  bg: "F1ECDF",
  ink: "1A1A1A",
  navy: "1F3DA8",
  muted: "6B6B6B",
  divider: "D9D2C2",
};

const FONT = "Helvetica Neue";
const W = 13.333;
const H = 7.5;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "DoubtLens";
pres.author = "Student team";
pres.company = "Multimodal AI Hackathon 2026";

function chrome(slide, topLabel, page, section) {
  slide.addText(topLabel, {
    x: 0.7, y: 0.45, w: 8, h: 0.3,
    fontFace: FONT, fontSize: 11, color: COLORS.muted, charSpacing: 3, margin: 0,
  });
  slide.addText(page, {
    x: 0.7, y: 6.9, w: 2.2, h: 0.28,
    fontFace: FONT, fontSize: 11, color: COLORS.muted, margin: 0,
  });
  slide.addText(section, {
    x: W - 4.6, y: 6.9, w: 3.9, h: 0.28,
    fontFace: FONT, fontSize: 11, color: COLORS.muted, align: "right", charSpacing: 2, margin: 0,
  });
}

{
  const s = pres.addSlide();
  s.background = { color: COLORS.bg };
  s.addText("EDUCATION TRACK  ·  MULTIMODAL AI HACKATHON 2026", {
    x: 0.8, y: 1.7, w: 11, h: 0.35,
    fontFace: FONT, fontSize: 13, color: COLORS.navy, charSpacing: 2,
  });
  s.addText("DoubtLens", {
    x: 0.8, y: 2.2, w: 11, h: 1.1,
    fontFace: FONT, fontSize: 54, color: COLORS.ink, bold: true, margin: 0,
  });
  s.addText("Snap the worksheet. Get the next step.", {
    x: 0.8, y: 3.4, w: 11, h: 0.5,
    fontFace: FONT, fontSize: 22, color: COLORS.navy, italic: true,
  });
  s.addText("A multimodal tutor that reads a problem photo and teaches one move at a time.", {
    x: 0.8, y: 4.2, w: 10, h: 0.6,
    fontFace: FONT, fontSize: 16, color: COLORS.muted,
  });
}

{
  const s = pres.addSlide();
  s.background = { color: COLORS.bg };
  chrome(s, "01  —  PROBLEM", "02 / 07", "WHY");
  s.addText("Students get stuck on the next move, not the final answer.", {
    x: 0.8, y: 1.2, w: 11.5, h: 1.1,
    fontFace: FONT, fontSize: 28, color: COLORS.ink, bold: true,
  });
  const points = [
    ["They photograph the page", "The question is on paper, not typed into a chatbot."],
    ["Generic AI dumps x = 11", "That ends the thinking instead of starting it."],
    ["Teachers cannot sit beside every desk", "The student needs one safe next step, now."],
  ];
  points.forEach((item, i) => {
    const y = 2.5 + i * 1.2;
    s.addText(item[0], { x: 0.8, y, w: 11.5, h: 0.4, fontFace: FONT, fontSize: 18, color: COLORS.navy, bold: true });
    s.addText(item[1], { x: 0.8, y: y + 0.38, w: 11.5, h: 0.35, fontFace: FONT, fontSize: 16, color: COLORS.muted });
  });
}

{
  const s = pres.addSlide();
  s.background = { color: COLORS.bg };
  chrome(s, "02  —  PRODUCT", "03 / 07", "WHAT");
  s.addText("See the page. Teach the next step.", {
    x: 0.8, y: 1.2, w: 11.5, h: 0.6,
    fontFace: FONT, fontSize: 28, color: COLORS.ink, bold: true,
  });
  const cards = [
    ["Photo in", "Worksheet, textbook, or handwriting."],
    ["Hint first", "No full answer unless the student asks."],
    ["Try a step", "The tutor checks the attempt, not only the result."],
    ["Practice out", "Two similar questions from the same idea."],
  ];
  cards.forEach((item, i) => {
    const x = 0.8 + (i % 2) * 6.1;
    const y = 2.2 + Math.floor(i / 2) * 2.0;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 5.7, h: 1.7, fill: { color: "FFFBF4" }, rectRadius: 0.1, line: { color: COLORS.divider },
    });
    s.addText(item[0], { x: x + 0.3, y: y + 0.28, w: 5.1, h: 0.4, fontFace: FONT, fontSize: 20, color: COLORS.navy, bold: true });
    s.addText(item[1], { x: x + 0.3, y: y + 0.75, w: 5.1, h: 0.6, fontFace: FONT, fontSize: 15, color: COLORS.muted });
  });
}

{
  const s = pres.addSlide();
  s.background = { color: COLORS.bg };
  chrome(s, "03  —  MULTIMODAL", "04 / 07", "HOW");
  s.addText("The model has to see the page.", {
    x: 0.8, y: 1.2, w: 11.5, h: 0.55,
    fontFace: FONT, fontSize: 28, color: COLORS.ink, bold: true,
  });
  const steps = [
    "Image + grade + language + help mode",
    "Vision model returns strict JSON",
    "UI locks the full solution until asked",
    "Student writes an attempt and gets a nudge",
  ];
  steps.forEach((text, i) => {
    s.addText(String(i + 1).padStart(2, "0"), {
      x: 0.8, y: 2.15 + i * 1.0, w: 1.1, h: 0.45,
      fontFace: FONT, fontSize: 20, color: COLORS.navy, bold: true,
    });
    s.addText(text, {
      x: 2.1, y: 2.15 + i * 1.0, w: 10, h: 0.45,
      fontFace: FONT, fontSize: 20, color: COLORS.ink,
    });
  });
}

{
  const s = pres.addSlide();
  s.background = { color: COLORS.bg };
  chrome(s, "04  —  DEMO", "05 / 07", "PROOF");
  s.addText("Algebra page → next step, not x = 11.", {
    x: 0.8, y: 1.2, w: 11.5, h: 0.6,
    fontFace: FONT, fontSize: 26, color: COLORS.ink, bold: true,
  });
  s.addText("Problem on the page", {
    x: 0.8, y: 2.2, w: 5.6, h: 0.35, fontFace: FONT, fontSize: 14, color: COLORS.navy, bold: true,
  });
  s.addText("Solve for x:\n3(x − 2) + 5 = 2x + 10", {
    x: 0.8, y: 2.6, w: 5.6, h: 1.3, fontFace: FONT, fontSize: 20, color: COLORS.ink,
  });
  s.addText("DoubtLens next step", {
    x: 7.0, y: 2.2, w: 5.5, h: 0.35, fontFace: FONT, fontSize: 14, color: COLORS.navy, bold: true,
  });
  s.addText("Expand the brackets.\n3 times both terms:\n3x − 6, not 3x − 2.", {
    x: 7.0, y: 2.6, w: 5.5, h: 1.5, fontFace: FONT, fontSize: 20, color: COLORS.ink,
  });
  s.addText("Then the student types their own step. The tutor marks on-track, almost, or off-track.", {
    x: 0.8, y: 4.6, w: 11.5, h: 0.8, fontFace: FONT, fontSize: 18, color: COLORS.muted,
  });
}

{
  const s = pres.addSlide();
  s.background = { color: COLORS.bg };
  chrome(s, "05  —  BUILD", "06 / 07", "STACK");
  s.addText("Shipped as a 15-day student MVP.", {
    x: 0.8, y: 1.2, w: 11.5, h: 0.55, fontFace: FONT, fontSize: 28, color: COLORS.ink, bold: true,
  });
  const stack = [
    ["Frontend", "HTML / CSS / JS, no build step"],
    ["Backend", "FastAPI + strict JSON schema"],
    ["Vision", "Gemini or OpenAI, demo fallback"],
    ["Safety", "School work only, human-check flag"],
  ];
  stack.forEach((item, i) => {
    s.addText(item[0], { x: 0.8, y: 2.2 + i * 0.95, w: 3.2, h: 0.45, fontFace: FONT, fontSize: 18, color: COLORS.navy, bold: true });
    s.addText(item[1], { x: 4.2, y: 2.2 + i * 0.95, w: 8, h: 0.45, fontFace: FONT, fontSize: 18, color: COLORS.ink });
  });
}

{
  const s = pres.addSlide();
  s.background = { color: COLORS.bg };
  chrome(s, "06  —  NEXT", "07 / 07", "CLOSE");
  s.addText("DoubtLens does not finish the homework.", {
    x: 0.8, y: 1.8, w: 11.5, h: 0.7, fontFace: FONT, fontSize: 28, color: COLORS.ink, bold: true,
  });
  s.addText("It makes the next step small enough to try.", {
    x: 0.8, y: 2.6, w: 11.5, h: 0.6, fontFace: FONT, fontSize: 24, color: COLORS.navy, italic: true,
  });
  s.addText("Next: circle one question on a busy page, check handwriting, and add a teacher review view.", {
    x: 0.8, y: 3.7, w: 11.5, h: 1.0, fontFace: FONT, fontSize: 18, color: COLORS.muted,
  });
}

pres.writeFile({ fileName: "/home/workdir/artifacts/doubtlens/DoubtLens_Pitch.pptx" })
  .then(() => console.log("wrote pitch"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
