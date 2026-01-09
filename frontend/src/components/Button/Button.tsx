import styles from "./Button.module.scss";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost" | "danger";
};

export function Button({ variant = "primary", ...props }: Props) {
    return <button className={`${styles.btn} ${styles[variant]}`} {...props} />;
}
