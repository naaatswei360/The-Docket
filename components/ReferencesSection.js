import React, { useState } from "react";

const TABS = {
  GUIDE: "guide",
  AI: "ai",
  GAMES: "games",
};

export default function ReferencesSection() {
  const [activeTab, setActiveTab] = useState(null);

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <h2 style={styles.title}>References</h2>
        <p style={styles.subtitle}>
          Learn, generate, and test OSCOLA citations with interactive tools.
        </p>

        {/* Cards row */}
        <div style={styles.cardRow}>
          <button
            style={{
              ...styles.card,
              ...(activeTab === TABS.GUIDE ? styles.cardActive : {}),
            }}
            onClick={() =>
              setActiveTab(activeTab === TABS.GUIDE ? null : TABS.GUIDE)
            }
          >
            <h3 style={styles.cardTitle}>Step-by-step reference guide</h3>
            <p style={styles.cardText}>
              Simulated PC interface with pop-ups that teach OSCOLA basics,
              let you craft a citation, and show marks and errors.
            </p>
          </button>

          <button
            style={{
              ...styles.card,
              ...(activeTab === TABS.AI ? styles.cardActive : {}),
            }}
            onClick={() =>
              setActiveTab(activeTab === TABS.AI ? null : TABS.AI)
            }
          >
            <h3 style={styles.cardTitle}>AI-powered citation builder</h3>
            <p style={styles.cardText}>
              Provide case, statute, or article details and get a structured
              OSCOLA citation. Fill in fields and we&apos;ll format it for you.
            </p>
          </button>

          <button
            style={{
              ...styles.card,
              ...(activeTab === TABS.GAMES ? styles.cardActive : {}),
            }}
            onClick={() =>
              setActiveTab(activeTab === TABS.GAMES ? null : TABS.GAMES)
            }
          >
            <h3 style={styles.cardTitle}>Games & quizzes</h3>
            <p style={styles.cardText}>
              Correct bad citations, spot errors, and survive a hostile court
              judge in a CLI-style OSCOLA quiz.
            </p>
          </button>
        </div>

        {/* Detail panel */}
        {activeTab && (
          <div style={styles.panel}>
            {activeTab === TABS.GUIDE && <GuidePanel />}
            {activeTab === TABS.AI && <AiPanel />}
            {activeTab === TABS.GAMES && <GamesPanel />}
          </div>
        )}
      </div>
    </section>
  );
}

function GuidePanel() {
  const [step, setStep] = useState(1);
  const [userCitation, setUserCitation] = useState("");
  const [feedback, setFeedback] = useState("");

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const checkCitation = () => {
    if (!userCitation.trim()) {
      setFeedback("Start by writing a full OSCOLA citation so I can mark it.");
      return;
    }
    // Placeholder: later we can add actual OSCOLA rule checks
    setFeedback(
      "Well done. This is a first draft. Check party names, neutral citation, court, and year ordering against OSCOLA."
    );
  };

  return (
    <div>
      <h3 style={styles.panelTitle}>Step-by-step OSCOLA guide</h3>
      <p style={styles.panelText}>
        This is a simple prototype of the simulated PC with pop-up guidance.
        We&apos;ll deepen the logic and visuals later.
      </p>

      <p style={styles.panelStep}>Step {step} of 4</p>

      {step === 1 && (
        <p style={styles.panelText}>
          Step 1: Identify the source type (case, statute, book, article). For
          now, focus on **cases** and note: party names, neutral citation, court
          and year.
        </p>
      )}
      {step === 2 && (
        <p style={styles.panelText}>
          Step 2: Arrange elements in OSCOLA order. For a case: <br />
          <em>Party names in italics, neutral citation, court, year</em>.
        </p>
      )}
      {step === 3 && (
        <p style={styles.panelText}>
          Step 3: Draft your citation in the box below. We&apos;ll give basic
          feedback and later add detailed marking and error explanations.
        </p>
      )}
      {step === 4 && (
        <p style={styles.panelText}>
          Step 4: Review feedback. In the full version, you&apos;ll see marks,
          error breakdowns, and a congratulatory message for strong citations.
        </p>
      )}

      <div style={styles.controlsRow}>
        <button
          style={styles.smallButton}
          onClick={prevStep}
          disabled={step === 1}
        >
          Previous
        </button>
        <button
          style={styles.smallButton}
          onClick={nextStep}
          disabled={step === 4}
        >
          Next
        </button>
      </div>

      <textarea
        style={styles.textarea}
        placeholder="Type your OSCOLA case citation here..."
        value={userCitation}
        onChange={(e) => setUserCitation(e.target.value)}
      />

      <button style={styles.primaryButton} onClick={checkCitation}>
        Check my citation
      </button>

      {feedback && <p style={styles.feedback}>{feedback}</p>}
    </div>
  );
}

