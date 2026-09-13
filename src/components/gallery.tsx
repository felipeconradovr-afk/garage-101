"use client";
import { useMemo, useState } from "react";
import type { GalleryItem } from "@/lib/types";
import { BeforeAfter } from "./before-after";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const categories = useMemo(() => ["Todos", ...Array.from(new Set(items.map((i) => i.category)))], [items]);
  const [active, setActive] = useState("Todos");
  const filtered = active === "Todos" ? items : items.filter((i) => i.category === active);

  if (!items.length) return null;

  return (
    <>
      <div className="gallery-filters" role="tablist" aria-label="Filtrar por categoria">
        {categories.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={active === cat}
            className={active === cat ? "is-active" : ""}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="gallery-grid">
        {filtered.map((item) => (
          <article key={item.id} className="gallery-card">
            <BeforeAfter before={item.before_image} after={item.after_image} alt={item.title} />
            <div className="gallery-card-body">
              <span className="gallery-cat">{item.category}</span>
              <h3>{item.title}</h3>
              {item.description ? <p className="muted">{item.description}</p> : null}
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 ? <p className="muted gallery-empty">Nenhum resultado nesta categoria.</p> : null}
    </>
  );
}
