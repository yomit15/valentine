"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("valentineAccepted")) {
      router.push("/valentine");
    }
  }, [router]);

  const handleYes = () => {
    localStorage.setItem("valentineAccepted", "true");
    router.push("/valentine");
  };

  const moveNoButton = (e) => {
    const btn = e.target;
    btn.style.position = "absolute";
    btn.style.left = Math.random() * (window.innerWidth - 100) + "px";
    btn.style.top = Math.random() * (window.innerHeight - 50) + "px";
  };

  return (
    <main className="center">
      <h1>Will you be my Valentine? 💖</h1>
      <div className="button-container">
        <button className="yes-btn" onClick={handleYes}>Yes 💘</button>
        <button className="no-btn" onMouseEnter={moveNoButton}>No 😢</button>
      </div>
    </main>
  );
}
