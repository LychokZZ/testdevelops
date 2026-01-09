import Link from "next/link";
import styles from "./Header.module.scss";

export function Header() {
    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logo}>
                Quiz Builder
            </Link>

            <nav className={styles.nav}>
                <Link href="/quizzes">Quizzes</Link>
                <Link href="/create" className={styles.primary}>
                    Create
                </Link>
            </nav>
        </header>
    );
}
