# Estado do Projeto: Nadeon Labs (nadeon-web)

Data de referência: 14/11/2026.
Objetivo: Implementação do website e-commerce headless da Nadeon Labs (Next.js 16.3 + Tailwind v4 + Shopify Storefront).

## Fase Atual: Onda 0 (Fundação)
A onda 0 estabelece as bases estruturais, contratos de integração, sistema de design, pipeline de execução multiagente e automação de CI/CD.

### Status das Tarefas da Onda 0
- **W0-01:** Repositório e esqueleto inicial Next.js 16.3 (concluído / sincronizando deploy).
- **W0-02:** Tokens da marca, temas Human e Pet, tipografia Archivo e DM Sans (em andamento por Brasa).
- **W0-03:** Contratos de integração e implementações mock em lib/contracts (em andamento por Prumo).
- **W0-04:** Pipeline de CI, gates de validação e proteção do branch main (em andamento por Catraca).
- **W0-05:** Sistema central de tarefas, eventos, lock atômico e dashboard /pipeline (em andamento por Abaco).
- **W0-06:** Regras universais dos agentes em AGENTS.md (em andamento por Pena).
- **W0-07:** Prova de conceito e validação ponta a ponta em /dev/kit (backlog, aguarda W0-02 a W0-06).

## Ambiente e Infraestrutura
- Repositório central: robsonrodrigues01/nadeon-web
- Deploy contínuo: Vercel (projeto nadeon-web)
- Gerenciador de pacotes: pnpm v12
- Node.js runtime: v20 LTS
