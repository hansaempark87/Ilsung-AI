interface Props {
  currentStep: 1 | 2 | 3 | 4;
}

const STEPS = [
  { num: "1", label: "소개" },
  { num: "2", label: "프로필" },
  { num: "3", label: "진단" },
  { num: "4", label: "결과" },
];

export default function BrandBar({ currentStep }: Props) {
  return (
    <>
      <div className="brand-bar">
        <div className="brand-name">⚡ AI-Talent Compass&nbsp;|&nbsp;일성아이에스</div>
        <div className="brand-tag">
          <span className="live-dot" />
          LIVE DIAGNOSTIC
        </div>
      </div>

      <div className="step-indicator">
        {STEPS.map((s, i) => {
          const num = i + 1;
          const isDone = num < currentStep;
          const isActive = num === currentStep;
          const circleClass = `step-circle${isDone ? " done" : isActive ? " active" : ""}`;
          const labelClass = `step-label${isActive ? " active" : ""}`;
          return (
            <div key={s.num} style={{ display: "contents" }}>
              <div className="step-node">
                <div className={circleClass}>{isDone ? "✓" : s.num}</div>
                <div className={labelClass}>{s.label}</div>
              </div>
              {num < STEPS.length && (
                <div className={`step-line${isDone ? " done" : ""}`} />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
