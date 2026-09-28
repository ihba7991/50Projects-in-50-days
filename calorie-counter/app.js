import { parseSamsungSteps } from "./samsung.js";

const MODEL = "claude-opus-5";
// Loaded lazily so the log still works offline or if the CDN is unreachable.
const SDK_URL = "https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk/+esm";
let Anthropic = null;
const STORAGE_KEY = "snap-calories-v1";

// ---------- State ----------

const defaults = { apiKey: "", goal: 2000, weightKg: 70, meals: [], steps: {} };

function load() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") };
  } catch {
    return { ...defaults };
  }
}

let state = load();

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    alert("Couldn't save — browser storage may be full. Try exporting and deleting old meals.");
    console.error(err);
  }
}

const $ = (id) => document.getElementById(id);
const todayKey = () => toKey(new Date());
function toKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

let currentDay = todayKey();
let pending = null; // { analysis, thumb }

// ---------- Rendering ----------

// Rough walking burn: ~0.0005 kcal per step per kg (≈0.04 kcal/step at 80 kg).
const stepCalories = (steps) => Math.round(steps * state.weightKg * 0.0005);

function mealTotals(meal) {
  const f = meal.portion;
  return meal.items.reduce(
    (t, i) => ({
      kcal: t.kcal + i.calories * f,
      p: t.p + i.protein_g * f,
      c: t.c + i.carbs_g * f,
      fat: t.fat + i.fat_g * f,
    }),
    { kcal: 0, p: 0, c: 0, fat: 0 },
  );
}

function render() {
  $("day-picker").value = currentDay;
  $("next-day").disabled = currentDay >= todayKey();

  const meals = state.meals.filter((m) => m.day === currentDay);
  const totals = meals.map(mealTotals).reduce(
    (a, b) => ({ kcal: a.kcal + b.kcal, p: a.p + b.p, c: a.c + b.c, fat: a.fat + b.fat }),
    { kcal: 0, p: 0, c: 0, fat: 0 },
  );
  const steps = state.steps[currentDay] ?? 0;
  const burned = stepCalories(steps);
  const budget = state.goal + burned;
  const remaining = Math.round(budget - totals.kcal);

  $("goal").textContent = state.goal;
  $("eaten").textContent = Math.round(totals.kcal);
  $("burned").textContent = burned;
  $("steps").textContent = steps.toLocaleString();
  $("remaining").textContent = remaining;
  $("protein").textContent = Math.round(totals.p);
  $("carbs").textContent = Math.round(totals.c);
  $("fat").textContent = Math.round(totals.fat);

  const ring = $("ring-fg");
  const pct = Math.min(totals.kcal / budget, 1);
  ring.style.strokeDashoffset = String(326.7 * (1 - pct));
  ring.classList.toggle("over", remaining < 0);

  const log = $("log");
  log.innerHTML = "";
  $("log-empty").classList.toggle("hidden", meals.length > 0);
  for (const meal of meals) {
    const li = document.createElement("li");
    const img = document.createElement("img");
    img.alt = "";
    if (meal.thumb) img.src = meal.thumb;
    const info = document.createElement("div");
    const title = document.createElement("div");
    title.textContent = meal.dish;
    const meta = document.createElement("div");
    meta.className = "meta";
    const time = new Date(meal.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    meta.textContent = `${meal.mealType} · ${time}${meal.portion !== 1 ? ` · ×${meal.portion}` : ""}`;
    info.append(title, meta);
    const right = document.createElement("div");
    right.className = "kcal";
    right.textContent = `${Math.round(mealTotals(meal).kcal)} kcal`;
    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "Delete";
    del.onclick = () => {
      if (!confirm(`Delete "${meal.dish}"?`)) return;
      state.meals = state.meals.filter((m) => m.id !== meal.id);
      save();
      render();
    };
    right.append(document.createElement("br"), del);
    li.append(img, info, right);
    log.append(li);
  }
}

// ---------- Image handling ----------

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Couldn't read that image."));
    img.src = url;
  });
}

// Downscale to keep uploads fast and thumbnails small enough for localStorage.
function resize(img, maxSide, quality) {
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

// ---------- Claude food analysis ----------

const FOOD_SCHEMA = {
  type: "object",
  properties: {
    is_food: { type: "boolean" },
    dish: { type: "string", description: "Short name for the whole meal" },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          portion: { type: "string", description: "Estimated visible portion, e.g. '1 cup', '150 g'" },
          calories: { type: "number" },
          protein_g: { type: "number" },
          carbs_g: { type: "number" },
          fat_g: { type: "number" },
        },
        required: ["name", "portion", "calories", "protein_g", "carbs_g", "fat_g"],
        additionalProperties: false,
      },
    },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    notes: { type: "string", description: "Assumptions made, e.g. cooking oil, hidden ingredients" },
  },
  required: ["is_food", "dish", "items", "confidence", "notes"],
  additionalProperties: false,
};

