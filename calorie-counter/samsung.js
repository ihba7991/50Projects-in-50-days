// Parsers for Samsung Health "Download personal data" CSV exports.
//
// Samsung Health exports have a metadata line first, then the header row, e.g.
//   com.samsung.shealth.step_daily_trend,6315002,3
//   ...,count,...,day_time,...,source_type,...
// Two step files are supported:
//   - com.samsung.shealth.step_daily_trend.*.csv   (one row per day per source)
//   - com.samsung.shealth.tracker.pedometer_step_count.*.csv (short intervals)

function splitCsvLine(line) {
  const out = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

// Column names are sometimes prefixed (e.g. "com.samsung.health.step_count.count"),
// so match on the last dotted segment.
function findColumn(header, name) {
  return header.findIndex((h) => h.trim().split(".").pop() === name);
}

// "UTC+0530" -> 330 (minutes)
function parseOffset(value) {
  const m = /([+-])(\d{2}):?(\d{2})/.exec(value ?? "");
  if (!m) return 0;
  return (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]));
}

// Timestamps in the export are UTC: epoch milliseconds (daily trend) or
// "YYYY-MM-DD HH:MM:SS.sss" strings (pedometer). offsetMinutes shifts to local time.
function toDateKey(value, offsetMinutes = 0) {
  if (!value || value.trim() === "") return null;
  const n = Number(value);
  const ms = Number.isFinite(n) ? n : Date.parse(value.trim().replace(" ", "T") + "Z");
  if (Number.isNaN(ms)) return null;
  const d = new Date(ms + offsetMinutes * 60_000);
  return d.toISOString().slice(0, 10);
}

/**
 * Parse a Samsung Health step CSV into { "YYYY-MM-DD": steps }.
 * Throws if the file doesn't look like a step export.
 */
export function parseSamsungSteps(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length < 2) throw new Error("File is empty.");

  // Skip the metadata line when present (it has no "count" column).
  let headerIdx = lines.findIndex((l) => findColumn(splitCsvLine(l), "count") !== -1);
  if (headerIdx === -1) throw new Error("No step 'count' column found — is this a Samsung Health step CSV?");
  const header = splitCsvLine(lines[headerIdx]);

  const countCol = findColumn(header, "count");
  const dayTimeCol = findColumn(header, "day_time");
  const startTimeCol = findColumn(header, "start_time");
  const sourceCol = findColumn(header, "source_type");
  const offsetCol = findColumn(header, "time_offset");
  const isDailyTrend = dayTimeCol !== -1;
  if (!isDailyTrend && startTimeCol === -1) {
    throw new Error("No date column (day_time or start_time) found.");
  }

  const rows = lines.slice(headerIdx + 1).map(splitCsvLine);
  const result = {};

  if (isDailyTrend) {
    // source_type -2 is Samsung's merged "all devices" total; prefer it when present
    // so phone + watch steps aren't double-counted.
    const hasMerged = sourceCol !== -1 && rows.some((r) => r[sourceCol]?.trim() === "-2");
    for (const r of rows) {
      if (hasMerged && r[sourceCol]?.trim() !== "-2") continue;
      // day_time is midnight UTC of the calendar day.
      const key = toDateKey(r[dayTimeCol]);
      const steps = parseInt(r[countCol], 10);
      if (!key || !Number.isFinite(steps)) continue;
      result[key] = hasMerged ? steps : Math.max(result[key] ?? 0, steps);
    }
  } else {
    for (const r of rows) {
      const key = toDateKey(r[startTimeCol], offsetCol === -1 ? 0 : parseOffset(r[offsetCol]));
      const steps = parseInt(r[countCol], 10);
      if (!key || !Number.isFinite(steps)) continue;
      result[key] = (result[key] ?? 0) + steps;
    }
  }

  if (Object.keys(result).length === 0) throw new Error("No step rows found in file.");
  return result;
}
