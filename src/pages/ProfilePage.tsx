// ProfilePage — 프로필 입력
import BrandBar from "../components/BrandBar";
import { MBTI_LIST, MBTI_HINTS } from "../data/questions";
import type { Profile } from "../types";
import { useScrollTop } from "../hooks/useScrollTop";

interface Props {
  profile: Profile;
  onProfileChange: (p: Profile) => void;
  onNext: () => void;
  onBack: () => void;
}

const ROLES = [
  { value: "팀원", label: "👤 팀원", desc: "실무 담당 · 개인 기여자" },
  { value: "관리자", label: "👥 관리자", desc: "팀·그룹 리딩 · 의사결정자" },
];
const AGE_OPTS = ["20대", "30대", "40대", "50대 이상"];
const EXP_OPTS = ["1년 미만", "1~3년", "3~7년", "7~15년", "15년 이상"];
const AI_OPTS = ["거의 안 씀", "가끔 (주 1~2회)", "자주 (주 3~4회)", "매일 필수"];
const STRENGTH_OPTS = [
  { value: "기획·분석", icon: "📊" },
  { value: "실행·운영", icon: "⚙️" },
  { value: "소통·조율", icon: "🤝" },
  { value: "창의·디자인", icon: "🎨" },
  { value: "기술·개발", icon: "💻" },
];

function SectionCard({ color, title, sub, children }: {
  color: string; title: string; sub?: string; children: React.ReactNode;
}) {
  return (
    <div className="pcard" style={{ borderTop: `3px solid ${color}` }}>
      <div className="pcard-header">
        <div className="pcard-dot" style={{ background: color }} />
        <div className="pcard-title" style={{ color }}>{title}</div>
      </div>
      {sub && <div className="pcard-sub">{sub}</div>}
      {children}
    </div>
  );
}

export default function ProfilePage({ profile, onProfileChange, onNext, onBack }: Props) {
  useScrollTop("profile");

  const set = (key: keyof Profile, val: string | null) =>
    onProfileChange({ ...profile, [key]: val });

  const toggle = (key: keyof Profile, val: string) =>
    set(key, profile[key] === val ? null : val);

  // filled chips
  const filled = [
    profile.mbti ? `MBTI: ${profile.mbti}` : null,
    profile.role ? `직책: ${profile.role}` : null,
    profile.age  ? `연령: ${profile.age}`  : null,
    profile.exp  ? `경력: ${profile.exp}`  : null,
    profile.aiFreq ? `AI활용: ${profile.aiFreq}` : null,
    profile.strength ? `강점: ${profile.strength}` : null,
  ].filter(Boolean) as string[];

  return (
    <div>
      <BrandBar currentStep={2} />

      {/* 헤더 카드 */}
      <div style={{
        background: "#1E1E1E", border: "1px solid #2C2C2E",
        borderTop: "3px solid #00E5FF", borderRadius: 14,
        padding: "16px 18px", marginBottom: 16,
      }}>
        <div style={{ fontSize: "1rem", fontWeight: 700, color: "#FFF", marginBottom: 4 }}>
          👤 나의 배경 정보 입력
        </div>
        <div style={{ fontSize: "0.82rem", color: "#AEAEB2", lineHeight: 1.65 }}>
          이 정보는 AI 컨설팅의 <strong style={{ color: "#F2F2F7" }}>정확도를 높이는 데만</strong> 사용됩니다.
          모든 항목은 선택사항입니다.
        </div>
      </div>

      {/* 1. MBTI */}
      <SectionCard color="#00E5FF" title="MBTI 유형"
        sub="본인의 MBTI를 선택하세요. AI가 성향과 점수의 연관성을 분석합니다.">
        <select
          className="custom-select"
          value={profile.mbti ?? ""}
          onChange={(e) => set("mbti", e.target.value || null)}
        >
          <option value="">선택 안 함</option>
          {MBTI_LIST.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        {profile.mbti && MBTI_HINTS[profile.mbti] && (
          <div className="mbti-hint">
            💡 <strong style={{ color: "#00E5FF" }}>{profile.mbti}</strong> — {MBTI_HINTS[profile.mbti]}
          </div>
        )}
      </SectionCard>

      {/* 2. 직책 */}
      <SectionCard color="#32D74B" title="직책 구분"
        sub="현재 조직에서의 역할을 선택하세요.">
        <div className="toggle-group-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {ROLES.map((r) => {
            const isActive = profile.role === r.value;
            return (
              <button
                key={r.value}
                className={`toggle-btn${isActive ? " active-green" : ""}`}
                onClick={() => toggle("role", r.value)}
              >
                <span className="toggle-indicator" />
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{r.label}</div>
                  <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>{r.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* 3. 연령대 */}
      <SectionCard color="#BF5AF2" title="연령대">
        <div className="toggle-group-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {AGE_OPTS.map((a) => {
            const isActive = profile.age === a;
            return (
              <button key={a} className={`toggle-btn${isActive ? " active-purple" : ""}`}
                onClick={() => toggle("age", a)}>
                <span className="toggle-indicator" />
                {a}
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* 4. 경력 */}
      <SectionCard color="#FF9F0A" title="업무 경력">
        <div className="toggle-group">
          {EXP_OPTS.map((e) => {
            const isActive = profile.exp === e;
            return (
              <button key={e} className={`toggle-btn${isActive ? " active-orange" : ""}`}
                onClick={() => toggle("exp", e)}>
                <span className="toggle-indicator" />
                {e}
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* 5. AI 활용 빈도 */}
      <SectionCard color="#00E5FF" title="AI 도구 활용 빈도"
        sub="ChatGPT, Gemini, Copilot 등 AI 도구를 업무에 얼마나 활용하시나요?">
        <div className="toggle-group">
          {AI_OPTS.map((a) => {
            const isActive = profile.aiFreq === a;
            return (
              <button key={a} className={`toggle-btn${isActive ? " active" : ""}`}
                onClick={() => toggle("aiFreq", a)}>
                <span className="toggle-indicator" />
                {a}
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* 6. 강점 분야 */}
      <SectionCard color="#FF6B35" title="강점 분야"
        sub="가장 자신 있는 업무 영역 하나를 선택하세요.">
        <div className="toggle-group">
          {STRENGTH_OPTS.map((s) => {
            const isActive = profile.strength === s.value;
            return (
              <button key={s.value} className={`toggle-btn${isActive ? " active-red" : ""}`}
                onClick={() => toggle("strength", s.value)}>
                <span className="toggle-indicator" />
                {s.icon} {s.value}
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* 입력 요약 */}
      {filled.length > 0 && (
        <div className="profile-preview">
          <div className="preview-title">✅ 입력된 정보</div>
          <div className="preview-chips">
            {filled.map((f) => <span key={f} className="preview-chip">{f}</span>)}
          </div>
        </div>
      )}

      <div style={{ height: 20 }} />

      <div className="nav-row">
        <button className="btn btn-ghost" onClick={onBack}>← 소개로</button>
        <button className="btn btn-primary" onClick={onNext}>⚡ 진단 시작하기 →</button>
      </div>

      <footer className="footer">
        © 2025 일성아이에스 · AI-Talent Compass v3.2<br />
        본 진단 결과는 참고용이며 실제 인사 평가에 사용되지 않습니다.
      </footer>
    </div>
  );
}
