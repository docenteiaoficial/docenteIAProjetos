# 📌 Workflows n8n — DocenteIA

## Arquivos desta pasta
- `subworkflow_gerador_atividades.json` → Sub-workflow que gera atividades

## Como importar no n8n
1. Abra seu n8n
2. Clique em "Workflows" → "Import from File"
3. Selecione o arquivo `.json`
4. Configure as credenciais:
   - OpenAI (gpt-4o)
   - Evolution API (WhatsApp)

## ⚠️ Antes de ativar
- No nó "Parse do JSON": remova qualquer chave Pixabay hardcoded.
  Use variáveis de ambiente do n8n.
- No nó "HTTP Request": atualize a URL do ngrok sempre que reiniciar o túnel.