function AiPanel() {
  const [type, setType] = useState("case");
  const [details, setDetails] = useState("");
  const [output, setOutput] = useState("");

  const buildCitation = () => {
    if (!details.trim()) {
      setOutput("Please provide details: party names, citation, court, year.");
      return;
    }

    // Placeholder logic: later we can integrate a real AI or rules engine
    if (type === "case") {
      setOutput(
        `Draft OSCOLA case citation based on your input:\n${details}\n\nCheck party names (italics), neutral citation, court and year ordering manually for now.`
      );
    } else if (type === "article") {
      setOutput(
        `Draft OSCOLA article citation based on your input:\n${details}\n\nEnsure author, article title in single quotes, journal name in italics, volume, issue, year and page range.`
      );
    } else {
      setOutput(
        `Draft OSCOLA statute/book citation based on your input:\n${details}\n\nConfirm title style, publisher, edition and year according to OSCOLA.`
      );
    }
  };

  return (
    <div>
      <h3 style={styles.panelTitle}>AI-powered citation builder (prototype)</h3>
      <p style={styles.panelText}>
        This is a non-AI prototype that structures your details. Later we can
        hook this into a real AI service.
      </p>

      <label style={styles.label}>
        Source type:
        <select
          style={styles.select}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="case">Case</option>
          <option value="article">Journal article</option>
          <option value="book">Book / statute</option>
        </select>
      </label>

      <textarea
        style={styles.textarea}
        placeholder="Paste or type the raw details (e.g. party names, neutral citation, court, year, or article metadata)..."
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />

      <button style={styles.primaryButton} onClick={buildCitation}>
        Build draft OSCOLA citation
      </button>

      {output && (
        <pre style={styles.output}>
          {output}
        </pre>
      )}
    </div>
  );
}

