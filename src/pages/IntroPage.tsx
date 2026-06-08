import BrandBar from "../components/BrandBar";
import { CATEGORY_INFO } from "../data/questions";
import { useScrollTop } from "../hooks/useScrollTop";

interface Props {
  onNext: () => void;
}

export default function IntroPage({ onNext }: Props) {
  useScrollTop("intro");

  return (
    <div>
      <BrandBar currentStep={1} />

      <div className="hero-eyebrow">AI ERA TALENT DIAGNOSTIC — v3.2</div>
      <h1 className="hero-h1">
        AI 시대, 당신은<br /><span>준비된 인재</span>입니까?
      </h1>

      <div className="intro-mission">
        <div className="intro-mission-title">🎯 이건 단순한 테스트가 아닙니다</div>
        <div className="intro-mission-body">
          AI가 업무의 절반을 바꾸는 지금, <strong>직급·연봉·스펙</strong>보다 더 중요한 것이 있습니다.<br />
          바로 <strong>'어떻게 생각하고, 판단하고, 행동하는가'</strong> — 당신의 <strong>사고 운영 체계</strong>입니다.<br /><br />
          이 진단은 <strong>AI 시대에 부합하는 인재로 성장하기 위한 출발점</strong>을 찾아드립니다.<br />
          20개의 실전 시나리오를 통해 당신의 실제 사고 패턴을 진단하고,<br />
          <strong>AI가 구체적인 성장 로드맵과 맞춤 학습 리소스를 제시</strong>합니다.
        </div>
      </div>

      <div className="kpi-grid">
        {[
          { val: "20", lbl: "실전 시나리오\n문항" },
          { val: "4",  lbl: "핵심 역량\n측정 축" },
          { val: "3",   lbl: "신뢰도 높은\n측정 기준" },
          { val: "AI", lbl: "맞춤형\n성장 컨설팅" },
        ].map((k) => (
          <div key={k.val} className="kpi-box">
            <div className="kpi-val">{k.val}</div>
            <div className="kpi-lbl" style={{ whiteSpace: "pre-line" }}>{k.lbl}</div>
          </div>
        ))}
      </div>

      <hr className="hr" />
      <div className="sec-title">📚 이 진단의 설계 근거</div>

      <div className="qc" style={{ borderLeftColor: "#00E5FF" }}>
        <div className="qc-src" style={{ color: "#00E5FF" }}>WEF — Future of Jobs Report 2025</div>
        <div className="qc-txt">"2030년까지 핵심 업무 역량의 <strong>39%가 재정의</strong>됩니다. 분석적 사고·변화 적응력·자기주도 학습이 1·2·3위 핵심 역량으로 부상합니다."</div>
        <div className="qc-basis">📌 이 진단의 <strong>변화민첩도</strong> 문항은 WEF 2025가 발표한 적응적 사고와 자기주도 학습 기준을 바탕으로 설계되었습니다.</div>
      </div>
      <div className="qc" style={{ borderLeftColor: "#BF5AF2" }}>
        <div className="qc-src" style={{ color: "#BF5AF2" }}>McKinsey — The State of AI 2026</div>
        <div className="qc-txt">"AI 시대의 핵심 인재는 AI를 쓰는 사람이 아니라, <strong>AI 결과물의 품질을 판단하고 재설계하는 사람</strong>입니다."</div>
        <div className="qc-basis">📌 이 진단의 <strong>판단정확도</strong> 문항은 McKinsey 2026이 정의한 비판적 데이터 해석력 역량 기준을 바탕으로 설계되었습니다.</div>
      </div>
      <div className="qc" style={{ borderLeftColor: "#32D74B" }}>
        <div className="qc-src" style={{ color: "#32D74B" }}>Jensen Huang — NVIDIA CEO, GTC 2025</div>
        <div className="qc-txt">"중요한 건 코딩이 아닙니다. <strong>AI에게 어떤 문제를 풀라고 명령하는가</strong>가 미래 인재를 가릅니다."</div>
        <div className="qc-basis">📌 이 진단의 <strong>문제설계력</strong> 문항은 Jensen Huang이 GTC 2025에서 강조한 문제 정의 능력과 AI 오케스트레이션 역량을 기준으로 설계되었습니다.</div>
      </div>

      <hr className="hr" />
      <div className="sec-title">🧭 진단이 측정하는 4가지 역량</div>
      <div className="fw-grid">
        {Object.entries(CATEGORY_INFO).map(([cat, info]) => (
          <div key={cat} className="fw-card" style={{ borderTopColor: info.color }}>
            <div className="fw-icon">{info.emoji}</div>
            <div className="fw-name" style={{ color: info.color }}>{cat}</div>
            <div className="fw-desc">{info.description}</div>
          </div>
        ))}
      </div>

      <div className="warn-box">
        <div className="warn-title">⚠️ 응시 전 확인사항</div>
        <div className="warn-body">
          • 소요 시간: 약 10~15분<br />
          • 직관적 판단으로 답하세요. 정답은 없습니다<br />
          • 솔직하게 답할수록 AI 분석이 정확해집니다<br />
          • 중간에 나가면 처음부터 다시 시작됩니다
        </div>
      </div>

      <button className="btn btn-primary" onClick={onNext}>
        ⚡ 지금 진단 시작하기 →
      </button>

      <footer className="footer">
        © 2025 일성아이에스 · AI-Talent Compass v3.2<br />
        Based on WEF 2025 · McKinsey 2026 · NVIDIA GTC 2025 Insights<br />
        본 진단 결과는 참고용이며 실제 인사 평가에 사용되지 않습니다.
      </footer>
    </div>
  );
}
