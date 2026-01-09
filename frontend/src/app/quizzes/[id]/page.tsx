"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "../../../components/Header/Header";
import { Container } from "../../../components/Container/Container";
import { getQuiz } from "@/services/quizzes";
import { Quiz } from "@/types/quiz";
import { QuestionPreview } from "../../../components/QuestionPreview/QuestionPreview";

export default function QuizDetailPage() {
    const params = useParams<{ id: string }>();
    const id = params?.id;

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        (async () => {
            setLoading(true);
            const data = await getQuiz(id);
            setQuiz(data);
            setLoading(false);
        })();
    }, [id]);

    return (
        <>
            <Header />
            <Container>
                {loading ? (
                    <p>Loading...</p>
                ) : !quiz ? (
                    <p>Not found</p>
                ) : (
                    <>
                        <h1>{quiz.title}</h1>
                        <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
                            {quiz.questions.map((q, idx) => (
                                <QuestionPreview key={q.id} q={q} index={idx} />
                            ))}
                        </div>
                    </>
                )}
            </Container>
        </>
    );
}
