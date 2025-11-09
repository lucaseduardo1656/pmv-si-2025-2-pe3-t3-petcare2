"use client";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export function Header() {
  const router = useRouter();

  function handleClick(link: string) {
    router.push(link);
  }

  return (
    <header className={styles.menu}>
      <h1>DogCare</h1>

      <div className={styles.container}>
        <button onClick={() => handleClick("/")} className={styles.button}>
          Home
        </button>
        <button className={styles.button}>Animais de estimação</button>
      </div>
    </header>
  );
}
