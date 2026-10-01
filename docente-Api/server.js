/**
 * DocenteIA — API de Geração de Atividades Ilustradas
 * Versão: 2.0
 * 
 * Endpoints:
 *   POST /gerar-atividade  → recebe JSON da atividade, retorna DOCX em base64
 *   GET  /health           → health check para o EasyPanel
 */

const express = require('express');
const { gerarDocx } = require("./gerador_v3");

const app  = express();
const PORT = process.env.PORT || 3001;
const API_SECRET = process.env.DOCENTEIA_API_SECRET || 'teste123';

app.use(express.json({ limit: '10mb' }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ ok: true, servico: 'DocenteIA Gerador', versao: '2.0' });
});

// ── Middleware de autenticação simples ────────────────────────────────────────
app.use((req, res, next) => {
  const key = req.headers['x-api-key'];
  if (key !== API_SECRET) {
    return res.status(401).json({ ok: false, erro: 'Não autorizado' });
  }
  next();
});

// ── POST /gerar-atividade ─────────────────────────────────────────────────────
app.post('/gerar-atividade', async (req, res) => {
  const atividade = req.body;

  // Validação mínima
  if (!atividade || !atividade.niveis || !Array.isArray(atividade.niveis)) {
    return res.status(400).json({ ok: false, erro: 'JSON de atividade inválido' });
  }

  // Injeta Pixabay key do ambiente se não vier no body
  if (!atividade.pixabay_key) {
    atividade.pixabay_key = process.env.PIXABAY_API_KEY || '';
  }

  try {
    const resultado = await gerarDocx(atividade);
    res.json({
      ok: true,
      docx_base64: resultado.base64,
      nome_arquivo: resultado.nome,
      habilidade_bncc: resultado.habilidade,
      disciplina: atividade.disciplina,
      serie: atividade.serie,
      conteudo: atividade.conteudo
    });
  } catch (err) {
    console.error('[DocenteIA] Erro ao gerar atividade:', err.message);
    res.status(500).json({ ok: false, erro: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ DocenteIA API rodando na porta ${PORT}`);
});