async function analyzeFood(dataUrl) {
  if (!state.apiKey) throw new Error("Add your Anthropic API key in Settings (⚙️) first.");

  Anthropic ??= (await import(SDK_URL)).default;
  const client = new Anthropic({ apiKey: state.apiKey, dangerouslyAllowBrowser: true });
  const base64 = dataUrl.split(",")[1];

  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { format: { type: "json_schema", schema: FOOD_SCHEMA } },
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64 } },
          {
            type: "text",
            text:
              "You are a nutrition assistant for a calorie-tracking app. Identify every food and drink " +
              "in this photo, estimate the portion actually visible, and estimate calories and macros for each item. " +
              "Use plate size, utensils and packaging for scale. Include likely cooking oils, sauces and dressings. " +
              "If the photo contains no food, set is_food to false and return an empty items list.",
          },
        ],
      },
    ],
  });

  if (response.stop_reason === "refusal") throw new Error("Claude declined to analyze this photo.");
  if (response.stop_reason === "max_tokens") throw new Error("Analysis was cut off — please try again.");

  const text = response.content.find((b) => b.type === "text")?.text;
  if (!text) throw new Error("No analysis returned.");
  const result = JSON.parse(text);
  if (!result.is_food) throw new Error("That doesn't look like food. Try another photo.");
  return result;
}

function showResult() {
  const { analysis } = pending;
  const portion = Number($("portion").value) || 1;
  $("result-title").textContent = `${analysis.dish} (${analysis.confidence} confidence)`;
  const list = $("result-items");
  list.innerHTML = "";
  for (const item of analysis.items) {
    const li = document.createElement("li");
    li.textContent = `${item.name} — ${item.portion}: ${Math.round(item.calories * portion)} kcal`;
    list.append(li);
  }
  if (analysis.notes) {
    const li = document.createElement("li");
    li.className = "muted small";
    li.textContent = analysis.notes;
    list.append(li);
  }
  const total = analysis.items.reduce((s, i) => s + i.calories, 0) * portion;
  $("result-total").textContent = Math.round(total);
}

function defaultMealType() {
  const h = new Date().getHours();
  if (h < 11) return "Breakfast";
  if (h < 16) return "Lunch";
  if (h < 21) return "Dinner";
  return "Snack";
}

async function handlePhoto(file) {
  if (!file) return;
  const panel = $("analyzing");
  const status = $("analyze-status");
  panel.classList.remove("hidden");
  $("result").classList.add("hidden");
  status.classList.remove("error");
  status.textContent = "Analyzing your food…";
  pending = null;

  try {
    const img = await loadImage(file);
    const upload = resize(img, 1280, 0.85);
    const thumb = resize(img, 160, 0.7);
    $("preview").src = upload;
    URL.revokeObjectURL(img.src);

    const analysis = await analyzeFood(upload);
    pending = { analysis, thumb };
    $("portion").value = 1;
    $("meal-type").value = defaultMealType();
    status.textContent = "Check the estimate, adjust the portion, then log it.";
    $("result").classList.remove("hidden");
    showResult();
  } catch (err) {
    console.error(err);
    status.classList.add("error");
    status.textContent = Anthropic && err instanceof Anthropic.AuthenticationError
      ? "Your API key was rejected. Check it in Settings."
      : Anthropic && err instanceof Anthropic.RateLimitError
        ? "Rate limited — wait a moment and try again."
        : err.message;
  }
}

// ---------- Events ----------

$("photo-input").onchange = (e) => { handlePhoto(e.target.files[0]); e.target.value = ""; };
$("gallery-input").onchange = (e) => { handlePhoto(e.target.files[0]); e.target.value = ""; };
$("portion").oninput = () => pending && showResult();

$("save-meal").onclick = () => {
  if (!pending) return;
  const { analysis, thumb } = pending;
  state.meals.push({
    id: crypto.randomUUID(),
    day: currentDay,
    at: Date.now(),
    mealType: $("meal-type").value,
    portion: Number($("portion").value) || 1,
    dish: analysis.dish,
    items: analysis.items,
    thumb,
  });
  save();
  pending = null;
  $("analyzing").classList.add("hidden");
  render();
};

$("cancel-meal").onclick = () => {
  pending = null;
  $("analyzing").classList.add("hidden");
};

function shiftDay(delta) {
  const d = new Date(currentDay + "T12:00:00");
  d.setDate(d.getDate() + delta);
  currentDay = toKey(d);
  render();
}
$("prev-day").onclick = () => shiftDay(-1);
$("next-day").onclick = () => shiftDay(1);
$("day-picker").onchange = (e) => { if (e.target.value) { currentDay = e.target.value; render(); } };

$("steps-csv").onchange = async (e) => {
  const file = e.target.files[0];
  e.target.value = "";
  if (!file) return;
  try {
    const byDay = parseSamsungSteps(await file.text());
    Object.assign(state.steps, byDay);
    save();
    const days = Object.keys(byDay).sort();
    $("steps-status").textContent = `Imported ${days.length} day(s) of steps (${days[0]} → ${days.at(-1)}).`;
    render();
  } catch (err) {
    $("steps-status").textContent = `Import failed: ${err.message}`;
  }
};

$("save-steps").onclick = () => {
  const n = parseInt($("manual-steps").value, 10);
  if (!Number.isFinite(n) || n < 0) return;
  state.steps[currentDay] = n;
  save();
  $("manual-steps").value = "";
  $("steps-status").textContent = `Saved ${n.toLocaleString()} steps for ${currentDay}.`;
  render();
};

$("settings-btn").onclick = () => {
  $("api-key").value = state.apiKey;
  $("goal-input").value = state.goal;
  $("weight-input").value = state.weightKg;
  $("settings").showModal();
};

$("settings-save").onclick = () => {
  state.apiKey = $("api-key").value.trim();
  state.goal = Number($("goal-input").value) || defaults.goal;
  state.weightKg = Number($("weight-input").value) || defaults.weightKg;
  save();
  render();
};

$("export-data").onclick = () => {
  const { apiKey, ...data } = state;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `snap-calories-${todayKey()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
};

render();
if (!state.apiKey) $("settings-btn").click();
