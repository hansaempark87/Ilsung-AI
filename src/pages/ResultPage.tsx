import { useEffect, useState, useCallback } from "react";
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

  const prompt = `당신은 직설적이고 날카로운 AI 시대 커리어·성장 코치입니다. 한국어로만 답변하세요.
${roleCtx}
각 섹션마다 어떤 문항(Q번호)의 어떤 응답이 근거인지 반드시 구체적으로 인용하세요.
사탕발림 없이, 실제로 도움이 되는 조언을 주세요. 아래 형식 그대로 작성하세요.

## 🧬 프로필 기반 성향 분석
MBTI ${p.mbti ?? "미입력"}(${mbtiHint}), ${p.role ?? "미입력"}, ${p.age ?? "미입력"}, 경력 ${p.exp ?? "미입력"}, AI 활용 ${p.aiFreq ?? "미입력"}, 강점 ${p.strength ?? "미입력"}.
이 프로필과 진단 점수가 어떻게 맞물리는지 구체적으로 서술하세요. (2~3문단)

## 🎯 핵심 강점
가장 높은 역량 점수와 그것을 보여주는 문항 응답을 구체적으로 인용해 서술하세요. (1~2문단)

## ⚠️ 지금 당신이 놓치고 있는 것
가장 낮은 역량 점수와 그것을 드러낸 문항 응답을 직접 지적하세요.
업무와 일상 양쪽에서 이 약점이 어떤 문제로 나타나는지 현실적으로 서술하세요. (2~3문단)

## 📅 30일 실행 계획
Week 1: (내일 당장 할 수 있는 것)
Week 2: (습관으로 만들 것)
Week 3~4: (심화·확장 액션)

## 📚 성장을 위한 추천 리소스
약점 역량을 강화하는 데 직접적으로 도움이 되는 책 2권과 유튜브 채널/영상 2개를 추천하세요.
각 추천에는 반드시: 제목, 저자/채널명, 왜 이 사람에게 지금 필요한지 이유(1~2문장)를 포함하세요.
형식: **[책]** 제목 — 저자 / 이유 / **[유튜브]** 채널명 — 영상/채널 설명 / 이유

[진단 데이터]
등급: ${grade} / ${label}
총점: ${total}/80점
응답 일관성: ${consistency.toFixed(0)}%

[프로필]
MBTI: ${p.mbti ?? "미입력"} | 직책: ${p.role ?? "미입력"} | 연령대: ${p.age ?? "미입력"} | 경력: ${p.exp ?? "미입력"} | AI 활용: ${p.aiFreq ?? "미입력"} | 강점: ${p.strength ?? "미입력"}

[역량별 점수]
${scoreTxt}

[문항별 응답]
${answerDetail}`;

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("VITE_GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );
  if (!res.ok) throw new Error(`API 오류: ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "분석 결과를 가져올 수 없습니다.";
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
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadConsulting = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const text = await fetchConsulting(scores, answers, consistency, profile);
      setConsulting(text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadConsulting(); }, []);

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
  const nonResourceSections = sections.filter((s) => !s.heading.includes("추천 리소스"));
  const resourceSection = sections.find((s) => s.heading.includes("추천 리소스"));

  return (
    <div>
      <BrandBar currentStep={4} />

      {/* ── 등급 히어로 ── */}
      <div className="grade-hero">
        <div className="grade-badge" style={{ color: gradeColor }}>{grade}</div>
        <div className="grade-label" style={{ color: gradeColor }}>{label}</div>
        <div className="grade-score">{total}점 / 80점 만점</div>
      </div>

      {/* ── 응답 일관성 ── */}
      <div className="consistency-badge">
        <span style={{ color: "#AEAEB2" }}>응답 일관성</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          color: consistency >= 70 ? "#32D74B" : consistency >= 40 ? "#FF9F0A" : "#FF453A" }}>
          {consistency.toFixed(0)}%
        </span>
      </div>

      {/* ── 레이더 차트 ── */}
      <div className="radar-wrap">
        <RadarChart scores={scores} />
      </div>

      {/* ── 역량별 점수 바 ── */}
      <div className="card">
        <div className="sec-title" style={{ fontSize: "0.95rem", marginBottom: 14 }}>📊 역량별 세부 점수</div>
        <div className="cat-bar-wrap">
          {Object.entries(CATEGORY_INFO).map(([cat, info]) => {
            const s = scores[cat] ?? 0;
            const pct = (s / 20) * 100;
            return (
              <div key={cat} className="cat-bar-row">
                <div className="cat-bar-header">
                  <div className="cat-bar-name">
                    <span>{info.emoji}</span>
                    <span style={{ color: info.color }}>{cat}</span>
                  </div>
                  <div className="cat-bar-score">{s} / 20</div>
                </div>
                <div className="cat-bar-bg">
                  <div className="cat-bar-fill" style={{ width: `${pct}%`, background: info.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── AI 컨설팅 ── */}
      <div className="sec-title" style={{ marginTop: 20 }}>🤖 AI 맞춤 컨설팅</div>

      {loading && (
        <div className="loading-wrap">
          <div className="loading-spinner" />
          <div className="loading-text">
            AI가 당신의 응답을 분석 중입니다...<br />
            <span style={{ fontSize: "0.8rem", color: "#6E6E73" }}>약 15~30초 소요됩니다</span>
          </div>
        </div>
      )}

      {error && (
        <div className="consulting-box">
          <div style={{ color: "#FF453A", marginBottom: 12, fontSize: "0.88rem" }}>
            ⚠️ AI 분석 중 오류가 발생했습니다.<br />{error}
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
