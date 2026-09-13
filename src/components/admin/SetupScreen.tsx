import Link from "next/link";
import { ArrowLeft, Check, LockKeyhole, Settings2 } from "lucide-react";

export function SetupScreen({ connectionError = false }: { connectionError?: boolean }) {
  return (
    <main className="admin-auth-page">
      <Link href="/" className="admin-back"><ArrowLeft size={16} /> Voltar ao site</Link>
      <div className="admin-auth-grid">
        <div className="admin-auth-intro">
          <span className="admin-eyebrow">GARAGE 101 / ÁREA ADMINISTRATIVA</span>
          <h1>O controle.<br /><span>Em suas mãos.</span></h1>
          <p>Serviços, resultados, depoimentos e contatos. Um espaço para manter a Garage 101 sempre em dia.</p>
          <div className="admin-auth-feature"><Check size={16} /> Conteúdo do site em um só lugar</div>
          <div className="admin-auth-feature"><Check size={16} /> Acesso exclusivo da administração</div>
          <div className="admin-auth-feature"><Check size={16} /> Fotos de antes e depois</div>
        </div>
        <section className="admin-auth-card" aria-labelledby="setup-title">
          <div className="admin-symbol"><Settings2 size={26} /></div>
          <span className="admin-status"><span /> Aguardando conexão</span>
          <h2 id="setup-title">{connectionError ? "Conexão indisponível" : "Painel preparado."}</h2>
          <p>{connectionError ? "Não foi possível verificar o acesso ao banco de dados. Confira a configuração e tente novamente." : "A estrutura está pronta. O acesso será liberado após a configuração do banco de dados e da conta administradora."}</p>
          <ol className="admin-setup-list">
            <li><span>01</span><div><strong>Conectar o Supabase</strong><p>Adicionar os dados do projeto na configuração do site.</p></div></li>
            <li><span>02</span><div><strong>Preparar os dados</strong><p>Aplicar a estrutura de tabelas e armazenamento fornecida.</p></div></li>
            <li><span>03</span><div><strong>Liberar o administrador</strong><p>Criar a conta e autorizar seu acesso ao painel.</p></div></li>
          </ol>
          <div className="admin-auth-note"><LockKeyhole size={16} /><span>O painel não oferece cadastro público. As instruções de ativação acompanham o projeto.</span></div>
          <Link href="/" className="admin-btn admin-btn-primary">Conhecer o site <ArrowLeft size={16} /></Link>
        </section>
      </div>
      <footer className="admin-auth-footer">GARAGE 101 <span>O cuidado está nos detalhes.</span></footer>
    </main>
  );
}
