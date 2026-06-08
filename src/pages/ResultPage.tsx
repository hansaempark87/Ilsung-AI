import { useState, useCallback } from "react";
import BrandBar from "../components/BrandBar";
import {
  QUESTIONS, CATEGORY_INFO, calcScores, calcConsistency, getGrade, MBTI_HINTS
} from "../data/questions";
import type { Profile } from "../types";
import { useScrollTop } from "../hooks/useScrollTop";

interface Props {
  answers: Record<number, number>;
  profile: Profile;
  onRetry: () => void;
}

// ── AI API 호출 ──
async function fetchConsulting(
  scores: Record<string, number>,
  answers: Record<number, number>,
  consistency: number,
  profile: Profile
): Promise<string> {
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const { grade, label } = getGrade(total);

  const p = profile;
  const mbtiHint = p.mbti ? (MBTI_HINTS[p.mbti] ?? "") : "";
  const roleCtx = p.role === "관리자"
    ? "이 사람은 관리자이므로 팀 리딩·의사결정·조직 영향력 관점에서도 분석하세요."
    : p.role === "팀원"
    ? "이 사람은 팀원이므로 개인 성과·주도적 기여·성장 속도 관점에서 분석하세요."
    : "";

  const answerDetail = QUESTIONS.map((q) => {
    const idx = answers[q.id];
    if (idx === undefined) return null;
    const opt = q.options[idx];
    return `Q${q.id} [${q.category}] → ${opt.label} (${opt.score}점): ${opt.text.slice(0, 50)}...`;
  }).filter(Boolean).join("\n");

  const scoreTxt = Object.entries(scores).map(([cat, s]) => `- ${cat}: ${s}/20점`).join("\n");

  // 역량 순위 계산
  const sortedCats = Object.entries(scores).sort(([,a],[,b]) => b - a);
  const topCat = sortedCats[0][0];
  const bottomCat = sortedCats[sortedCats.length-1][0];
  const catGap = sortedCats[0][1] - sortedCats[sortedCats.length-1][1];
  const isBalanced = catGap <= 4;

  // 일관성 압박 쌍 응답 추출
  const pressureGap = (() => {
    const pairs: {pair: number; normal: number; pressure: number}[] = [];
    const pairMap: Record<number, {normal?: number; pressure?: number}> = {};
    for (const q of QUESTIONS) {
      if (q.pair_id && q.cross_val_pair) {
        if (!pairMap[q.pair_id]) pairMap[q.pair_id] = {};
        const idx = answers[q.id];
        if (idx !== undefined) {
          const s = q.options[idx].score;
          if (q.cross_val_pair === 'normal') pairMap[q.pair_id].normal = s;
          else pairMap[q.pair_id].pressure = s;
        }
      }
    }
    for (const [pid, r] of Object.entries(pairMap)) {
      if (r.normal !== undefined && r.pressure !== undefined)
        pairs.push({pair: Number(pid), normal: r.normal, pressure: r.pressure});
    }
    return pairs;
  })();
  const pressureTxt = pressureGap.map(p =>
    `세트${p.pair}: 일반상황 ${p.normal}점 → 압박상황 ${p.pressure}점 (낙폭: ${p.normal - p.pressure}점)`
  ).join("; ");

  const prompt = `당신은 Gallup StrengthsFinder, Hogan Assessment, NEO-PI-R을 결합한 수준의 전문 역량 진단 컨설턴트입니다.
한국어로만 답변하세요. 각 섹션마다 반드시 구체적인 문항 번호(Q번호)와 응답 내용을 직접 인용해 근거를 제시하세요.
아첨이나 위로 없이, 실제 커리어에 도움이 되는 직설적 분석을 제공하세요.
${roleCtx}

아래 형식을 반드시 그대로 지켜 작성하세요 (## 헤더 형식 유지).

## 🧬 프로필 기반 성향 분석
이 사람의 MBTI ${p.mbti ?? "미입력"}(${mbtiHint})와 역량 점수 패턴이 어떻게 맞물리는지 분석하세요.
- 직책(${p.role ?? "미입력"})·경력(${p.exp ?? "미입력"}) 맥락에서 이 점수 패턴이 갖는 의미
- AI 활용 빈도(${p.aiFreq ?? "미입력"})와 변화민첩도 점수의 상관관계 해석
- 자기 인식 강점(${p.strength ?? "미입력"})과 실제 측정 강점의 일치·불일치 여부
(각 포인트를 1~2문장으로 명확히 서술하세요)

## 🎯 당신의 핵심 경쟁력
가장 높은 역량(${topCat}, ${scores[topCat]}점)을 보여준 구체적 문항 응답을 2~3개 인용하세요.
이 역량이 현재 직장·업무에서 어떤 실질적 가치를 만드는지, 그리고 어떻게 더 날카롭게 만들 수 있는지 서술하세요.

## ⚠️ 지금 당신의 발목을 잡고 있는 것
가장 낮은 역량(${bottomCat}, ${scores[bottomCat]}점)과 이를 드러낸 문항 응답을 직접 지목하세요.
이 패턴이 업무에서 어떤 구체적 문제 상황으로 이어지는지 예시를 들어 현실적으로 지적하세요.
${isBalanced ? '(역량이 고르게 분산된 편입니다. 대신 전체 수준을 한 단계 끌어올릴 레버리지 포인트를 짚어주세요.)' : `(역량 편차 ${catGap}점: 이 불균형이 어떤 상황에서 리스크로 작동하는지 구체적으로 서술하세요.)`}
${consistency < 70 ? `⚠️ 응답 일관성 ${consistency.toFixed(0)}%: 압박 쌍 데이터(${pressureTxt})를 분석해 이 불일치가 갖는 의미를 해석하세요.` : ''}

## 🔍 숨겨진 패턴 진단
문항 응답 전체를 보고, 이 사람이 스스로 인식하지 못하는 행동 패턴 1~2가지를 찾아 지적하세요.
(예: 압박 상황에서의 회피 경향, 분석은 잘 하지만 실행으로 연결하지 못하는 패턴 등)
구체적인 문항 번호와 응답을 근거로 제시하세요.

## 📅 90일 성장 로드맵
지금 당장 시작해야 하는 것 우선순위로 작성하세요.
**Week 1~2 (즉시 실행):** 내일부터 할 수 있는 구체적 행동 2가지
**Week 3~4 (루틴 구축):** 습관으로 만들어야 할 것 1가지 + 측정 방법
**Month 2~3 (심화):** 역량 격차를 줄이기 위한 구조적 변화 1가지

## 📚 이 사람에게 딱 맞는 리소스
약점 역량(${bottomCat})과 이 사람의 프로필에 맞는 책 2권, 유튜브 2개를 추천하세요.
일반적인 자기계발서가 아닌, 이 사람의 구체적 상황에 필요한 것을 골라주세요.
형식: **[책]** 제목 — 저자 / 이유 / **[유튜브]** 채널명 — 영상/채널 설명 / 이유

---
[진단 데이터]
등급: ${grade} / ${label} | 총점: ${total}/80점 | 응답 일관성: ${consistency.toFixed(0)}%
역량 분포: ${sortedCats.map(([c,s])=>`${c} ${s}점`).join(' | ')}
압박 상황 일관성: ${pressureTxt || '데이터 없음'}

[프로필]
MBTI: ${p.mbti ?? "미입력"} | 직책: ${p.role ?? "미입력"} | 연령대: ${p.age ?? "미입력"} | 경력: ${p.exp ?? "미입력"} | AI 활용: ${p.aiFreq ?? "미입력"} | 강점: ${p.strength ?? "미입력"}

[역량별 점수]
${scoreTxt}

[문항별 응답 (전체)]
${answerDetail}`;

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("VITE_GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");

  const MAX_RETRIES = 3;
  const RETRY_DELAYS = [3000, 8000, 15000]; // 3초, 8초, 15초 지수 백오프

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    // 429 Rate Limit → 재시도
    if (res.status === 429 && attempt < MAX_RETRIES) {
      const delay = RETRY_DELAYS[attempt];
      await new Promise((r) => setTimeout(r, delay));
      continue;
    }

    if (!res.ok) {
      if (res.status === 429) {
        throw new Error("API 요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요. (429)");
      }
      throw new Error(`API 오류: ${res.status}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "분석 결과를 가져올 수 없습니다.";
  }

  throw new Error("API 요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요. (429)");
}

// ── 리소스 카드 파싱 ──
interface Resource { type: "book" | "youtube"; title: string; author: string; reason: string; searchUrl: string; }

function parseResources(text: string): Resource[] {
  const results: Resource[] = [];
  const bookRe = /\[책\]\s*([^—\n]+?)(?:\s*—\s*([^/\n]+?))?(?:\s*\/\s*([^/\n\*\[]+))/gi;
  const ytRe = /\[유튜브\]\s*([^—\n]+?)(?:\s*—\s*([^/\n]+?))?(?:\s*\/\s*([^/\n\*\[]+))/gi;
  let m;
  while ((m = bookRe.exec(text)) !== null) {
    const title = m[1]?.trim() ?? "";
    const author = m[2]?.trim() ?? "";
    const reason = m[3]?.trim() ?? "";
    if (title) results.push({
      type: "book", title, author, reason,
      searchUrl: `https://search.naver.com/search.naver?query=${encodeURIComponent(title + " 책")}`,
    });
  }
  while ((m = ytRe.exec(text)) !== null) {
    const title = m[1]?.trim() ?? "";
    const author = m[2]?.trim() ?? "";
    const reason = m[3]?.trim() ?? "";
    if (title) results.push({
      type: "youtube", title, author, reason,
      searchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(title)}`,
    });
  }
  return results;
}

// ── 섹션 파싱 ──
function parseSections(text: string) {
  const sections: { heading: string; body: string }[] = [];
  const re = /^##\s+(.+)$/gm;
  const matches: { index: number; heading: string }[] = [];
  let m;
  while ((m = re.exec(text)) !== null) matches.push({ index: m.index, heading: m[1].trim() });
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i].heading.length + 3;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    sections.push({ heading: matches[i].heading, body: text.slice(start, end).trim() });
  }
  return sections;
}

// ── 단순 Markdown → JSX ──
function SimpleMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="md-content">
      {lines.map((line, i) => {
        if (!line.trim()) return <br key={i} />;
        // bold
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
          p.startsWith("**") && p.endsWith("**")
            ? <strong key={j}>{p.slice(2, -2)}</strong>
            : <span key={j}>{p}</span>
        );
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return <li key={i} style={{ listStyle: "disc", marginLeft: 16, marginBottom: 4 }}>{parts}</li>;
        }
        if (/^Week\s*\d/.test(line)) {
          return <p key={i} style={{ marginBottom: 8, fontWeight: 600, color: "#E5E5EA" }}>{parts}</p>;
        }
        return <p key={i} style={{ marginBottom: 8 }}>{parts}</p>;
      })}
    </div>
  );
}

// ── 레이더 차트 (SVG) ──
function RadarChart({ scores }: { scores: Record<string, number> }) {
  const cats = Object.keys(CATEGORY_INFO);
  const colors = cats.map((c) => CATEGORY_INFO[c].color);
  const n = cats.length;
  const cx = 130, cy = 130, r = 100;
  const angles = cats.map((_, i) => (Math.PI * 2 * i) / n - Math.PI / 2);

  const toPoint = (val: number, maxVal: number, angle: number) => {
    const ratio = val / maxVal;
    return {
      x: cx + r * ratio * Math.cos(angle),
      y: cy + r * ratio * Math.sin(angle),
    };
  };

  const gridLevels = [5, 10, 15, 20];
  const userPts = cats.map((c, i) => toPoint(scores[c] ?? 0, 20, angles[i]));
  const refPts  = [15, 14.5, 15, 14.5].map((v, i) => toPoint(v, 20, angles[i]));
  const toSvgPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";

  return (
    <svg viewBox="0 0 260 290" style={{ width: "100%", maxWidth: 300, margin: "0 auto", display: "block" }}>
      {/* Grid circles */}
      {gridLevels.map((lv) => (
        <polygon key={lv}
          points={angles.map((a) => {
            const p = toPoint(lv, 20, a);
            return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
          }).join(" ")}
          fill="none" stroke="#2C2C2E" strokeWidth="1" />
      ))}
      {/* Axes */}
      {angles.map((a, i) => {
        const p = toPoint(20, 20, a);
        return <line key={i} x1={cx} y1={cy} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke="#2C2C2E" strokeWidth="1" />;
      })}
      {/* Reference area */}
      <path d={toSvgPath(refPts)} fill="rgba(255,159,10,0.06)" stroke="rgba(255,159,10,0.5)" strokeWidth="1.5" strokeDasharray="4,3" />
      {/* User area */}
      <path d={toSvgPath(userPts)} fill="rgba(0,229,255,0.12)" stroke="#00E5FF" strokeWidth="2.5" />
      {/* User dots */}
      {userPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="5" fill={colors[i]} stroke="#121212" strokeWidth="2" />
      ))}
      {/* Labels */}
      {cats.map((cat, i) => {
        const p = toPoint(22, 20, angles[i]);
        const info = CATEGORY_INFO[cat];
        return (
          <text key={i} x={p.x} y={p.y}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="10" fill="rgba(255,255,255,0.7)" fontFamily="Inter, sans-serif">
            {info.emoji} {cat}
          </text>
        );
      })}
      {/* Legend */}
      <g transform="translate(30,268)">
        <rect x={0} y={0} width={10} height={10} fill="rgba(0,229,255,0.3)" stroke="#00E5FF" strokeWidth="1.5" rx="2" />
        <text x={14} y={9} fontSize="9" fill="rgba(255,255,255,0.5)" fontFamily="Inter, sans-serif">내 점수</text>
        <rect x={80} y={0} width={10} height={10} fill="rgba(255,159,10,0.1)" stroke="rgba(255,159,10,0.5)" strokeWidth="1.5" rx="2" />
        <text x={94} y={9} fontSize="9" fill="rgba(255,255,255,0.5)" fontFamily="Inter, sans-serif">상위 20% 기준</text>
      </g>
    </svg>
  );
}

export default function ResultPage({ answers, profile, onRetry }: Props) {
  useScrollTop("result");

  const scores = calcScores(answers);
  const total  = Object.values(scores).reduce((a, b) => a + b, 0);
  const { grade, label, color: gradeColor } = getGrade(total);
  const { consistency } = calcConsistency(answers);

  const [consulting, setConsulting] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("AI가 분석 중입니다...");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [aiRequested, setAiRequested] = useState(false); // 버튼 클릭 여부

  const loadConsulting = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLoadingMsg("AI가 분석 중입니다...");
    const msgTimer = setTimeout(() => setLoadingMsg("잠시만 기다려 주세요. API 요청 중..."), 5000);
    const msgTimer2 = setTimeout(() => setLoadingMsg("응답이 지연되고 있습니다. 조금만 더 기다려 주세요..."), 12000);
    try {
      const text = await fetchConsulting(scores, answers, consistency, profile);
      setConsulting(text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      clearTimeout(msgTimer);
      clearTimeout(msgTimer2);
      setLoading(false);
    }
  }, []);

  const handleRequestAI = () => {
    setAiRequested(true);
    loadConsulting();
  };

  const handleCopy = () => {
    const url = "https://ilsung-ai.pages.dev";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } else {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // 리소스 섹션 파싱
  const resources = consulting ? parseResources(consulting) : [];
  const sections = consulting ? parseSections(consulting) : [];
  const nonResourceSections = sections.filter((s) => !s.heading.includes("추천 리소스") && !s.heading.includes("이 사람에게 딱"));
  const resourceSection = sections.find((s) => s.heading.includes("추천 리소스") || s.heading.includes("이 사람에게 딱"));

  // 역량 백분위 (상위 20% 기준: 15점)
  const catPercentile = (s: number) => {
    if (s >= 18) return { txt: "상위 5%", color: "#32D74B" };
    if (s >= 15) return { txt: "상위 20%", color: "#00E5FF" };
    if (s >= 12) return { txt: "상위 40%", color: "#BF5AF2" };
    if (s >= 9)  return { txt: "상위 60%", color: "#FF9F0A" };
    return           { txt: "하위 40%", color: "#FF453A" };
  };

  // 등급별 인사이트 메시지
  const gradeInsight: Record<string, { headline: string; sub: string; tip: string }> = {
    S:  { headline: "당신은 AI 시대가 원하는 인재 유형입니다.", sub: "문제를 설계하고, 데이터를 비판적으로 다루며, 변화를 주도하는 역량이 복합적으로 높습니다.", tip: "지금 가진 역량을 조직 전체로 확장하는 데 집중하세요." },
    "A+": { headline: "실행력과 전략 사이에 서 있는 인재입니다.", sub: "핵심 역량은 충분히 갖췄습니다. 가장 낮은 역량 하나를 집중 개발하면 S 등급에 닿을 수 있습니다.", tip: "약점 역량 1개에 90일 집중 투자를 권장합니다." },
    A:  { headline: "성장 잠재력이 높은 준비된 인재입니다.", sub: "고른 역량을 갖추고 있으나, 압박 상황에서의 실행력 차이가 등급을 가릅니다.", tip: "압박 상황 시뮬레이션 훈련과 즉각적 피드백 루프 구축을 권장합니다." },
    "B+": { headline: "안정적이지만, 변화 앞에서 멈추는 경향이 있습니다.", sub: "루틴과 안전한 선택을 선호하는 패턴이 점수에 반영되어 있습니다.", tip: "작은 불편함에 자신을 의도적으로 노출하는 연습부터 시작하세요." },
    B:   { headline: "현재 방식이 당신의 성장을 제한하고 있습니다.", sub: "업무 능력이 없는 게 아닙니다. 사고 방식과 문제 접근법의 전환이 필요합니다.", tip: "지금 하는 방식을 '왜 하는가'부터 다시 물어보세요." },
    C:   { headline: "현상 유지가 리스크인 시대입니다.", sub: "지금 당장 큰 변화보다, 사고 패턴 하나를 바꾸는 것부터 시작하세요.", tip: "이 진단 결과를 신뢰할 수 있는 동료 1명에게 보여주고 피드백을 받으세요." },
  };
  const insight = gradeInsight[grade] ?? gradeInsight["B+"];

  return (
    <div>
      <BrandBar currentStep={4} />

      {/* ── 등급 히어로 ── */}
      <div className="grade-hero">
        <div className="grade-badge" style={{ color: gradeColor }}>{grade}</div>
        <div className="grade-label" style={{ color: gradeColor }}>{label}</div>
        <div className="grade-score">{total}점 / 80점 만점</div>
      </div>

      {/* ── 등급 인사이트 카드 ── */}
      <div className="card" style={{ borderLeft: `3px solid ${gradeColor}`, marginTop: 0 }}>
        <div style={{ fontSize: "0.98rem", fontWeight: 700, color: "rgba(255,255,255,0.92)", marginBottom: 6 }}>
          {insight.headline}
        </div>
        <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 10 }}>
          {insight.sub}
        </div>
        <div style={{
          background: `${gradeColor}14`,
          border: `1px solid ${gradeColor}40`,
          borderRadius: 8, padding: "8px 12px",
          fontSize: "0.82rem", color: "rgba(255,255,255,0.7)"
        }}>
          💡 <strong style={{ color: gradeColor }}>핵심 액션:</strong> {insight.tip}
        </div>
      </div>

      {/* ── 응답 일관성 ── */}
      <div className="consistency-badge">
        <span style={{ color: "#AEAEB2" }}>응답 일관성</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          color: consistency >= 70 ? "#32D74B" : consistency >= 40 ? "#FF9F0A" : "#FF453A" }}>
          {consistency.toFixed(0)}%
        </span>
        {consistency < 70 && (
          <span style={{ fontSize: "0.75rem", color: "#FF9F0A", marginLeft: 6 }}>
            ⚠️ 압박 상황에서 일관성 저하
          </span>
        )}
      </div>

      {/* ── 레이더 차트 ── */}
      <div className="radar-wrap">
        <RadarChart scores={scores} />
      </div>

      {/* ── 역량별 점수 바 (백분위 포함) ── */}
      <div className="card">
        <div className="sec-title" style={{ fontSize: "0.95rem", marginBottom: 14 }}>📊 역량별 세부 점수</div>
        <div className="cat-bar-wrap">
          {Object.entries(CATEGORY_INFO).map(([cat, info]) => {
            const s = scores[cat] ?? 0;
            const pct = (s / 20) * 100;
            const ptile = catPercentile(s);
            return (
              <div key={cat} className="cat-bar-row">
                <div className="cat-bar-header">
                  <div className="cat-bar-name">
                    <span>{info.emoji}</span>
                    <span style={{ color: info.color }}>{cat}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "0.72rem", color: ptile.color, fontWeight: 600 }}>{ptile.txt}</span>
                    <div className="cat-bar-score">{s} / 20</div>
                  </div>
                </div>
                <div className="cat-bar-bg">
                  <div className="cat-bar-fill" style={{ width: `${pct}%`, background: info.color }} />
                </div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                  {info.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── AI 컨설팅 ── */}
      <div className="sec-title" style={{ marginTop: 20 }}>🤖 AI 맞춤 컨설팅</div>

      {/* 버튼 클릭 전: 안내 + 경고 + 버튼 */}
      {!aiRequested && !consulting && (
        <div className="consulting-box" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>🤖</div>
          <div style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: 10, color: "rgba(255,255,255,0.9)" }}>
            AI가 당신의 응답을 바탕으로<br />맞춤 성장 컨설팅을 제공합니다
          </div>
          <div style={{
            background: "rgba(255,159,10,0.08)",
            border: "1px solid rgba(255,159,10,0.3)",
            borderRadius: 10,
            padding: "14px 16px",
            marginBottom: 20,
            textAlign: "left",
            fontSize: "0.82rem",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.6)",
          }}>
            <div style={{ color: "#FF9F0A", fontWeight: 700, marginBottom: 6 }}>⚠️ AI 분석 실행 전 안내</div>
            이 버튼을 클릭하면 <strong style={{ color: "rgba(255,255,255,0.85)" }}>제작자(박한샘 과장)의 Gemini API</strong>에 연결됩니다.<br />
            • 요청 횟수에 따라 <strong style={{ color: "rgba(255,255,255,0.85)" }}>API 비용이 청구될 수 있습니다</strong><br />
            • 무료 플랜 한도가 있어 <strong style={{ color: "rgba(255,255,255,0.85)" }}>사용량 초과 시 분석이 실패</strong>할 수 있습니다<br />
            • 분석 결과는 AI 생성 콘텐츠이며 참고용입니다
          </div>
          <button className="btn btn-primary" onClick={handleRequestAI} style={{ width: "100%" }}>
            ✨ AI 맞춤 컨설팅 받기
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-wrap">
          <div className="loading-spinner" />
          <div className="loading-text">
            {loadingMsg}<br />
            <span style={{ fontSize: "0.8rem", color: "#6E6E73" }}>약 15~30초 소요됩니다 (Rate Limit 시 자동 재시도)</span>
          </div>
        </div>
      )}

      {error && (
        <div className="consulting-box">
          <div style={{ color: "#FF453A", marginBottom: 8, fontWeight: 600, fontSize: "0.95rem" }}>
            ⚠️ AI 분석 중 오류가 발생했습니다.
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", marginBottom: 16, fontSize: "0.83rem", lineHeight: 1.6 }}>
            {error.includes("429") ? (
              <>
                Gemini API 무료 요청 한도를 초과했습니다.<br />
                <strong style={{ color: "rgba(255,255,255,0.8)" }}>30초~1분 후 아래 버튼을 눌러 다시 시도</strong>해 주세요.
              </>
            ) : (
              error
            )}
          </div>
          <button className="btn btn-secondary" onClick={loadConsulting} style={{ width: "100%" }}>
            🔄 다시 시도
          </button>
        </div>
      )}

      {consulting && !loading && (
        <>
          {/* 일반 섹션 */}
          {nonResourceSections.map((sec) => (
            <div key={sec.heading} className="consulting-box">
              <div className="consulting-section-title">{sec.heading}</div>
              <SimpleMarkdown text={sec.body} />
            </div>
          ))}

          {/* 추천 리소스 — 카드 형태로 */}
          {resourceSection && (
            <div className="consulting-box">
              <div className="consulting-section-title">{resourceSection.heading}</div>
              {resources.length > 0 ? (
                <div className="resource-list">
                  {resources.map((res, i) => (
                    <div key={i} className="resource-card">
                      <span className={`resource-type ${res.type}`}>
                        {res.type === "book" ? "📖 책" : "▶ 유튜브"}
                      </span>
                      <div className="resource-title">{res.title}</div>
                      {res.author && <div className="resource-author">{res.author}</div>}
                      {res.reason && <div className="resource-reason">{res.reason}</div>}
                      <a
                        className="resource-link"
                        href={res.searchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        🔗 바로가기
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                // 파싱 실패 시 원문 렌더
                <SimpleMarkdown text={resourceSection.body} />
              )}
            </div>
          )}
        </>
      )}

      {/* ── 공유 ── */}
      <div className="share-box">
        <div className="share-title">🔗 이 진단 링크를 동료에게 공유하세요</div>
        <button
          className={`copy-btn${copied ? " copied" : ""}`}
          onClick={handleCopy}
        >
          {copied ? "✅ 복사 완료!" : "📋 링크 복사하기"}
        </button>
      </div>

      {/* ── 다시 시작 ── */}
      <button className="retry-btn" onClick={onRetry}>
        🔄 처음부터 다시 진단하기
      </button>

      <footer className="footer">
        © 2025 일성아이에스 · AI-Talent Compass v3.2<br />
        Based on WEF 2025 · McKinsey 2026 · NVIDIA GTC 2025 Insights<br />
        본 진단 결과는 참고용이며 실제 인사 평가에 사용되지 않습니다.
      </footer>
    </div>
  );
}
