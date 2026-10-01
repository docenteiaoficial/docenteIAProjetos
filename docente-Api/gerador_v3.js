/**
 * DocenteIA — Gerador de DOCX v3.0
 * Cobertura total: Matemática, Português, Ciências, Física, Química,
 * História, Geografia, Inglês, Ed. Física, Ed. Especial
 */

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, ShadingType, ImageRun
} = require('docx');
const sharp = require('sharp');
const https = require('https');
const http  = require('http');
const svgs  = require('./svgs');

// ── Download ──────────────────────────────────────────────────────────────────
function downloadUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { timeout: 12000 }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// ── Pixabay ───────────────────────────────────────────────────────────────────
async function buscarPixabay(termo, apiKey) {
  if (!apiKey || !termo) return null;
  try {
    const q   = encodeURIComponent(termo);
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${q}&image_type=illustration&safesearch=true&per_page=5&order=popular`;
    const buf  = await downloadUrl(url);
    const json = JSON.parse(buf.toString());
    if (!json.hits || json.hits.length === 0) return null;
    return json.hits[0].webformatURL;
  } catch(e) {
    console.warn('[Pixabay]', termo, e.message);
    return null;
  }
}

// ── ARASAAC — pictogramas para Ed. Especial ───────────────────────────────────
async function buscarArasaac(termo, apiKey) {
  // A API key do Pixabay é reutilizada como flag; ARASAAC é sempre gratuito
  try {
    const url = `https://api.arasaac.org/v1/pictograms/pt/search/${encodeURIComponent(termo)}`;
    const buf  = await downloadUrl(url);
    const json = JSON.parse(buf.toString());
    if (!json || json.length === 0) return null;
    const id = json[0]._id;
    return `https://static.arasaac.org/pictograms/${id}/${id}_300.png`;
  } catch(e) {
    return null; // fallback para SVG próprio
  }
}

// ── SVG → PNG ─────────────────────────────────────────────────────────────────
async function svgParaPng(svgStr, largura) {
  const opt = largura ? { width: largura } : {};
  return await sharp(Buffer.from(svgStr)).resize(opt).png().toBuffer();
}

async function urlParaPng(url, largura = 400) {
  try {
    const buf = await downloadUrl(url);
    return await sharp(buf).resize({ width: largura, withoutEnlargement: true }).png().toBuffer();
  } catch(e) { return null; }
}

