import { Header } from "@/components/header/page";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className="page">
      <Header />
      <div className={styles.container}>
        <h1>Vendo</h1>
      </div>
    </div>
  );
}
