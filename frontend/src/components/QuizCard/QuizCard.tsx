import Link from "next/link";
import styles from "./QuizCard.module.scss";
import { QuizListItem } from "@/types/quiz";
import { DeleteQuizButton } from "./DeleteQuizButton";

export function QuizCard({ item }: { item: QuizListItem }) {
    return (
        <div className={styles.card}>
            <div className={styles.left}>
                <Link href={`/quizzes/${item.id}`} className={styles.title}>
                    {item.title}
                </Link>

                <div className={styles.meta}>{item.questionsCount} questions</div>
            </div>

            <div className={styles.actions}>
                <Link href={`/quizzes/${item.id}/play`}>▶ Play</Link>
                <DeleteQuizButton id={item.id} /></div>
        </div>
    );
}
