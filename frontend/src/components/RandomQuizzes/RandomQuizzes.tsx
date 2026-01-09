import Link from "next/link";
import styles from "./RandomQuizzes.module.scss";
import { QuizListItem } from "@/types/quiz";

function shuffle<T>(arr: T[]) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function RandomQuizzes({
    items,
    limit = 5,
    title = "Try a random quiz",
}: {
    items: QuizListItem[];
    limit?: number;
    title?: string;
}) {
    const pick = shuffle(items).slice(0, Math.min(limit, items.length));

    if (pick.length === 0) {
        return (
            <section className={styles.wrap}>
                <div className={styles.head}>
                    <h2 className={styles.h2}>{title}</h2>
                </div>
                <p className={styles.empty}>No quizzes yet. Create your first quiz 🙂</p>
            </section>
        );
    }

    return (
        <section className={styles.wrap}>
            <div className={styles.head}>
                <h2 className={styles.h2}>{title}</h2>
                <Link className={styles.all} href="/quizzes">
                    View all →
                </Link>
            </div>

            <div className={styles.grid}>
                {pick.map((q) => (
                    <article key={q.id} className={styles.card}>
                        <div className={styles.cardTop}>
                            <Link className={styles.title} href={`/quizzes/${q.id}`}>
                                {q.title}
                            </Link>
                            <div className={styles.meta}>{q.questionsCount} questions</div>
                        </div>

                        <div className={styles.actions}>
                            <Link className={styles.btnGhost} href={`/quizzes/${q.id}`}>
                                Details
                            </Link>
                            <Link className={styles.btnPrimary} href={`/quizzes/${q.id}/play`}>
                                Play
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
