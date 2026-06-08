import { useEffect } from "react";
import BrandBar from "../components/BrandBar";
import { QUESTIONS } from "../data/questions";

interface Props {
  answers: Record<number, number>;
  currentQ: number;
  onAnswer: (qId: number, optIdx: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
}

export default function QuizPage({ answers, currentQ, onAnswer, onNext, onPrev, onFinish }: Props) {
  const total = QUESTIONS.length;
  const q = QUESTIONS[currentQ];
  const answered = Object.keys(answers).length;
  const pct = Math.round((answered / total) * 100);
  const selected = answers[q.id];
  const isLast = currentQ === total - 1;

  // 문제 바뀔 때마다 맨 위로
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentQ]);

  const handleSelect = (idx: number) => {
    onAnswer(q.id, idx);
  };

  const handleNext = () => {
    if (selected === undefined) return;
    if (isLast) {
      onFinish();
    } else {
      onNext();
    }
  };

  return (
    <div>
      <BrandBar currentStep={3} />

      {/* Progress */}
      <div className="progress-wrap">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-info">
        <span>진행률 {pct}%</span>
        <span>{answered} / {total} 완료</span>
      </div>

      {/* Question badge */}
      <div className="q-num-badge">Q {q.id} / {total}</div>

      {/* Question text */}
      <div className="q-text">{q.text}</div>

      {/* Options */}
      <div className="option-list">
        {q.options.map((opt, idx) => {
          const isSelected = selected === idx;
          return (
            <button
              key={idx}
              className={`option-btn${isSelected ? " selected" : ""}`}
              onClick={() => handleSelect(idx)}
            >
              <div className="option-radio">
                <div className="option-radio-inner" />
              </div>
              <div className="option-label">{opt.label}</div>
              <div style={{ flex: 1 }}>{opt.text}</div>
            </button>
          );
        })}
      </div>

      {/* Navigation — 이전 버튼은 왼쪽 하단, 다음/완료는 오른쪽 */}
      <div className="quiz-nav">
        <button
          className="btn btn-ghost"
          onClick={onPrev}
          disabled={currentQ === 0}
        >
          ← 이전
        </button>
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={selected === undefined}
        >
          {isLast ? "✅ 진단 완료" : "다음 →"}
        </button>
      </div>

      <footer className="footer">
        © 2025 일성아이에스 · AI-Talent Compass v3.2<br />
        본 진단 결과는 참고용이며 실제 인사 평가에 사용되지 않습니다.
      </footer>
    </div>
  );
}
