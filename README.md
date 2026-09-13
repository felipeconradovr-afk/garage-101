# Garage 101

Base independente para estética automotiva e higienização. Next.js App Router, React, TypeScript, Tailwind CSS, GSAP e integração com Supabase (Postgres, Auth e Storage).

## Executar

Requer Node.js 22 ou superior.

```sh
npm install
npm run dev
```

Abra http://localhost:3000. Para usar outra porta: `npm run dev -- --port 3101`.

```sh
npm run lint
npm run typecheck
npm run build
npm start
npm test
```

Os testes usam Playwright. Instale o navegador com `npx playwright install chromium`. Também é possível definir `PLAYWRIGHT_CHANNEL=chrome` para usar Chrome já instalado. A configuração de testes inicia o servidor na porta 3101 quando necessário.

## Estado inicial e conteúdo

O site público funciona sem Supabase com os cinco serviços e o WhatsApp fornecidos. Esse conteúdo fica em `src/lib/content.ts`. Galeria e depoimentos começam vazios: nenhum trabalho, nome, avaliação, endereço, cidade ou histórico da empresa foi inventado.

O formulário monta uma mensagem e oferece um link para o visitante continuar no WhatsApp quando o banco não está configurado. O envio da mensagem e a confirmação do horário acontecem no WhatsApp. Nenhum agendamento ou cadastro é simulado.

O painel em `/admin` mostra as instruções de configuração enquanto não há conexão. Login, persistência e uploads dependem da sua configuração do Supabase. Não há cadastro público.

## Rotas

- `/`: Home completa, com serviços, processo de polimento, públicos atendidos, resultados, estofados, atendimento e CTA.
- `/servicos` e `/servicos/[slug]`: catálogo e detalhe dos serviços ativos.
- `/resultados`: galeria com categorias e comparação antes/depois.
- `/sobre`: apresentação da marca com informações fornecidas.
- `/contato`: contato e preparação de orçamento.
- `/privacidade`: informações sobre os dados do formulário e contato.
- `/admin`: painel administrativo protegido.
- `/admin/login`: login de administradores previamente autorizados.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha os valores do seu projeto.

- `NEXT_PUBLIC_SITE_URL`: origem final HTTPS do site, sem barra final.
- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto Supabase.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: chave pública publishable.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: compatibilidade com chave pública anon, quando aplicável.

Nunca use service role ou chave secreta em variáveis NEXT_PUBLIC. Elas são enviadas ao navegador. O projeto não precisa de service role para as operações normais.

Sem URL pública final, robots bloqueia indexação e sitemap fica vazio. Preencha a origem final antes de publicar. O site não depende de Vercel, Sites ou outra plataforma proprietária: pode ser servido por qualquer hospedagem compatível com Node.js/Next.js.

## Supabase

A configuração do projeto remoto fica para o proprietário. Os arquivos em `supabase/` preparam tabelas, permissões e conteúdo inicial.

1. Crie um projeto separado para a Garage 101.
2. Execute o schema e depois o seed fornecidos, seguindo os comentários dos arquivos SQL.
3. Em Auth, desative novos cadastros e login anônimo.
4. Crie o primeiro usuário manualmente em Auth e inclua seu UUID na lista `admin_users`, conforme o schema.
5. Preencha as variáveis de ambiente e reinicie o site.
6. Entre em `/admin/login`, cadastre um conteúdo e valide a leitura após recarregar a página.

O banco contém `services`, `gallery`, `testimonials`, `site_settings`, `leads` e a lista de administradores. Todas as tabelas expostas usam RLS. Conteúdo inativo não é público; leads não têm leitura pública. Autenticação sozinha não autoriza edição: o usuário também precisa estar na lista administrativa.

O bucket público `garage-media` armazena apenas imagens destinadas ao site. Não envie documentos privados. Uploads são restritos ao administrador, passam por limite de tamanho e validação de formato. A interface permite conferir a imagem antes de enviar.

Antes de colocar o formulário com armazenamento em produção, valide também controles de abuso/rate limit apropriados à hospedagem e a política de retenção de leads.

## Arquitetura

```text
src/app/
  (site)/            páginas e layout públicos
  admin/             painel e login
  api/               rotas de leads, gestão e upload
  globals.css        tokens e estilos públicos compartilhados
  layout.tsx         fontes, metadata e base HTML
  sitemap.ts         URLs públicas
  robots.ts          regras de indexação
  manifest.ts        manifesto
src/components/
  header.tsx         navegação responsiva e menu acessível
  footer.tsx         CTA, rodapé e WhatsApp flutuante
  motion.tsx         GSAP e ScrollTrigger
  ui.tsx             marca tipográfica, botões e rótulos
  before-after.tsx   comparação interativa por teclado/toque
  gallery.tsx        galeria e filtro
  contact-form.tsx   validação e mensagem de orçamento
  admin/             componentes do painel
src/lib/
  content.ts         conteúdo inicial aprovado
  types.ts           contratos compartilhados
  whatsapp.ts        telefone e mensagens codificadas
  data.ts            leitura pública e fallback sem configuração
  validation.ts      validação de entrada
  supabase/          clientes, sessão e autorização
public/images/       artes fornecidas, convertidas para WebP
supabase/            configuração SQL e seed
tests/               testes dos fluxos principais
```

A renderização pública usa Server Components. Estado no cliente se limita à navegação, animações, comparador, formulário e painel. Não há armazenamento fictício no navegador.

## Design e animações

Preto, grafite e cobre, com laranja reservado a acentos. Títulos em Barlow Condensed e corpo em Manrope. Tokens estão no início de `globals.css`. As três artes enviadas são preservadas como imagens originais de identidade, sem apresentá-las como fotografias de serviços realizados.

GSAP coordena a entrada do hero, revela títulos por linhas e usa máscara na arte principal. ScrollTrigger revela blocos e as cinco etapas do polimento. Os movimentos têm menor deslocamento no celular, parallax fica no desktop e `prefers-reduced-motion` é respeitado. O conteúdo permanece legível sem JavaScript.

As imagens têm dimensões reservadas, versões WebP, carregamento prioritário no hero e lazy loading nas demais posições. Não foram incluídos contadores ou avaliações fictícias.

## Como continuar

1. Configurar e validar o Supabase no ambiente final.
2. Substituir o estado vazio da galeria por imagens reais e autorizadas.
3. Cadastrar depoimentos somente com aprovação dos clientes.
4. Informar Instagram, endereço e horários reais em configurações.
5. Ajustar `NEXT_PUBLIC_SITE_URL` e validar metadata/links antes da publicação.
6. Executar lint, build e os testes após mudanças.
7. Manter os contratos em `types.ts`, validações, políticas RLS e formulários alinhados.

Os testes locais verificam rotas, responsividade, navegação, links de WhatsApp e o estado sem configuração. CRUD, autenticação e uploads no serviço remoto precisam de uma instância Supabase configurada para validação ponta a ponta; não são considerados validados apenas pelo build.
