import styles from "./IconButton.module.scss";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function IconButton(props: Props) {
    return <button className={styles.btn} {...props} />;
}
