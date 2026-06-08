import { useState } from "react";
import type { AppStep, Profile } from "./types";
import IntroPage from "./pages/IntroPage";
import ProfilePage from "./pages/ProfilePage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";

const DEFAULT_PROFILE: Profile = {
  mbti: null, role: null, age: null, exp: null, aiFreq: null, strength: null,
};

export default function App() {
  const [step, setStep] = useState<AppStep>("intro");
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQ, setCurrentQ] = useState(0);

  const handleAnswer = (qId: number, optIdx: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleRetry = () => {
    setStep("intro");
    setProfile(DEFAULT_PROFILE);
    setAnswers({});
    setCurrentQ(0);
  };

  return (
    <div className="app-shell">
      {step === "intro" && (
        <IntroPage onNext={() => setStep("profile")} />
      )}
      {step === "profile" && (
        <ProfilePage
          profile={profile}
          onProfileChange={setProfile}
          onNext={() => { setCurrentQ(0); setStep("quiz"); }}
          onBack={() => setStep("intro")}
        />
      )}
      {step === "quiz" && (
        <QuizPage
          answers={answers}
          currentQ={currentQ}
          onAnswer={handleAnswer}
          onNext={() => setCurrentQ((q) => q + 1)}
          onPrev={() => setCurrentQ((q) => Math.max(0, q - 1))}
          onFinish={() => setStep("result")}
        />
      )}
      {step === "result" && (
        <ResultPage
          answers={answers}
          profile={profile}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
