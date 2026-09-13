"use client";
import { useState } from "react";
import { ArrowUpRight, LoaderCircle, MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";

const services = ["Polimento automotivo", "Higienização interna", "Higienização de estofamentos", "Caminhões", "Máquinas agrícolas", "Outro"];

export function ContactForm({ whatsapp }: { whatsapp: string }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState({ name: "", phone: "", service: "", message: "" });

  const waLink = whatsappUrl(
    whatsapp,
    `Olá! Vim pelo site da Garage 101.\nNome: ${values.name || "-"}\nTelefone: ${values.phone || "-"}\nServiço: ${values.service || "-"}\nMensagem: ${values.message || "-"}`,
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Não foi possível enviar. Tente pelo WhatsApp.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="contact-success">
        <p className="eyebrow">MENSAGEM REGISTRADA</p>
        <h3>Recebemos seu contato.</h3>
        <p className="muted">Em instantes você pode continuar a conversa no WhatsApp para combinar horário e orçamento.</p>
        <a className="button button-primary" href={waLink} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={18} /> Continuar no WhatsApp <ArrowUpRight size={16} />
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="contact-form" noValidate>
      <div className="cf-grid">
        <label>
          Nome
          <input
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            placeholder="Seu nome"
            required
            maxLength={80}
            autoComplete="name"
          />
        </label>
        <label>
          WhatsApp
          <input
            value={values.phone}
            onChange={(e) => setValues({ ...values, phone: e.target.value })}
            placeholder="(51) 99999-9999"
            required
            maxLength={20}
            autoComplete="tel"
          />
        </label>
      </div>
      <label>
        Serviço de interesse
        <select value={values.service} onChange={(e) => setValues({ ...values, service: e.target.value })} required>
          <option value="">Selecione</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label>
        Mensagem
        <textarea
          value={values.message}
          onChange={(e) => setValues({ ...values, message: e.target.value })}
          placeholder="Conte o que precisa de cuidado..."
          required
          maxLength={1000}
          rows={5}
        />
      </label>
      {error ? <p className="cf-error" role="alert">{error}</p> : null}
      <div className="cf-actions">
        <button className="button button-primary" disabled={busy}>
          {busy ? <><LoaderCircle size={16} className="admin-spin" /> Enviando...</> : <>Enviar mensagem <ArrowUpRight size={16} /></>}
        </button>
        <a className="text-link" href={waLink} target="_blank" rel="noopener noreferrer">
          Ou ir direto para o WhatsApp <MessageCircle size={14} />
        </a>
      </div>
      <p className="cf-note">Seu horário e orçamento são combinados diretamente no WhatsApp. Não simulamos agendamentos.</p>
    </form>
  );
}
