import { useState, useEffect } from "react";
import { onboardingApi } from "../../api/onboarding";

export default function OnboardingWizard({ onStartChatting }) {
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [customAnswer, setCustomAnswer] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOnboarding();
  }, []);

  const loadNextQuestion = async () => {
    try {
      const res = await onboardingApi.start();
      setCurrentQuestion(res.question);
      setCompleted(res.completed);
      setAnswer("");
      setCustomAnswer("");
    } catch (err) {
      setError("Failed to load question.");
    }
  };

  const loadOnboarding = async () => {
    try {
      setLoading(true);
      const s = await onboardingApi.getSession();
      setSession(s);
      setCompleted(s.completed);
      if (!s.completed) {
        await loadNextQuestion();
      }
    } catch (err) {
      setError("Failed to load onboarding session.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentQuestion) return;

    const finalAnswer =
      answer.trim() !== "" ? answer : customAnswer.trim() !== "" ? customAnswer : null;

    if (finalAnswer === null && currentQuestion.type === "text") {
      setError("Please enter an answer or skip this question.");
      return;
    }

    try {
      const res = await onboardingApi.submit({
        question_id: currentQuestion.id,
        answer: currentQuestion.type === "select" ? answer : finalAnswer,
        custom_answer:
          currentQuestion.allow_custom && customAnswer.trim() !== "" ? customAnswer : null,
      });

      if (res.completed) {
        setCompleted(true);
        setCurrentQuestion(null);
      } else {
        setCurrentQuestion(res.next_question);
        setAnswer("");
        setCustomAnswer("");
      }
      setError(null);
    } catch (err) {
      setError("Failed to submit answer. Please try again.");
    }
  };

  const handleSkip = async () => {
    if (!currentQuestion) return;
    try {
      const res = await onboardingApi.submit({
        question_id: currentQuestion.id,
        answer: null,
        custom_answer: null,
      });
      if (res.completed) {
        setCompleted(true);
        setCurrentQuestion(null);
      } else {
        setCurrentQuestion(res.next_question);
        setAnswer("");
        setCustomAnswer("");
      }
      setError(null);
    } catch (err) {
      setError("Failed to skip question.");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  if (completed) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Onboarding Complete!</h2>
          <p className="text-green-600 mb-4">
            Your business profile has been saved. You can now start chatting with your Finance Analyst.
          </p>
          <button
            onClick={() => {
              if (onStartChatting) {
                onStartChatting();
                return;
              }
              setCompleted(false);
              loadOnboarding();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Start Chatting
          </button>
        </div>
      </div>
    );
  }

  const progress = ((session.current_step) / 11) * 100;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Set Up Your Finance Workspace</h1>
          <p className="text-gray-600">
            Answer a few questions so your Finance Analyst can give you personalized advice.
          </p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Step {session.current_step + 1} of 11
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">{currentQuestion.text}</h2>
            {currentQuestion.type === "select" && (
              <div className="space-y-2">
                {currentQuestion.options.map((opt) => (
                  <label key={opt} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="answer"
                      value={opt}
                      checked={answer === opt}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="mr-2"
                    />
                    {opt}
                  </label>
                ))}
                {currentQuestion.allow_custom && (
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="answer"
                      value="__custom__"
                      checked={answer === "__custom__"}
                      onChange={(e) => {
                        setAnswer(e.target.value);
                        if (e.target.value === "__custom__") setCustomAnswer("");
                      }}
                      className="mr-2"
                    />
                    Something else
                  </label>
                )}
                {currentQuestion.allow_custom && answer === "__custom__" && (
                  <input
                    type="text"
                    placeholder="Type your own answer"
                    value={customAnswer}
                    onChange={(e) => setCustomAnswer(e.target.value)}
                    className="w-full px-3 py-2 border rounded mt-2"
                  />
                )}
              </div>
            )}
            {currentQuestion.type === "text" && (
              <input
                type="text"
                placeholder="Type your answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            )}
          </div>

          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
              {currentQuestion.type === "text" && !answer && !customAnswer ? "Skip" : "Next"}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Skip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