function GamesPanel() {
  const [mode, setMode] = useState("correct");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [hp, setHp] = useState(3); // health points for hostile judge mode

  const questions = {
    correct: [
      {
        prompt:
          "Unstructured info: Supreme Court of Ghana, Republic v Mensah, [2020] GHASC 12. Write a proper OSCOLA-style citation.",
        sampleAnswer:
          "Republic v Mensah [2020] GHASC 12 (SC)",
      },
    ],
    spot: [
      {
        prompt:
          "Citation: Republic v Mensah (2020) 12 GHASC. Spot the error in OSCOLA terms.",
        sampleAnswer:
          "Neutral citation should be in square brackets and correctly ordered, e.g. [2020] GHASC 12.",
      },
    ],
    hostile: [
      {
        prompt:
          "Bad citation: R v Mensah [2020] GHASC 12 (SC) Ghana. Choose the best correction.",
        options: [
          "R v Mensah [2020] GHASC 12 (SC)",
          "Republic v Mensah (2020) GHASC 12 (SC)",
          "R v Mensah GHASC 12 [2020] (SC)",
        ],
        correctIndex: 0,
        ruleNote:
          "Use the formal party name as used in Ghana (Republic v Mensah), and neutral citation in square brackets before the court.",
      },
    ],
  };

  const current =
    mode === "correct"
      ? questions.correct[questionIndex]
      : mode === "spot"
      ? questions.spot[questionIndex]
      : questions.hostile[questionIndex];

  const submitFreeAnswer = () => {
    if (!answer.trim()) {
      setFeedback("Write your best OSCOLA answer, then I’ll show a model answer.");
      return;
    }
    setFeedback(
      `Your attempt: ${answer}\n\nModel answer:\n${current.sampleAnswer}`
    );
  };

  const submitHostileChoice = (index) => {
    if (index === current.correctIndex) {
      setFeedback(
        `Correct. Judge (grudgingly): 'You may proceed, counsel.'\n\nRule note: ${current.ruleNote}`
      );
    } else {
      const newHp = hp - 1;
      setHp(newHp);
      setFeedback(
        `Wrong. Judge: 'Counsel, that citation is unacceptable.'\n\nRule note: ${current.ruleNote}\n\nHealth points remaining: ${newHp}`
      );
    }
  };

  return (
    <div>
      <h3 style={styles.panelTitle}>OSCOLA citation games</h3>
      <p style={styles.panelText}>
        Prototype of three games: free-answer correction, spot-the-error, and a
        hostile judge survival quiz.
      </p>

      <div style={styles.controlsRow}>
        <button
          style={{
            ...styles.smallButton,
            ...(mode === "correct" ? styles.cardActive : {}),
          }}
          onClick={() => {
            setMode("correct");
            setFeedback("");
            setAnswer("");
          }}
        >
          Correct the citation
        </button>
        <button
          style={{
            ...styles.smallButton,
            ...(mode === "spot" ? styles.cardActive : {}),
          }}
          onClick={() => {
            setMode("spot");
            setFeedback("");
            setAnswer("");
          }}
        >
          Spot the error
        </button>
        <button
          style={{
            ...styles.smallButton,
            ...(mode === "hostile" ? styles.cardActive : {}),
          }}
          onClick={() => {
            setMode("hostile");
            setFeedback("");
            setHp(3);
          }}
        >
          Hostile judge quiz
        </button>
      </div>

      <div style={styles.gameBox}>
        <p style={styles.panelText}>
          <strong>Question:</strong> {current.prompt}
        </p>

        {mode === "hostile" ? (
          <>
            <p style={styles.hpText}>Health points: {hp}</p>
            <div>
              {current.options.map((opt, idx) => (
                <button
                  key={idx}
                  style={styles.optionButton}
                  onClick={() => submitHostileChoice(idx)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <textarea
              style={styles.textarea}
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <button style={styles.primaryButton} onClick={submitFreeAnswer}>
              Submit answer
            </button>
          </>
        )}

        {feedback && (
          <pre style={styles.output}>
            {feedback}
          </pre>
        )}
      </div>
    </div>
  );
}

const styles = {
  section: {
    padding: "3rem 1rem",
    backgroundColor: "#0B1120",
    color: "#E5E7EB",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "0.5rem",
    color: "#F9FAFB",
  },
  subtitle: {
    fontSize: "0.95rem",
    marginBottom: "2rem",
    color: "#9CA3AF",
  },
  cardRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  card: {
    borderRadius: "0.75rem",
    border: "1px solid #1F2937",
    backgroundColor: "#111827",
    padding: "1rem",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s ease",
  },
  cardActive: {
    borderColor: "#F97316",
    boxShadow: "0 0 0 1px #F97316",
  },
  cardTitle: {
    fontSize: "1.1rem",
    marginBottom: "0.5rem",
    color: "#F9FAFB",
  },
  cardText: {
    fontSize: "0.9rem",
    color: "#9CA3AF",
  },
  panel: {
    marginTop: "1.5rem",
    padding: "1.5rem",
    borderRadius: "0.75rem",
    border: "1px solid #1F2937",
    backgroundColor: "#020617",
  },
  panelTitle: {
    fontSize: "1.2rem",
    marginBottom: "0.75rem",
    color: "#F9FAFB",
  },
  panelText: {
    fontSize: "0.9rem",
    color: "#D1D5DB",
    whiteSpace: "pre-wrap",
  },
  panelStep: {
    fontSize: "0.85rem",
    marginBottom: "0.75rem",
    color: "#F97316",
  },
  controlsRow: {
    display: "flex",
    gap: "0.75rem",
    margin: "0.75rem 0",
    flexWrap: "wrap",
  },
  smallButton: {
    fontSize: "0.8rem",
    padding: "0.4rem 0.8rem",
    borderRadius: "999px",
    border: "1px solid #374151",
    backgroundColor: "#111827",
    color: "#E5E7EB",
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    minHeight: "90px",
    marginTop: "0.75rem",
    marginBottom: "0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #374151",
    padding: "0.5rem",
    backgroundColor: "#020617",
    color: "#E5E7EB",
    fontSize: "0.85rem",
    resize: "vertical",
  },
  primaryButton: {
    padding: "0.5rem 1rem",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "#F97316",
    color: "#111827",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "0.75rem",
  },
  feedback: {
    fontSize: "0.85rem",
    color: "#FCD34D",
  },
  output: {
    marginTop: "0.75rem",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    backgroundColor: "#030712",
    color: "#D1D5DB",
    fontSize: "0.85rem",
    whiteSpace: "pre-wrap",
  },
  label: {
    display: "block",
    fontSize: "0.85rem",
    marginBottom: "0.5rem",
    color: "#D1D5DB",
  },
  select: {
    marginLeft: "0.5rem",
    backgroundColor: "#020617",
    color: "#E5E7EB",
    borderRadius: "0.25rem",
    border: "1px solid #374151",
    padding: "0.25rem 0.5rem",
    fontSize: "0.85rem",
  },
  gameBox: {
    marginTop: "1rem",
    borderRadius: "0.75rem",