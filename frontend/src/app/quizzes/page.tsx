import { Header } from "../../components/Header/Header";
import { Container } from "../../components/Container/Container";
import { QuizCard } from "../../components/QuizCard/QuizCard";
import { QuizListItem } from "@/types/quiz";

async function fetchQuizzes(): Promise<QuizListItem[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/quizzes`, {
        cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
}

export default async function QuizzesPage() {
    const items = await fetchQuizzes();

    return (
        <>
            <Header />
            <Container>
                <h1>All Quizzes</h1>

                {items.length === 0 ? (
                    <p>No quizzes yet.</p>
                ) : (
                    <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
                        {items.map((q) => (
                            <QuizCard key={q.id} item={q} />
                        ))}
                    </div>
                )}
            </Container>
        </>
    );
}
