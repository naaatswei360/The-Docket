'use client';

import { useState } from 'react';

export default function ReferencesSection() {
  const [active, setActive] = useState('guide');

  return (
    <section className="mx-auto mt-10 max-w-4xl px-2">
      <div className="rounded-2xl border border-white/10 bg-docket-navy/80 p-6 backdrop-blur-sm shadow-xl">
        <div className="mb-6 text-center">
          <p className="mb-1 text-xs uppercase tracking-[0.3em] text-docket-gold/80">
            References
          </p>
          <h2 className="text-2xl font-semibold text-white">
            Learn, build and test OSCOLA citations
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Choose a guided path, use a structured builder, or challenge yourself with citation games.
          </p>
        </div>

        {/* Three boxes */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <button
            onClick={() => setActive('guide')}
            className={`rounded-xl border bg-docket-navy/70 p-4 text-left backdrop-blur-sm transition ${
              active === 'guide'
                ? 'border-docket-gold shadow-lg'
                : 'border-white/10 hover:border-docket-gold/60'
            }`}
          >
            <div className="mb-2 text-2xl">🖥️</div>
            <h3 className="mb-1 text-sm font-semibold text-white">
              Step-by-step guide
            </h3>
            <p className="text-xs text-gray-300">
              Simulated PC-style pop-ups that teach OSCOLA from basics to full citations, with marks and error feedback.
            </p>
          </button>

          <button
            onClick={() => setActive('ai')}
            className={`rounded-xl border bg-docket-navy/70 p-4 text-left backdrop-blur-sm transition ${
              active === 'ai'
                ? 'border-docket-gold shadow-lg'
                : 'border-white/10 hover:border-docket-gold/60'
            }`}
          >
            <div className="mb-2 text-2xl">✨</div>
            <h3 className="mb-1 text-sm font-semibold text-white">
              AI-powered builder
            </h3>
            <p className="text-xs text-gray-300">
              Provide case, statute, book or article details and get a structured OSCOLA-style draft citation.
            </p>
          </button>

          <button
            onClick={() => setActive('games')}
            className={`rounded-xl border bg-docket-navy/70 p-4 text-left backdrop-blur-sm transition ${
              active === 'games'
                ? 'border-docket-gold shadow-lg'
                : 'border-white/10 hover:border-docket-gold/60'
            }`}
          >
            <div className="mb-2 text-2xl">🎮</div>
            <h3 className="mb-1 text-sm font-semibold text-white">
              Games
            </h3>
            <p className="text-xs text-gray-300">
              Correct citations, spot errors, and survive a hostile court judge in a quiz with health points.
            </p>
          </button>
        </div>

        {/* Detail panel */}
        <div className="rounded-xl border border-white/10 bg-docket-navy/70 p-4 text-sm text-gray-200 backdrop-blur-sm">
          {active === 'guide' && <GuidePanel />}
          {active === 'ai' && <AiPanel />}
          {active === 'games' && <GamesPanel />}
        </div>
      </div>
    </section>
  );
}

function GuidePanel() {
  const [step, setStep] = useState(1);
  const [citation, setCitation] = useState('');
  const [feedback, setFeedback] = useState('');

  const checkCitation = () => {
    if (!citation.trim()) {
      setFeedback('Start by drafting a full citation so I can mark it.');
      return;
    }

    // Very simple placeholder feedback – later we can add real OSCOLA checks
    const hints = [];
    if (!citation.includes('[') || !citation.includes(']')) {
      hints.push('Add a neutral citation in square brackets (e.g. [2020]).');
    }
    if (!citation.toLowerCase().includes('v')) {
      hints.push("Include 'v' between party names for a case (e.g. Republic v Mensah).");

    }

    if (hints.length === 0) {
      setFeedback('Strong first attempt. Check punctuation and ordering against OSCOLA to refine.');
    } else {
      setFeedback(`Feedback:\n- ${hints.join('\n- ')}`);
    }
  };

  return (
    <div>
      <h3 className="mb-2 text-base font-semibold text-white">
        Step-by-step OSCOLA guide
      </h3>
      <p className="mb-3 text-xs text-gray-300">
        This simulates a tutor on your screen: follow the steps, draft, then get quick feedback, marks and error notes.
      </p>

      <div className="mb-2 flex gap-2 text-xs">
        <button
          onClick={() => setStep(1)}
          className={`rounded-full border px-3 py-1 ${
            step === 1
              ? 'border-docket-gold bg-docket-gold/10 text-docket-gold'
              : 'border-white/20 text-gray-200'
          }`}
        >
          1. Basics
        </button>
        <button
          onClick={() => setStep(2)}
          className={`rounded-full border px-3 py-1 ${
            step === 2
              ? 'border-docket-gold bg-docket-gold/10 text-docket-gold'
              : 'border-white/20 text-gray-200'
          }`}
        >
          2. Pattern
        </button>
        <button
          onClick={() => setStep(3)}
          className={`rounded-full border px-3 py-1 ${
            step === 3
              ? 'border-docket-gold bg-docket-gold/10 text-docket-gold'
              : 'border-white/20 text-gray-200'
          }`}
        >
          3. Draft
        </button>
      </div>

      <div className="mb-3 rounded-lg border border-white/15 bg-black/30 p-3 text-xs text-gray-200">
        {step === 1 && (
          <p>
            Step 1: Decide what you are citing (case, statute, article, book). Focus on cases for now.
          </p>
        )}
        {step === 2 && (
          <p>
            Step 2: For a case, think: party names, neutral citation, court, year. OSCOLA cares about order and brackets.
          </p>
        )}
        {step === 3 && (
          <p>
            Step 3: Draft your citation below as if you were submitting to a moot judge.
          </p>
        )}
      </div>

      <textarea
        className="mb-2 w-full rounded-lg border border-white/15 bg-black/40 p-2 text-xs text-gray-100"
        rows={3}
        placeholder="Type your OSCOLA case citation here..."
        value={citation}
        onChange={(e) => setCitation(e.target.value)}
      />

      <button
        onClick={checkCitation}
        className="rounded-full bg-docket-gold px-4 py-2 text-xs font-semibold text-docket-navy hover:bg-docket-gold2"
      >
        Mark my citation
      </button>

      {feedback && (
        <pre className="mt-2 whitespace-pre-wrap rounded-md bg-black/40 p-2 text-xs text-gray-100">
          {feedback}
        </pre>
      )}
    </div>
  );
}

function AiPanel() {
  const [type, setType] = useState('case');
  const [details, setDetails] = useState('');
  const [output, setOutput] = useState('');

  const buildCitation = () => {
    if (!details.trim()) {
      setOutput('Add the source details first so I can structure them.');
      return;
    }

    if (type === 'case') {
      setOutput(
        `Draft OSCOLA case citation based on your input:\n${details}\n\nPattern: Party v Party [year] report court.`
      );
    } else if (type === 'article') {
      setOutput(
        `Draft OSCOLA article citation based on your input:\n${details}\n\nPattern: Author, 'Title' (year) volume journal page.`
      );
    } else {
      setOutput(
        `Draft OSCOLA source citation based on your input:\n${details}\n\nPattern depends on whether this is a book, statute or report.`
      );
    }
  };

  return (
    <div>
      <h3 className="mb-2 text-base font-semibold text-white">
        AI-powered citation builder (prototype)
      </h3>
      <p className="mb-3 text-xs text-gray-300">
        Eventually this will be fully AI-powered. For now, it structures your details into a clear OSCOLA pattern.
      </p>

      <div className="mb-2 flex items-center gap-2 text-xs">
        <span className="text-gray-300">Source type:</span>
        <select
          className="rounded-lg border border-white/20 bg-black/40 px-2 py-1 text-xs text-gray-100"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="case">Case</option>
          <option value="article">Article</option>
          <option value="book">Book / statute</option>
        </select>
      </div>

      <textarea
        className="mb-2 w-full rounded-lg border border-white/15 bg-black/40 p-2 text-xs text-gray-100"
        rows={3}
        placeholder="Paste or type the raw details (party names, citation, journal metadata, etc.)..."
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />

      <button
        onClick={buildCitation}
        className="rounded-full bg-docket-gold px-4 py-2 text-xs font-semibold text-docket-navy hover:bg-docket-gold2"
      >
        Build draft OSCOLA citation
      </button>

      {output && (
        <pre className="mt-2 whitespace-pre-wrap rounded-md bg-black/40 p-2 text-xs text-gray-100">
          {output}
        </pre>
      )}
    </div>
  );
}

function GamesPanel() {
  const [mode, setMode] = useState('write');
  const [hp, setHp] = useState(3);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const quizPrompt =
    'Write a proper OSCOLA-style citation for: Republic v Mensah, [2020] GHASC 12.';
  const quizModel = 'Republic v Mensah [2020] GHASC 12 (SC)';
  const errorPrompt =
    'Spot the error in: Republic v Mensah (2020) 12 GHASC.';
  const errorModel =
    'Neutral citations use square brackets and correct ordering, e.g. [2020] GHASC 12.';

  const hostileOptions = [
    'Republic v Mensah [2020] GHASC 12 (SC)',
    'Republic v Mensah (2020) GHASC 12',
    'Mensah v Republic [2020] SC GHASC',
  ];

  const handleSubmitWrite = () => {
    if (!answer.trim()) {
      setFeedback('Write your answer first.');
      return;
    }
    setFeedback(`Your answer:\n${answer}\n\nModel answer:\n${quizModel}`);
  };

  const handleSubmitError = () => {
    if (!answer.trim()) {
      setFeedback('Describe what you think the error is.');
      return;
    }
    setFeedback(`Your answer:\n${answer}\n\nKey idea:\n${errorModel}`);
  };

  const chooseHostile = (index) => {
    if (index === 0) {
      setFeedback(
        "Correct. The judge (reluctantly) lets you continue. You've survived this round."
      );
    } else {
      const newHp = hp - 1;
      setHp(newHp);
      setFeedback(
        `Wrong. The judge is unimpressed. Health points remaining: ${newHp}.`
      );
    }
  };

  return (
    <div>
      <h3 className="mb-2 text-base font-semibold text-white">
        Citation games
      </h3>
      <p className="mb-3 text-xs text-gray-300">
        Three mini-games: write the correct citation, spot the error, and a hostile judge quiz with health points.
      </p>

      <div className="mb-3 flex gap-2 text-xs">
        <button
          onClick={() => {
            setMode('write');
            setFeedback('');
            setAnswer('');
          }}
          className={`rounded-full border px-3 py-1 ${
            mode === 'write'
              ? 'border-docket-gold bg-docket-gold/10 text-docket-gold'
              : 'border-white/20 text-gray-200'
          }`}
        >
          Write the citation
        </button>
        <button
          onClick={() => {
            setMode('error');
            setFeedback('');
            setAnswer('');
          }}
          className={`rounded-full border px-3 py-1 ${
            mode === 'error'
              ? 'border-docket-gold bg-docket-gold/10 text-docket-gold'
              : 'border-white/20 text-gray-200'
          }`}
        >
          Spot the error
        </button>
        <button
          onClick={() => {
            setMode('hostile');
            setFeedback('');
          }}
          className={`rounded-full border px-3 py-1 ${
            mode === 'hostile'
              ? 'border-docket-gold bg-docket-gold/10 text-docket-gold'
              : 'border-white/20 text-gray-200'
          }`}
        >
          Hostile judge quiz
        </button>
      </div>

      {mode === 'write' && (
        <>
          <div className="mb-2 rounded-lg border border-white/15 bg-black/30 p-2 text-xs text-gray-200">
            {quizPrompt}
          </div>
          <textarea
            className="mb-2 w-full rounded-lg border border-white/15 bg-black/40 p-2 text-xs text-gray-100"
            rows={3}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button
            onClick={handleSubmitWrite}
            className="rounded-full bg-docket-gold px-4 py-2 text-xs font-semibold text-docket-navy hover:bg-docket-gold2"
          >
            Submit
          </button>
        </>
      )}

      {mode === 'error' && (
        <>
          <div className="mb-2 rounded-lg border border-white/15 bg-black/30 p-2 text-xs text-gray-200">
            {errorPrompt}
          </div>
          <textarea
            className="mb-2 w-full rounded-lg border border-white/15 bg-black/40 p-2 text-xs text-gray-100"
            rows={3}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button
            onClick={handleSubmitError}
            className="rounded-full bg-docket-gold px-4 py-2 text-xs font-semibold text-docket-navy hover:bg-docket-gold2"
          >
            Check
          </button>
        </>
      )}

      {mode === 'hostile' && (
        <>
          <p className="mb-2 text-xs text-gray-200">
            Health points: <span className="font-semibold">{hp}</span>
          </p>
          <div className="mb-2 grid gap-2 text-xs sm:grid-cols-3">
            {hostileOptions.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => chooseHostile(idx)}
                className="rounded-lg border border-white/20 bg-black/40 p-2 text-left text-gray-100 hover:border-docket-gold/70"
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}

      {feedback && (
        <pre className="mt-2 whitespace-pre-wrap rounded-md bg-black/40 p-2 text-xs text-gray-100">
          {feedback}
        </pre>
      )}
    </div>
  );
}