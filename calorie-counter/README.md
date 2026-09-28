# Snap Calories 📷🥗

A calorie counter where you **take a picture of your food** and it logs what you ate and the calories — plus your **steps from Samsung Health**.

## Features

- **Snap to log** – take a photo (or pick one from your gallery). Claude identifies each food, estimates the portion, calories and protein/carbs/fat.
- **Adjust before saving** – change the portion multiplier and meal type, then tap *Log it*.
- **Daily dashboard** – calories left, eaten, burned from steps, and macros, for any day.
- **Samsung Health steps** – import your Samsung Health data export; steps add to your calorie budget.
- **Private** – everything is stored in your browser (`localStorage`). Photos go only to the Anthropic API for analysis.
- **Installable** – open on your phone and "Add to Home screen" to use it like an app.

## Setup

1. Get an API key from the [Anthropic Console](https://console.anthropic.com/).
2. Serve the folder (camera + ES modules need `http(s)://`, not `file://`):
   ```bash
   cd calorie-counter
   python3 -m http.server 8000
   ```
   Or deploy it to GitHub Pages / Netlify to use it from your phone.
3. Open the app, tap ⚙️, paste your API key, set your calorie goal and body weight.

## Syncing steps from Samsung Health

Samsung Health has no web API, so steps come in through its data export:

1. On your phone: **Samsung Health → ☰ / Settings → Download personal data → Download**.
2. Open the exported folder and find
   `com.samsung.shealth.step_daily_trend.<date>.csv`
   (or `com.samsung.shealth.tracker.pedometer_step_count.<date>.csv`).
3. In the app, tap **Import CSV** and pick that file. All days in the export are imported.
   Phone + watch duplicates are avoided by using Samsung's combined "all devices" total.

You can also type today's steps in manually.

Calories burned from steps are estimated as `steps × weight(kg) × 0.0005` (~0.04 kcal/step at 80 kg).

> **Live automatic sync?** That requires a native Android app that reads from
> [Health Connect](https://developer.android.com/health-and-fitness/guides/health-connect)
> (Samsung Health syncs steps into it). That's a natural next step for this project.

## How the photo analysis works

`app.js` sends a downscaled JPEG to Claude (`claude-opus-5`) with a JSON schema
(structured outputs), so the reply is always a list of items with calories and macros.
Server-side fallbacks are enabled, so if a request is declined it is retried on a fallback model.

⚠️ The API key is stored in your browser and requests go straight from the browser to the API.
That's fine for a personal app, but don't host it publicly with your key baked in.
Estimates from photos are approximate — hidden oils, sauces and portion sizes are hard to see.

## Files

| File | Purpose |
|---|---|
| `index.html` | Layout |
| `style.css` | Styles (light/dark, mobile-first) |
| `app.js` | State, UI, photo analysis with Claude |
| `samsung.js` | Samsung Health step CSV parser |
| `manifest.json` | Add-to-home-screen support |
