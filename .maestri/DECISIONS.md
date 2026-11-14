# Decisões Técnicas

## AGENTS.md e Middleware no Next.js 16.3

### 1. Existência do AGENTS.md
O arquivo `AGENTS.md` existe e foi gerado automaticamente pelo Next.js 16.3 através do `create-next-app`. O arquivo é mantido na raiz do repositório conforme orientado pela convenção do framework e pelas diretrizes do projeto.

### 2. Nome do antigo middleware no Next.js 16.3
No Next.js 16, a convenção `middleware` foi descontinuada e renomeada para `proxy`.
O arquivo passa a ser `proxy.ts` (ou `proxy.js`), com a exportação da função nomeada `proxy`. O runtime padrão do `proxy` é `nodejs`.
