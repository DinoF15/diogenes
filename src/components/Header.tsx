// src/components/Header.tsx
import styles from "../styles/header.module.scss";

/**
 * Header component that displays the main title and subtitle of the application.
 *
 * @returns {JSX.Element} The rendered header component.
 */
export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Diogenes</h1>
      <p className={styles.subtitle}> - A Random quote followed by a tongue in cheek comment.</p>
    </header>
  );
}
