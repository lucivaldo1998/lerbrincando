'use client';

const KEY = 'lerbrincando.answers.v1';

export type Answers = Record<string, string | string[]>;

export function loadAnswers(): Answers {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveAnswer(field: string, value: string | string[]) {
  if (typeof window === 'undefined') return;
  const a = loadAnswers();
  a[field] = value;
  localStorage.setItem(KEY, JSON.stringify(a));
}

export function clearAnswers() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}

export function captureUtms() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'sck'];
  const captured: Record<string, string> = {};
  let any = false;
  keys.forEach((k) => {
    const v = params.get(k);
    if (v) {
      captured[k] = v;
      any = true;
    }
  });
  if (any) {
    try {
      localStorage.setItem('lerbrincando.utm.v1', JSON.stringify({ ...captured, capturedAt: Date.now() }));
    } catch {}
  }
}

export function getUtms(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem('lerbrincando.utm.v1') || '{}');
  } catch {
    return {};
  }
}
