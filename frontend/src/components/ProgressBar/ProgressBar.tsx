import styles from "./ProgressBar.module.scss";

export function ProgressBar({
    value,
    max,
    label,
}: {
    value: number;
    max: number;
    label?: string;
}) {
    const safeMax = Math.max(1, max);
    const pct = Math.min(100, Math.max(0, Math.round((value / safeMax) * 100)));

    return (
        <div className={styles.wrap} aria-label={label ?? "Progress"}>
            <div className={styles.top}>
                <span className={styles.label}>{label ?? "Progress"}</span>
                <span className={styles.meta}>
                    {value}/{max} ({pct}%)
                </span>
            </div>

            <div className={styles.track} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
                <div className={styles.fill} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}
