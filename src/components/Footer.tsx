// src/components/Footer.tsx
import styles from "../styles/Footer.module.scss"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} Diogenes - By Dino Fejzulovic, No rights reserved.</p>
    </footer>
  );
}