// ── Resolve ilustração ────────────────────────────────────────────────────────
async function resolverIlustracao(q, pixabayKey, modoAcessivel) {
  const tipo = (q.tipo_ilustracao || '').toLowerCase();
  const p    = q.ilustracao_params || {};

  try {
    // ── Matemática SVG ───────────────────────────────────────────────────────
    if (tipo === 'grupos') {
      const svg = svgs.svgGrupos(p.emoji||'laranja', p.grupos||2, p.por_grupo||3);
      const buf = await svgParaPng(svg);
      const meta = await sharp(buf).metadata();
      return { buf, w: Math.min(meta.width, 480), h: meta.height };
    }
    if (tipo === 'reta_numerica') {
      const svg = svgs.svgRetaNumerica(p.inicio??0, p.fim??12, p.passo??2, p.cor);
      const buf = await svgParaPng(svg);
      return { buf, w: 480, h: 95 };
    }
    if (tipo === 'geometria') {
      const svg = svgs.svgGeometria(p.forma||'triangulo');
      const buf = await svgParaPng(svg, 200);
      const meta = await sharp(buf).metadata();
      return { buf, w: meta.width, h: meta.height };
    }
    if (tipo === 'fracao') {
      const svg = svgs.svgFracao(p.numerador||1, p.denominador||4);
      const buf = await svgParaPng(svg);
      const meta = await sharp(buf).metadata();
      return { buf, w: Math.min(meta.width, 400), h: meta.height };
    }
    if (tipo === 'grafico') {
      const svg = svgs.svgGrafico(p.dados||[], p.titulo||'');
      const buf = await svgParaPng(svg);
      const meta = await sharp(buf).metadata();
      return { buf, w: Math.min(meta.width, 480), h: meta.height };
    }

    // ── Física SVG ───────────────────────────────────────────────────────────
    if (tipo === 'circuito') {
      const svg = svgs.svgCircuitoEletrico(p.tipo||'serie');
      const buf = await svgParaPng(svg);
      const meta = await sharp(buf).metadata();
      return { buf, w: meta.width, h: meta.height };
    }
    if (tipo === 'atomo') {
      const svg = svgs.svgModeloAtomico(p.modelo||'bohr');
      const buf = await svgParaPng(svg, 280);
      const meta = await sharp(buf).metadata();
      return { buf, w: meta.width, h: meta.height };
    }
    if (tipo === 'estados_materia') {
      const svg = svgs.svgEstadosMateria();
      const buf = await svgParaPng(svg);
      const meta = await sharp(buf).metadata();
      return { buf, w: meta.width, h: meta.height };
    }
    if (tipo === 'escala_ph') {
      const svg = svgs.svgEscalaPH();
      const buf = await svgParaPng(svg);
      return { buf, w: 520, h: 130 };
    }

    // ── Química SVG ──────────────────────────────────────────────────────────
    if (tipo === 'tabela_periodica') {
      const svg = svgs.svgTabelaPeriodica(p.elementos||[
        {simbolo:'H',nome:'Hidrogênio',numero:1,categoria:'nao-metais'},
        {simbolo:'He',nome:'Hélio',numero:2,categoria:'gases-nobres'},
        {simbolo:'O',nome:'Oxigênio',numero:8,categoria:'nao-metais'},
        {simbolo:'C',nome:'Carbono',numero:6,categoria:'nao-metais'},
        {simbolo:'Fe',nome:'Ferro',numero:26,categoria:'metais'},
        {simbolo:'Na',nome:'Sódio',numero:11,categoria:'metais'},
        {simbolo:'Au',nome:'Ouro',numero:79,categoria:'metais'},
        {simbolo:'Si',nome:'Silício',numero:14,categoria:'semimetais'},
      ]);
      const buf = await svgParaPng(svg);
      const meta = await sharp(buf).metadata();
      return { buf, w: Math.min(meta.width, 500), h: meta.height };
    }

    // ── Educação Física SVG ──────────────────────────────────────────────────
    if (tipo === 'quadra') {
      const svg = svgs.svgQuadraEsporte(p.esporte||'futebol');
      const buf = await svgParaPng(svg);
      const meta = await sharp(buf).metadata();
      return { buf, w: meta.width, h: meta.height };
    }
    if (tipo === 'tabela_pontos') {
      const svg = svgs.svgTabelaPontos(p.times||[]);
      const buf = await svgParaPng(svg);
      const meta = await sharp(buf).metadata();
      return { buf, w: meta.width, h: meta.height };
    }

    // ── Inglês SVG ───────────────────────────────────────────────────────────
    if (tipo === 'dialogo') {
      const svg = svgs.svgDialogo(p.falas||[]);
      const buf = await svgParaPng(svg);
      const meta = await sharp(buf).metadata();
      return { buf, w: meta.width, h: meta.height };
    }
    if (tipo === 'vocabulario') {
      const svg = svgs.svgVocabulario(p.palavras||[]);
      const buf = await svgParaPng(svg);
      const meta = await sharp(buf).metadata();
      return { buf, w: Math.min(meta.width, 500), h: meta.height };
    }

    // ── Educação Especial — Pictogramas ──────────────────────────────────────
    if (tipo === 'pictograma') {
      // Tenta ARASAAC primeiro, fallback para SVG próprio
      if (p.buscar_arasaac && pixabayKey) {
        const url = await buscarArasaac(p.conceito||'sim');
        if (url) {
          const buf = await urlParaPng(url, 120);
          if (buf) return { buf, w: 120, h: 140 };
        }
      }
      const svg = svgs.svgPictograma(p.conceito||'sim');
      const buf = await svgParaPng(svg);
      return { buf, w: 120, h: 140 };
    }
    if (tipo === 'grade_pictogramas') {
      const svg = svgs.svgGradePictogramas(p.conceitos||['sim','nao']);
      const buf = await svgParaPng(svg);
      const meta = await sharp(buf).metadata();
      return { buf, w: Math.min(meta.width, 500), h: meta.height };
    }

    // ── Pixabay para demais disciplinas ──────────────────────────────────────
    if (tipo === 'pixabay' && q.termo_busca) {
      const url = await buscarPixabay(q.termo_busca, pixabayKey);
      if (url) {
        const buf = await urlParaPng(url, modoAcessivel ? 340 : 380);
        if (buf) {
          const meta = await sharp(buf).metadata();
          const ratio = meta.height / meta.width;
          const w = modoAcessivel ? 340 : 380;
          return { buf, w, h: Math.round(w * ratio) };
        }
      }
    }
  } catch(e) {
    console.warn('[Ilustração]', tipo, e.message);
  }
  return null;
}

