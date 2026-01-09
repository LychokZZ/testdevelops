"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Header } from "@/components/Header/Header";
import { Button } from "@/components/Button/Button";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";

import { getQuiz } from "@/services/quizzes";
import { Quiz } from "@/types/quiz";

import styles from "./Play.module.scss";

type Answer =
    | { type: "BOOLEAN"; value: boolean }
    | { type: "INPUT"; value: string }
    | { type: "CHECKBOX"; value: number[] };

function isAnswered(a: Answer | undefined) {
    if (!a) return false;
    if (a.type === "BOOLEAN") return true;
    if (a.type === "INPUT") return a.value.trim().length > 0;
    if (a.type === "CHECKBOX") return a.value.length > 0;
    return false;
}

export default function PlayQuizPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [answers, setAnswers] = useState<Record<number, Answer>>({});
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (!id) return;
        getQuiz(id).then((q) => {
            setQuiz(q);
            setStep(0);
            setAnswers({});
        });
    }, [id]);

    const total = quiz?.questions.length ?? 0;

    const answeredCount = useMemo(() => {
        if (!quiz) return 0;
        return quiz.questions.reduce((acc, _q, idx) => acc + (isAnswered(answers[idx]) ? 1 : 0), 0);
    }, [quiz, answers]);

    if (!quiz) {
        return (
            <>
                <Header />
                <main className={styles.page}>
                    <div className={styles.center}>Loading...</div>
                </main>
            </>
        );
    }

    const q = quiz.questions[step];
    const currentAnswer = answers[step];
    const canGoNext = isAnswered(currentAnswer);
    const isLast = step === total - 1;

    const goPrev = () => setStep((s) => Math.max(0, s - 1));
    const goNext = () => {
        if (!canGoNext) return;
        setStep((s) => Math.min(total - 1, s + 1));
    };

    const submit = () => {
        let score = 0;

        quiz.questions.forEach((question, index) => {
            const a = answers[index];
            if (!a) return;

            if (question.type === "BOOLEAN" && a.type === "BOOLEAN") {
                if (a.value === question.correctBoolean) score++;
            }

            if (question.type === "INPUT" && a.type === "INPUT") {
                if (a.value.trim().toLowerCase() === question.correctText?.trim().toLowerCase()) {
                    score++;
                }
            }

            if (question.type === "CHECKBOX" && a.type === "CHECKBOX") {
                const correctIndexes =
                    question.options
                        ?.map((o, i) => (o.isCorrect ? i : null))
                        .filter((x) => x !== null) ?? [];

                const aSorted = [...a.value].sort((x, y) => x - y);
                const cSorted = [...(correctIndexes as number[])].sort((x, y) => x - y);

                if (
                    aSorted.length === cSorted.length &&
                    aSorted.every((v, i) => v === cSorted[i])
                ) {
                    score++;
                }
            }
        });

        router.push(`/quizzes/${quiz.id}/result?score=${score}&total=${total}`);
    };

    return (
        <>
            <Header />

            <main className={styles.page}>
                <div className={styles.shell}>
                    <div className={styles.top}>
                        <div className={styles.titleBlock}>
                            <h1 className={styles.title}>{quiz.title}</h1>
                            <div className={styles.sub}>
                                Question {step + 1} of {total}
                            </div>
                        </div>

                        <ProgressBar value={answeredCount} max={total} label="Answered" />
                    </div>

                    <section className={styles.card}>
                        <div className={styles.qHeader}>
                            <div className={styles.qTag}>{q.type}</div>
                        </div>

                        <div className={styles.prompt}>{q.prompt}</div>

                        <div className={styles.answer}>
                            {q.type === "BOOLEAN" && (
                                <div className={styles.booleanGrid}>
                                    <label className={styles.choice}>
                                        <input
                                            type="radio"
                                            checked={currentAnswer?.type === "BOOLEAN" && currentAnswer.value === true}
                                            onChange={() =>
                                                setAnswers((p) => ({ ...p, [step]: { type: "BOOLEAN", value: true } }))
                                            }
                                        />
                                        <span>True</span>
                                    </label>

                                    <label className={styles.choice}>
                                        <input
                                            type="radio"
                                            checked={currentAnswer?.type === "BOOLEAN" && currentAnswer.value === false}
                                            onChange={() =>
                                                setAnswers((p) => ({ ...p, [step]: { type: "BOOLEAN", value: false } }))
                                            }
                                        />
                                        <span>False</span>
                                    </label>
                                </div>
                            )}

                            {q.type === "INPUT" && (
                                <div className={styles.inputWrap}>
                                    <input
                                        className={styles.textInput}
                                        type="text"
                                        placeholder="Type your answer…"
                                        value={currentAnswer?.type === "INPUT" ? currentAnswer.value : ""}
                                        onChange={(e) =>
                                            setAnswers((p) => ({ ...p, [step]: { type: "INPUT", value: e.target.value } }))
                                        }
                                    />
                                    <div className={styles.hint}>Tip: answer is case-insensitive</div>
                                </div>
                            )}

                            {q.type === "CHECKBOX" && (
                                <div className={styles.checkboxList}>
                                    {q.options?.map((o, idx) => {
                                        const selected =
                                            currentAnswer?.type === "CHECKBOX" ? currentAnswer.value : [];
                                        const checked = selected.includes(idx);

                                        return (
                                            <label key={idx} className={styles.choiceRow}>
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={(e) => {
                                                        const next = e.target.checked
                                                            ? [...selected, idx]
                                                            : selected.filter((x) => x !== idx);

                                                        setAnswers((p) => ({
                                                            ...p,
                                                            [step]: { type: "CHECKBOX", value: next },
                                                        }));
                                                    }}
                                                />
                                                <span>{o.text}</span>
                                            </label>
                                        );
                                    })}
                                    <div className={styles.hint}>Select one or more options</div>
                                </div>
                            )}
                        </div>
                    </section>

                    <div className={styles.nav}>
                        <Button variant="ghost" onClick={goPrev} disabled={step === 0}>
                            Back
                        </Button>

                        <div className={styles.navMeta}>
                            {canGoNext ? "Ready" : "Answer required"}
                        </div>

                        {!isLast ? (
                            <Button onClick={goNext} disabled={!canGoNext}>
                                Next
                            </Button>
                        ) : (
                            <Button onClick={submit} disabled={answeredCount < total}>
                                Finish
                            </Button>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
