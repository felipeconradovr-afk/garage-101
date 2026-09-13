"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function LoginPanel({ accessDenied = false }: { accessDenied?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(accessDenied ? "Esta conta não tem permissão para administrar o site. Entre com uma conta autorizada." : "");

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: String(form.get("email")).trim(),
        password: String(form.get("password")),
      });
      if (authError) throw new Error(authError.status === 429 ? "Muitas tentativas. Aguarde alguns minutos e tente novamente." : "Não foi possível entrar. Confira seu e-mail e sua senha.");
      router.push("/admin");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Não foi possível conectar. Tente novamente.");
      setBusy(false);
    }
  }

  return (
    <main className="admin-auth-page">
      <Link href="/" className="admin-back"><ArrowLeft size={16} /> Voltar ao site</Link>
      <div className="admin-auth-grid">
        <div className="admin-auth-intro">
          <span className="admin-eyebrow">GARAGE 101 / ÁREA ADMINISTRATIVA</span>
          <h1>O controle.<br /><span>Em suas mãos.</span></h1>
          <p>Um espaço para cuidar da presença digital de quem cuida de cada detalhe.</p>
        </div>
        <section className="admin-auth-card" aria-labelledby="login-title">
          <div className="admin-symbol"><LockKeyhole size={26} /></div>
          <h2 id="login-title">Bem-vindo de volta.</h2>
          <p>Entre com sua conta para gerenciar o site.</p>
          <form onSubmit={login} className="admin-form">
            <label>E-mail<input name="email" type="email" autoComplete="username" placeholder="Seu e-mail de acesso" required disabled={busy} maxLength={254} /></label>
            <label>Senha<div className="admin-password"><input name="password" type={visible ? "text" : "password"} autoComplete="current-password" placeholder="Sua senha" required disabled={busy} /><button type="button" aria-label={visible ? "Ocultar senha" : "Mostrar senha"} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
            {error ? <p className="admin-message admin-error" role="alert">{error}</p> : null}
            <button className="admin-btn admin-btn-primary" disabled={busy}>{busy ? <><LoaderCircle className="admin-spin" size={18} /> Entrando...</> : <>Entrar no painel <ArrowRight size={18} /></>}</button>
          </form>
          <div className="admin-auth-note"><LockKeyhole size={16} /><span>Acesso exclusivo de administradores. Para recuperar o acesso, entre em contato com o responsável pelo site.</span></div>
        </section>
      </div>
      <footer className="admin-auth-footer">GARAGE 101 <span>O cuidado está nos detalhes.</span></footer>
    </main>
  );
}
