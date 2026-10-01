# 📋 CHANGELOG — DocenteIA

> Registro de todas as alterações do projeto. Sempre atualize após cada versão.

---

## v2.1 — 2025-01-XX
### ✨ Novidades
- Gabarito agora sai em **página separada** (PageBreak) — não precisa mais recortar
- Novos pictogramas: `camera` (FATO) e `coracao` (OPINIÃO) para atividades de Fato vs Opinião no AEE

### 🐛 Correções
- Corrigido bug `[object Object]` nas alternativas múltipla escolha
- Parser de alternativas agora aceita chaves em português (`texto`, `opcao`, `descricao`)
- Fonte de emoji universal (`Noto Color Emoji`) para funcionar no Linux da VPS

### 🔒 Segurança
- Chaves de API movidas para arquivo `.env` (não ficam mais no código)

---

## v2.0 — 2025-01-XX
- Versão inicial com geração de DOCX ilustrado
- Integração Pixabay + ARASAAC + SVGs próprios