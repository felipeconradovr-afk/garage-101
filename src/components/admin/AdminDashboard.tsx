"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut, Plus, Trash2, Pencil, LoaderCircle, Upload, ExternalLink } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type Tab = "services" | "gallery" | "testimonials" | "settings" | "leads";

const TABS: { id: Tab; label: string }[] = [
  { id: "services", label: "Serviços" },
  { id: "gallery", label: "Galeria" },
  { id: "testimonials", label: "Depoimentos" },
  { id: "settings", label: "Configurações" },
  { id: "leads", label: "Leads" },
];

function useAdminFetch<T>(tab: Tab) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchData = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`/api/admin/${tab}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao carregar.");
      setData(json);
    } catch (e) { setError(e instanceof Error ? e.message : "Erro."); }
    finally { setLoading(false); }
  }, [tab]);
  // sincroniza busca quando a aba muda — setState via fetch, não cascading render manual
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refresh: fetchData, setData };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label>{label}{children}</label>;
}

function UploadField({ value, onChange, label = "Imagem" }: { value: string; onChange: (url: string) => void; label?: string }) {
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(value);
  // mantém prévia em sincronia com valor externo
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setPreview(value), [value]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // local preview first
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha no upload.");
      onChange(json.url);
      setPreview(json.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro no upload.");
      setPreview(value);
    } finally { setBusy(false); }
  }

  return (
    <div>
      <Field label={label}>
        <input type="url" value={value} onChange={(e) => { onChange(e.target.value); setPreview(e.target.value); }} placeholder="https://... ou faça upload" />
      </Field>
      <div className="admin-inline" style={{ marginTop: 8 }}>
        <label className="admin-btn admin-btn-ghost" style={{ cursor: busy ? "wait" : "pointer" }}>
          {busy ? <LoaderCircle size={14} className="admin-spin" /> : <Upload size={14} />} Selecionar arquivo
          <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden onChange={handleFile} disabled={busy} />
        </label>
        {value ? <a href={value} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-ghost"><ExternalLink size={14} /> Abrir</a> : null}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {preview ? <img src={preview} alt="Prévia" className="admin-upload-preview" /> : null}
    </div>
  );
}

// ── Services ──
function ServicesTab() {
  const { data, loading, error, refresh } = useAdminFetch<Record<string, unknown>[]> ("services");
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", short_description: "", description: "", image_url: "", active: true, sort_order: 1 });
  const [saving, setSaving] = useState(false);

  function openCreate() { setEditing(null); setShowForm(true); setForm({ title: "", slug: "", short_description: "", description: "", image_url: "", active: true, sort_order: (Array.isArray(data) ? data.length + 1 : 1) }); }
  function openEdit(item: Record<string, unknown>) {
    setEditing(item); setShowForm(true);
    setForm({
      title: String(item.title ?? ""), slug: String(item.slug ?? ""), short_description: String(item.short_description ?? ""),
      description: String(item.description ?? ""), image_url: String(item.image_url ?? ""), active: Boolean(item.active), sort_order: Number(item.sort_order ?? 1),
    });
  }
  async function save() {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/services/${editing.id}` : "/api/admin/services";
      const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setEditing(null); setShowForm(false); setForm({ title: "", slug: "", short_description: "", description: "", image_url: "", active: true, sort_order: 1 });
      refresh();
    } catch (e) { alert(e instanceof Error ? e.message : "Erro ao salvar."); }
    finally { setSaving(false); }
  }
  async function remove(id: string) {
    if (!confirm("Excluir este serviço?")) return;
    const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    if (!res.ok) { const j = await res.json(); alert(j.error || "Erro ao excluir."); return; }
    refresh();
  }

  if (loading) return <p className="muted">Carregando serviços...</p>;
  if (error) return <p className="admin-error admin-message">{error}</p>;

  return (
    <div>
      <div className="admin-inline" style={{ justifyContent: "space-between", marginBottom: 16 }}>
        <h3>Serviços ({Array.isArray(data) ? data.length : 0})</h3>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}><Plus size={14} /> Novo serviço</button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: 16 }}>
          <h3>{editing ? "Editar serviço" : "Novo serviço"}</h3>
          <div className="admin-form-grid">
            <Field label="Título"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={80} /></Field>
            <Field label="Slug"><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} placeholder="ex: polimento-automotivo" /></Field>
            <Field label="Descrição curta"><input value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} maxLength={160} /></Field>
            <Field label="Descrição completa"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} maxLength={2000} /></Field>
            <UploadField value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} label="Imagem (opcional)" />
            <div className="admin-inline">
              <label style={{ display: "flex", gap: 8, alignItems: "center", textTransform: "none", letterSpacing: 0 }}><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Ativo</label>
              <Field label="Ordem"><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} min={1} max={99} /></Field>
            </div>
            <div className="admin-inline">
              <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>{saving ? <LoaderCircle size={14} className="admin-spin" /> : null} Salvar</button>
              <button className="admin-btn admin-btn-ghost" onClick={() => { setEditing(null); setShowForm(false); setForm({ title: "", slug: "", short_description: "", description: "", image_url: "", active: true, sort_order: 1 }); }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-list">
        {(Array.isArray(data) ? data : []).map((s) => (
          <div key={String(s.id)} className="admin-row">
            <div><strong>{String(s.title)}</strong> <span>/{String(s.slug)} · ordem {String(s.sort_order)} {s.active ? "· ativo" : "· inativo"}</span><br /><span>{String(s.short_description)}</span></div>
            <div className="admin-inline">
              <button className="admin-btn admin-btn-ghost" onClick={() => openEdit(s)}><Pencil size={14} /> Editar</button>
              <button className="admin-btn admin-btn-danger" onClick={() => remove(String(s.id))}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryTab() {
  const { data, loading, error, refresh } = useAdminFetch<Record<string, unknown>[]>("gallery");
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "", before_image: "", after_image: "", description: "", featured: false, active: true, sort_order: 1 });
  const [saving, setSaving] = useState(false);

  function openCreate() { setEditing(null); setShowForm(true); setForm({ title: "", category: "", before_image: "", after_image: "", description: "", featured: false, active: true, sort_order: 1 }); }
  function openEdit(item: Record<string, unknown>) {
    setEditing(item); setShowForm(true);
    setForm({
      title: String(item.title ?? ""), category: String(item.category ?? ""), before_image: String(item.before_image ?? ""),
      after_image: String(item.after_image ?? ""), description: String(item.description ?? ""), featured: Boolean(item.featured), active: Boolean(item.active), sort_order: Number(item.sort_order ?? 1),
    });
  }
  async function save() {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/gallery/${editing.id}` : "/api/admin/gallery";
      const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setEditing(null); setShowForm(false); refresh();
    } catch (e) { alert(e instanceof Error ? e.message : "Erro."); }
    finally { setSaving(false); }
  }
  async function remove(id: string) {
    if (!confirm("Excluir este item da galeria?")) return;
    const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    if (!res.ok) { const j = await res.json(); alert(j.error || "Erro."); return; }
    refresh();
  }

  if (loading) return <p className="muted">Carregando galeria...</p>;
  if (error) return <p className="admin-error admin-message">{error}</p>;

  return (
    <div>
      <div className="admin-inline" style={{ justifyContent: "space-between", marginBottom: 16 }}>
        <h3>Galeria ({Array.isArray(data) ? data.length : 0})</h3>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}><Plus size={14} /> Novo item</button>
      </div>
      {showForm && (
        <div className="admin-card" style={{ marginBottom: 16 }}>
          <h3>{editing ? "Editar item" : "Novo item"}</h3>
          <div className="admin-form-grid">
            <Field label="Título"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label="Categoria"><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Ex: Polimento, Higienização" /></Field>
            <UploadField value={form.before_image} onChange={(v) => setForm({ ...form, before_image: v })} label="Imagem — Antes" />
            <UploadField value={form.after_image} onChange={(v) => setForm({ ...form, after_image: v })} label="Imagem — Depois" />
            <Field label="Descrição"><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            <div className="admin-inline">
              <label style={{ display: "flex", gap: 8, alignItems: "center", textTransform: "none", letterSpacing: 0 }}><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Destaque na home</label>
              <label style={{ display: "flex", gap: 8, alignItems: "center", textTransform: "none", letterSpacing: 0 }}><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Ativo</label>
              <Field label="Ordem"><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} min={1} max={99} /></Field>
            </div>
            <div className="admin-inline">
              <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>{saving ? <LoaderCircle size={14} className="admin-spin" /> : null} Salvar</button>
              <button className="admin-btn admin-btn-ghost" onClick={() => { setEditing(null); setShowForm(false); }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      <div className="admin-list">
        {(Array.isArray(data) ? data : []).map((g) => (
          <div key={String(g.id)} className="admin-row">
            <div><strong>{String(g.title)}</strong> <span>· {String(g.category)} {g.featured ? "· destaque" : ""} {g.active ? "" : "· inativo"}</span></div>
            <div className="admin-inline">
              <button className="admin-btn admin-btn-ghost" onClick={() => openEdit(g)}><Pencil size={14} /> Editar</button>
              <button className="admin-btn admin-btn-danger" onClick={() => remove(String(g.id))}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialsTab() {
  const { data, loading, error, refresh } = useAdminFetch<Record<string, unknown>[]>("testimonials");
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", text: "", rating: 5, active: true });
  const [saving, setSaving] = useState(false);
  function openCreate() { setEditing(null); setShowForm(true); setForm({ name: "", text: "", rating: 5, active: true }); }
  function openEdit(item: Record<string, unknown>) { setEditing(item); setShowForm(true); setForm({ name: String(item.name ?? ""), text: String(item.text ?? ""), rating: Number(item.rating ?? 5), active: Boolean(item.active) }); }
  async function save() {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/testimonials/${editing.id}` : "/api/admin/testimonials";
      const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setEditing(null); setShowForm(false); refresh();
    } catch (e) { alert(e instanceof Error ? e.message : "Erro."); }
    finally { setSaving(false); }
  }
  async function remove(id: string) {
    if (!confirm("Excluir depoimento?")) return;
    const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    if (!res.ok) { const j = await res.json(); alert(j.error || "Erro."); return; }
    refresh();
  }
  if (loading) return <p className="muted">Carregando depoimentos...</p>;
  if (error) return <p className="admin-error admin-message">{error}</p>;
  return (
    <div>
      <div className="admin-inline" style={{ justifyContent: "space-between", marginBottom: 16 }}>
        <h3>Depoimentos ({Array.isArray(data) ? data.length : 0})</h3>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}><Plus size={14} /> Novo depoimento</button>
      </div>
      {showForm && (
        <div className="admin-card" style={{ marginBottom: 16 }}>
          <h3>{editing ? "Editar" : "Novo"} depoimento</h3>
          <div className="admin-form-grid">
            <Field label="Nome"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Texto"><textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={3} maxLength={600} /></Field>
            <Field label="Nota (1-5)"><input type="number" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} min={1} max={5} /></Field>
            <label style={{ display: "flex", gap: 8, alignItems: "center", textTransform: "none", letterSpacing: 0 }}><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Ativo</label>
            <div className="admin-inline">
              <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>{saving ? <LoaderCircle size={14} className="admin-spin" /> : null} Salvar</button>
              <button className="admin-btn admin-btn-ghost" onClick={() => { setEditing(null); setShowForm(false); }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      <div className="admin-list">
        {(Array.isArray(data) ? data : []).map((t) => (
          <div key={String(t.id)} className="admin-row">
            <div><strong>{String(t.name)}</strong> <span>· {"★".repeat(Number(t.rating))} {t.active ? "" : "· inativo"}</span><br /><span>{String(t.text).slice(0, 90)}</span></div>
            <div className="admin-inline">
              <button className="admin-btn admin-btn-ghost" onClick={() => openEdit(t)}><Pencil size={14} /> Editar</button>
              <button className="admin-btn admin-btn-danger" onClick={() => remove(String(t.id))}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  const { data, loading, error } = useAdminFetch<Record<string, unknown>>("settings");
  const [form, setForm] = useState({ whatsapp: "", instagram: "", address: "", opening_hours: "", hero_title: "", hero_subtitle: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (data && typeof data === "object" && !Array.isArray(data)) {
      // hidrata o formulário quando settings chega do servidor
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        whatsapp: String((data as Record<string, unknown>).whatsapp ?? ""),
        instagram: String((data as Record<string, unknown>).instagram ?? ""),
        address: String((data as Record<string, unknown>).address ?? ""),
        opening_hours: String((data as Record<string, unknown>).opening_hours ?? ""),
        hero_title: String((data as Record<string, unknown>).hero_title ?? ""),
        hero_subtitle: String((data as Record<string, unknown>).hero_subtitle ?? ""),
      });
    }
  }, [data]);
  async function save() {
    setSaving(true); setMsg("");
    try {
      const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setMsg("Configurações salvas.");
    } catch (e) { setMsg(e instanceof Error ? e.message : "Erro ao salvar."); }
    finally { setSaving(false); }
  }
  if (loading) return <p className="muted">Carregando configurações...</p>;
  if (error) return <p className="admin-error admin-message">{error}</p>;
  return (
    <div className="admin-card">
      <h3>Configurações do site</h3>
      <div className="admin-form-grid">
        <Field label="WhatsApp"><input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="5551995888316" /></Field>
        <Field label="Instagram (URL)"><input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="https://instagram.com/..." /></Field>
        <Field label="Endereço"><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
        <Field label="Horários"><input value={form.opening_hours} onChange={(e) => setForm({ ...form, opening_hours: e.target.value })} placeholder="Seg a Sáb, 8h às 18h" /></Field>
        <Field label="Título hero"><input value={form.hero_title} onChange={(e) => setForm({ ...form, hero_title: e.target.value })} /></Field>
        <Field label="Subtítulo hero"><input value={form.hero_subtitle} onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })} /></Field>
        <div className="admin-inline">
          <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>{saving ? <LoaderCircle size={14} className="admin-spin" /> : null} Salvar alterações</button>
          {msg ? <span className="muted" style={{ fontSize: 12 }}>{msg}</span> : null}
        </div>
      </div>
    </div>
  );
}

function LeadsTab() {
  const { data, loading, error } = useAdminFetch<Record<string, unknown>[]>("leads");
  if (loading) return <p className="muted">Carregando leads...</p>;
  if (error) return <p className="admin-error admin-message">{error}</p>;
  const list = Array.isArray(data) ? data : [];
  if (!list.length) return <p className="muted">Nenhum lead ainda.</p>;
  return (
    <div className="admin-list">
      {list.map((l) => (
        <div key={String(l.id)} className="admin-row" style={{ flexDirection: "column", alignItems: "flex-start" }}>
          <strong>{String(l.name)} · {String(l.phone)} · {String(l.service)}</strong>
          <span>{String(l.message)}</span>
          <span style={{ fontSize: 10 }}>{new Date(String(l.created_at)).toLocaleString("pt-BR")}</span>
        </div>
      ))}
    </div>
  );
}

export function AdminDashboard({ email }: { email: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("services");
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <div className="admin-dash">
      <div className="admin-top">
        <div>
          <div className="admin-eyebrow">GARAGE 101 / PAINEL</div>
          <h1>Painel administrativo</h1>
          <p>{email}</p>
        </div>
        <div className="admin-inline">
          <Link href="/" className="admin-btn admin-btn-ghost"><ArrowLeft size={14} /> Ver site</Link>
          <button className="admin-btn admin-btn-ghost" onClick={logout} disabled={busy}><LogOut size={14} /> Sair</button>
        </div>
      </div>
      <div className="admin-tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? "is-active" : ""} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>
      <div className="admin-panel">
        {tab === "services" ? <ServicesTab /> : null}
        {tab === "gallery" ? <GalleryTab /> : null}
        {tab === "testimonials" ? <TestimonialsTab /> : null}
        {tab === "settings" ? <SettingsTab /> : null}
        {tab === "leads" ? <LeadsTab /> : null}
      </div>
    </div>
  );
}
