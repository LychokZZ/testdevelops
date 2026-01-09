import styles from "./QuestionPreview.module.scss";
import { Question } from "@/types/quiz";

export function QuestionPreview({ q, index }: { q: Question; index: number }) {
    return (
        <div className={styles.block}>
            <div className={styles.top}>
                <strong>Q{index + 1}</strong>
                <span className={styles.type}>{q.type}</span>
            </div>

            <div className={styles.prompt}>{q.prompt}</div>

            {q.type === "BOOLEAN" && (
                <div className={styles.answer}>Correct: {q.correctBoolean ? "True" : "False"}</div>
            )}

            {q.type === "INPUT" && (
                <div className={styles.answer}>Correct: {q.correctText}</div>
            )}

            {q.type === "CHECKBOX" && (
                <div className={styles.options}>
                    {(q.options ?? []).map((o, i) => (
                        <label key={i} className={styles.option}>
                            <input type="checkbox" checked={!!o.isCorrect} readOnly />
                            <span>{o.text}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}
