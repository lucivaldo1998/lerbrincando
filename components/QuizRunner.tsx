'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { steps, type QuizStep, media, nextStepSlug } from '@/lib/quiz-config';
import { loadAnswers, saveAnswer, captureUtms } from '@/lib/answers';
import { Progress } from './Progress';

const mediaArr = [
  media.kid1, media.brain, media.chart, media.social1, media.social2, media.social3, media.social4,
  media.feedback, media.kid2, media.kid3, media.gabriele, media.trophy,
];

export function QuizRunner({ slug }: { slug: string }) {
  const router = useRouter();
  const step = useMemo(() => steps.find((s) => s.slug === slug), [slug]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loadingPct, setLoadingPct] = useState(0);

  useEffect(() => {
    captureUtms();
    setSelected([]);
    setLoadingPct(0);
  }, [slug]);

  useEffect(() => {
    if (!step || step.kind !== 'loading') return;
    const start = Date.now();
    const tick = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / step.durationMs) * 100);
      setLoadingPct(pct);
      if (pct >= 100) {
        clearInterval(tick);
        const next = nextStepSlug(step.slug);
        setTimeout(() => router.push(next ? `/quiz/${next}` : '/plano'), 400);
      }
    }, 80);
    return () => clearInterval(tick);
  }, [step, router]);

  if (!step) {
    return <p className="py-12 text-center text-brand-700">Etapa não encontrada.</p>;
  }

  function go(next: string | null) {
    router.push(next ? `/quiz/${next}` : '/plano');
  }

  function pickOption(value: string, fieldKey: string, multi?: boolean) {
    if (multi) {
      const newSel = selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value];
      setSelected(newSel);
      saveAnswer(fieldKey, newSel);
    } else {
      saveAnswer(fieldKey, value);
      setTimeout(() => go(nextStepSlug(step!.slug)), 220);
    }
  }

  // Pre-load saved choice on mount for multi-select
  useEffect(() => {
    if (step && step.kind === 'choice' && step.multi) {
      const a = loadAnswers()[step.fieldKey];
      if (Array.isArray(a)) setSelected(a);
    }
  }, [step]);

  return (
    <div className="animate-fade-up">
      {('progress' in step) && (
        <Progress value={step.progress} label={('phaseLabel' in step) ? step.phaseLabel : undefined} />
      )}

      {renderStep(step)}
    </div>
  );

  function renderStep(s: QuizStep) {
    switch (s.kind) {
      case 'choice':
        return (
          <div>
            <h1 className="font-display text-2xl font-extrabold leading-tight text-ink">{s.title}</h1>
            {s.subtitle && <p className="mt-2 whitespace-pre-line text-base text-ink/70">{s.subtitle}</p>}
            <div className="mt-6 space-y-3">
              {s.options.map((opt) => {
                const isSel = selected.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => pickOption(opt.value, s.fieldKey, s.multi)}
                    className={`btn-option ${isSel ? 'selected' : ''}`}
                  >
                    {opt.emoji && <span className="text-2xl">{opt.emoji}</span>}
                    <span className="flex-1">{opt.label}</span>
                    {s.multi && (
                      <span className={`grid h-6 w-6 place-items-center rounded-md border-2 ${isSel ? 'border-brand-500 bg-brand-500 text-white' : 'border-brand-200'}`}>
                        {isSel ? '✓' : ''}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {s.multi && (
              <button type="button" className="btn-primary mt-6" disabled={selected.length === 0} onClick={() => go(nextStepSlug(s.slug))}>
                Continuar →
              </button>
            )}
          </div>
        );

      case 'info': {
        const img = typeof s.imageIdx === 'number' ? mediaArr[s.imageIdx] : null;
        return (
          <div>
            <h1 className="font-display text-2xl font-extrabold leading-tight text-ink">{s.title}</h1>
            {s.subtitle && <p className="mt-2 text-base text-ink/70">{s.subtitle}</p>}
            {img && (
              <div className="my-5 overflow-hidden rounded-2xl bg-brand-50">
                <Image src={img} alt="" width={800} height={500} className="h-auto w-full" />
              </div>
            )}
            {s.bullets && (
              <ul className="mt-4 space-y-2.5">
                {s.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2 rounded-xl bg-brand-50 p-3 text-sm text-ink">
                    <span className="font-bold text-brand-600">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            <button type="button" className="btn-primary mt-6" onClick={() => go(nextStepSlug(s.slug))}>
              {s.cta} →
            </button>
          </div>
        );
      }

      case 'diagnosis':
        return (
          <div>
            {s.phaseLabel && <p className="mb-2 inline-block rounded-full bg-coral-500/10 px-3 py-1 text-xs font-bold text-coral-600">{s.phaseLabel}</p>}
            <h1 className="font-display text-2xl font-extrabold leading-tight text-ink">{s.title}</h1>
            {s.subtitle && <p className="mt-2 text-base text-ink/70">{s.subtitle}</p>}
            <div className="my-6 rounded-3xl border-2 border-coral-400 bg-coral-500/5 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-coral-600">Nível atual de leitura</p>
              <p className="mt-1 font-display text-5xl font-extrabold text-coral-600">{s.score}<span className="text-xl text-coral-400">/100</span></p>
              <div className="mt-4 progress-track !bg-coral-500/20">
                <div className="h-full rounded-full bg-coral-500" style={{ width: `${s.score}%` }} />
              </div>
              <div className="mt-1 flex justify-between text-[10px] font-semibold text-coral-600/80">
                <span>0</span><span>50</span><span>100</span>
              </div>
            </div>
            <p className="mb-3 font-display text-sm font-bold text-ink/70">Por que esse resultado?</p>
            <div className="space-y-3">
              {s.reasons.map((r, i) => (
                <div key={i} className="card !p-4">
                  <p className="font-bold text-ink">{r.title}</p>
                  <p className="mt-1 text-sm text-ink/70">{r.body}</p>
                </div>
              ))}
            </div>
            <button type="button" className="btn-primary mt-6 animate-pulse-soft" onClick={() => go(nextStepSlug(s.slug))}>
              {s.cta} →
            </button>
          </div>
        );

      case 'projection':
        return (
          <div>
            <h1 className="font-display text-2xl font-extrabold leading-tight text-ink">{s.title}</h1>
            {s.subtitle && <p className="mt-2 text-base text-ink/70">{s.subtitle}</p>}
            <div className="my-6 grid grid-cols-2 gap-3">
              <div className="card !p-4 text-center">
                <p className="text-xs font-bold uppercase text-coral-600">Hoje</p>
                <p className="mt-2 font-display text-4xl font-extrabold text-coral-600">{s.today}</p>
                <div className="mt-2 progress-track !bg-coral-500/20">
                  <div className="h-full rounded-full bg-coral-500" style={{ width: `${s.today}%` }} />
                </div>
              </div>
              <div className="card !border-brand-300 !p-4 text-center">
                <p className="text-xs font-bold uppercase text-brand-600">Em 30 dias</p>
                <p className="mt-2 font-display text-4xl font-extrabold text-brand-600">{s.future}</p>
                <div className="mt-2 progress-track">
                  <div className="progress-fill" style={{ width: `${s.future}%` }} />
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {s.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => pickOption(opt.value, s.fieldKey)}
                  className="btn-option"
                >
                  {opt.emoji && <span className="text-2xl">{opt.emoji}</span>}
                  <span className="flex-1">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'social': {
        const img = typeof s.imageIdx === 'number' ? mediaArr[s.imageIdx] : null;
        return (
          <div>
            {img && (
              <div className="mb-5 overflow-hidden rounded-3xl bg-brand-50">
                <Image src={img} alt="" width={800} height={600} className="h-auto w-full" />
              </div>
            )}
            <h1 className="font-display text-2xl font-extrabold leading-tight text-ink">{s.title}</h1>
            {s.subtitle && <p className="mt-2 text-base text-ink/70">{s.subtitle}</p>}
            <div className="mt-5 space-y-3">
              {s.options.map((opt) => (
                <button key={opt.value} type="button" onClick={() => pickOption(opt.value, s.fieldKey)} className="btn-option">
                  {opt.emoji && <span className="text-2xl">{opt.emoji}</span>}
                  <span className="flex-1">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      }

      case 'loading':
        return (
          <div className="py-10 text-center">
            <h1 className="font-display text-xl font-extrabold leading-tight text-ink">{s.title}</h1>
            {s.subtitle && <p className="mt-2 text-sm text-ink/70">{s.subtitle}</p>}
            <div className="mx-auto mt-8 max-w-xs">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${loadingPct}%` }} />
              </div>
              <p className="mt-2 font-display text-3xl font-extrabold text-brand-600">{Math.round(loadingPct)}%</p>
            </div>
            <div className="mx-auto mt-8 grid h-16 w-16 animate-pulse-soft place-items-center rounded-full bg-brand-100 text-3xl">📚</div>
          </div>
        );

      case 'plan-reveal':
        return (
          <div>
            <div className="mb-5 overflow-hidden rounded-3xl bg-brand-50">
              <Image src={media.plan} alt="Plano personalizado" width={800} height={500} className="h-auto w-full" />
            </div>
            <h1 className="font-display text-2xl font-extrabold leading-tight text-ink">{s.title}</h1>
            {s.subtitle && <p className="mt-2 text-base text-ink/70">{s.subtitle}</p>}
            <div className="mt-5 space-y-2">
              {s.weeks.map((w, i) => (
                <div key={i} className="flex items-start gap-3 rounded-2xl border border-brand-100 bg-white p-3">
                  <span className="rounded-lg bg-brand-500 px-2 py-1 text-xs font-bold text-white">{w.range}</span>
                  <span className="flex-1 text-sm text-ink">{w.title}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {s.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl bg-sun-500/10 p-2 text-xs font-semibold text-ink">
                  <span className="text-lg">{f.emoji}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
            <button type="button" className="btn-primary mt-6 animate-pulse-soft" onClick={() => router.push('/checkout')}>
              {s.cta} →
            </button>
          </div>
        );
    }
  }
}
