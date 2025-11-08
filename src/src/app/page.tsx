"use client";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();
  
  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Bem-vindo à Home!</h1>
      <p>Você está logado.</p>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}
