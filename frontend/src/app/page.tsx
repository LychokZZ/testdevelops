import Link from "next/link";
import { Header } from "@/components/Header/Header";
import { Container } from "@/components/Container/Container";
import { RandomQuizzes } from "@/components/RandomQuizzes/RandomQuizzes";
import { QuizListItem } from "@/types/quiz";
import styles from "./page.module.scss";
async function fetchQuizzes(): Promise<QuizListItem[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return [];

  const res = await fetch(`${base}/quizzes`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage() {
  const quizzes = await fetchQuizzes();

  return (
    <>
      <Header />
      <Container>
        <h1>Quiz Builder</h1>
        <p>Create quizzes and play them.</p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
          <Link href="/create" className={styles.primary}>Create quiz</Link>
          <Link href="/quizzes" className={styles.primary}>View quizzes</Link>
        </div>

        <RandomQuizzes items={quizzes} limit={5} title="Random picks for you" />
      </Container>
    </>
  );
}