// ── Cores por nível ───────────────────────────────────────────────────────────
const NIVEL_CORES = { 1:'1B5E20', 2:'0D47A1', 3:'E65100', 4:'4A148C', 5:'B71C1C' };

// ── Gerador principal ─────────────────────────────────────────────────────────
async function gerarDocx(atividade) {
  const pixabayKey   = atividade.pixabay_key || '';
  const modoAcessivel = atividade.modo_acessivel === true;
  const elementos    = [];

  // Configurações de fonte para modo acessível
  const fontSize      = modoAcessivel ? 28 : 22;
  const fontSizeTit   = modoAcessivel ? 36 : 40;
  const fontSizeSub   = modoAcessivel ? 22 : 20;
  const spacingAfter  = modoAcessivel ? 200 : 100;

  // ── Cabeçalho ───────────────────────────────────────────────────────────────
  if (modoAcessivel) {
    elementos.push(new Paragraph({
      children: [new TextRun({ text: '♿ ATIVIDADE ADAPTADA — EDUCAÇÃO ESPECIAL', bold: true, size: 24, color: '4A148C' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 }
    }));
  }

  elementos.push(
    new Paragraph({
      children: [new TextRun({
        text: `ATIVIDADE — ${(atividade.conteudo||'').toUpperCase()}`,
        bold: true, size: fontSizeTit, color: 'C62828', font: 'Calibri'
      })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 }
    }),
    new Paragraph({
      children: [new TextRun({
        text: `${atividade.serie||''} · ${atividade.disciplina||''} · BNCC: ${atividade.habilidade_bncc||''}`,
        size: fontSizeSub, color: '666666', italics: true
      })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Nome: ', bold: true, size: fontSize }),
        new TextRun({ text: '_'.repeat(modoAcessivel?35:44), size: fontSize }),
        new TextRun({ text: '   Data: ', bold: true, size: fontSize }),
        new TextRun({ text: '_'.repeat(14), size: fontSize }),
      ],
      spacing: { after: spacingAfter }
    }),
    new Paragraph({
      children: [new TextRun({ text: `💡 ${atividade.dica_inicial||''}`, size: fontSizeSub, italics: true, color: '444444' })],
      spacing: { after: 260 },
      border: { bottom: { color: 'DDDDDD', size: 4, style: BorderStyle.SINGLE } }
    })
  );

  // ── Níveis e questões ────────────────────────────────────────────────────────
  for (const nivel of (atividade.niveis||[])) {
    const num   = nivel.numero || 1;
    const cor   = NIVEL_CORES[num] || '1B5E20';

    elementos.push(
      new Paragraph({ children: [], spacing: { before: 300, after: 0 } }),
      new Table({
        width: { size: 9200, type: WidthType.DXA },
        columnWidths: [9200],
        rows: [new TableRow({ children: [
          new TableCell({
            width: { size: 9200, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: cor },
            children: [new Paragraph({
              children: [new TextRun({
                text: `  Nível ${num} — ${nivel.titulo||''}`,
                bold: true, size: modoAcessivel ? 28 : 24, color: 'FFFFFF', font: 'Calibri'
              })],
              spacing: { before: 80, after: 80 }
            })]
          })
        ]})]
      }),
      new Paragraph({ children: [], spacing: { after: modoAcessivel ? 200 : 140 } })
    );

    for (const q of (nivel.questoes||[])) {
      // Enunciado
      elementos.push(new Paragraph({
        children: [
          new TextRun({ text: `${q.numero}. `, bold: true, size: fontSize + 2, color: cor }),
          new TextRun({ text: q.enunciado||'', size: fontSize })
        ],
        spacing: { before: modoAcessivel ? 200 : 140, after: modoAcessivel ? 160 : 120 }
      }));

      // Ilustração
      const img = await resolverIlustracao(q, pixabayKey, modoAcessivel);
      if (img && img.buf) {
        elementos.push(new Paragraph({
          children: [new ImageRun({ data: img.buf, type: 'png', transformation: { width: img.w, height: img.h } })],
          indent: { left: 360 },
          spacing: { after: modoAcessivel ? 160 : 120 }
        }));
      }

      // Alternativas
      if (q.alternativas && q.alternativas.length > 0) {
        for (const alt of q.alternativas) {
          elementos.push(new Paragraph({
            children: [new TextRun({ text: `   ${alt}`, size: fontSize })],
            indent: { left: 540 },
            spacing: { after: modoAcessivel ? 120 : 80 }
          }));
        }
        elementos.push(new Paragraph({
          children: [
            new TextRun({ text: '   Resposta: ', bold: true, size: fontSize }),
            new TextRun({ text: '_'.repeat(6), size: fontSize })
          ],
          indent: { left: 540 },
          spacing: { after: modoAcessivel ? 240 : 180 }
        }));
      }

      // Linha da conta (matemática)
      if (q.linha_resposta) {
        elementos.push(new Paragraph({
          children: [
            new TextRun({ text: '✏️  ', size: fontSize }),
            new TextRun({ text: q.linha_resposta, bold: true, size: fontSize + 6, color: cor, font: 'Courier New' })
          ],
          indent: { left: 360 },
          spacing: { after: modoAcessivel ? 240 : 180 }
        }));
      }

      // Linhas para dissertativa
      if (q.linhas_resposta && q.linhas_resposta > 0) {
        const qtd = modoAcessivel ? Math.max(q.linhas_resposta, 4) : q.linhas_resposta;
        for (let l = 0; l < qtd; l++) {
          elementos.push(new Paragraph({
            children: [new TextRun({ text: '_'.repeat(80), size: 18, color: 'CCCCCC' })],
            indent: { left: 360 },
            spacing: { after: modoAcessivel ? 140 : 100 }
          }));
        }
        elementos.push(new Paragraph({ children: [], spacing: { after: 80 } }));
      }
    }
  }

  // ── Gabarito ─────────────────────────────────────────────────────────────────
  if (atividade.gabarito && atividade.gabarito.length > 0) {
    elementos.push(
      new Paragraph({
        children: [],
        border: { top: { color: 'CCCCCC', size: 6, style: BorderStyle.DASHED } },
        spacing: { before: 500, after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: '📋 GABARITO — recortar antes de entregar', bold: true, size: 20, color: '888888' })],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({
          text: atividade.gabarito.map(g=>`Q${g.numero}: ${g.resposta}`).join('   |   '),
          size: 18, color: '666666', font: 'Courier New'
        })],
        spacing: { after: 160 }
      })
    );
  }

  // ── Rodapé ────────────────────────────────────────────────────────────────────
  elementos.push(new Paragraph({
    children: [new TextRun({
      text: `🌟 Gerado pelo DocenteIA · Alinhado à BNCC · Rede SEE-SP${modoAcessivel?' · Edição Acessível':''}`,
      size: 16, color: 'AAAAAA', italics: true
    })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 260 },
    border: { top: { color: 'EEEEEE', size: 4, style: BorderStyle.SINGLE } }
  }));

  // ── Compila ───────────────────────────────────────────────────────────────────
  const doc = new Document({ sections: [{ properties: {}, children: elementos }] });
  const buf = await Packer.toBuffer(doc);
  const base64 = buf.toString('base64');

  const nome = `Atividade_${(atividade.conteudo||'aula').replace(/\s+/g,'_')}${modoAcessivel?'_Acessivel':''}_${(atividade.serie||'').replace(/\s+/g,'')}.docx`
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9_.]/g,'');

  return { base64, nome, habilidade: atividade.habilidade_bncc||'' };
}

module.exports = { gerarDocx };
