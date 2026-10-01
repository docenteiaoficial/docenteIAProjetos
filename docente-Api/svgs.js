/**
 * DocenteIA — Biblioteca de SVGs Pedagógicos
 * Cobre: Matemática, Ciências, Física, Química, Ed. Física, Inglês, Ed. Especial
 */

// ── MATEMÁTICA ────────────────────────────────────────────────────────────────

function svgGrupos(emoji, grupos, porGrupo) {
  const EMOJIS = {
    laranja:'🍊', maca:'🍎', bola:'⚽', estrela:'⭐', livro:'📚',
    lapis:'✏️', flor:'🌸', peixe:'🐟', banana:'🍌', uva:'🍇',
    cenoura:'🥕', biscoito:'🍪', carro:'🚗', aviao:'✈️', casa:'🏠'
  };
  const s = EMOJIS[emoji] || '●';
  const cols = Math.min(porGrupo, 5), rows = Math.ceil(porGrupo / cols);
  const cw = 38, ch = 38, gap = 6;
  const boxW = cols*(cw+gap)+16, boxH = rows*(ch+gap)+32;
  const totalW = grupos*(boxW+12)+12, totalH = boxH+40;
  let shapes = '';
  for (let g = 0; g < grupos; g++) {
    const gx = 12+g*(boxW+12);
    shapes += `<rect x="${gx}" y="8" width="${boxW}" height="${boxH}" rx="8" fill="#FFF8E1" stroke="#FFD54F" stroke-width="2"/>`;
    shapes += `<text x="${gx+boxW/2}" y="${boxH+2}" text-anchor="middle" font-size="11" fill="#888" font-family="Arial">Grupo ${g+1}</text>`;
    let count = 0;
    for (let r = 0; r < rows && count < porGrupo; r++)
      for (let c = 0; c < cols && count < porGrupo; c++) {
        shapes += `<text x="${gx+8+c*(cw+gap)+cw/2}" y="${12+r*(ch+gap)+ch*0.78}" text-anchor="middle" font-size="26" font-family="Segoe UI Emoji,Apple Color Emoji,sans-serif">${s}</text>`;
        count++;
      }
  }
  shapes += `<text x="${totalW/2}" y="${totalH-6}" text-anchor="middle" font-size="15" fill="#E65100" font-weight="bold" font-family="Arial">${grupos} × ${porGrupo} = ?</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}"><rect width="${totalW}" height="${totalH}" fill="white"/>${shapes}</svg>`;
}

function svgRetaNumerica(inicio, fim, passo, cor='#1565C0') {
  const W=580, mx=28, y=58, esc=(W-mx*2)/(fim-inicio);
  let marcas='', nums='', saltos='';
  for (let i=inicio; i<=fim; i++) {
    const x=mx+(i-inicio)*esc;
    marcas+=`<line x1="${x}" y1="${y-7}" x2="${x}" y2="${y+7}" stroke="#555" stroke-width="1.5"/>`;
    nums+=`<text x="${x}" y="${y+22}" text-anchor="middle" font-size="12" fill="#333" font-family="Arial">${i}</text>`;
  }
  for (let i=inicio; i+passo<=fim; i+=passo) {
    const x1=mx+(i-inicio)*esc, x2=mx+(i+passo-inicio)*esc, mx2=(x1+x2)/2;
    saltos+=`<path d="M${x1} ${y-2} Q${mx2} ${y-34} ${x2} ${y-2}" fill="none" stroke="${cor}" stroke-width="2.5"/>`;
    saltos+=`<text x="${mx2}" y="${y-38}" text-anchor="middle" font-size="11" fill="${cor}" font-weight="bold" font-family="Arial">+${passo}</text>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="95"><rect width="${W}" height="95" fill="white"/>${saltos}<line x1="${mx}" y1="${y}" x2="${W-mx+12}" y2="${y}" stroke="#333" stroke-width="2"/><polygon points="${W-mx+12},${y-4} ${W-mx+20},${y} ${W-mx+12},${y+4}" fill="#333"/>${marcas}${nums}</svg>`;
}

function svgGeometria(forma) {
  const f = {
    triangulo:  {s:`<polygon points="150,20 280,190 20,190" fill="#E3F2FD" stroke="#1565C0" stroke-width="3"/>`,l:'Triângulo — 3 lados',h:230},
    quadrado:   {s:`<rect x="35" y="20" width="170" height="170" fill="#F3E5F5" stroke="#7B1FA2" stroke-width="3"/>`,l:'Quadrado — 4 lados',h:230},
    retangulo:  {s:`<rect x="10" y="55" width="280" height="120" fill="#E8F5E9" stroke="#2E7D32" stroke-width="3"/>`,l:'Retângulo — 4 lados',h:230},
    circulo:    {s:`<circle cx="150" cy="105" r="85" fill="#FFF8E1" stroke="#F57F17" stroke-width="3"/>`,l:'Círculo — sem lados',h:230},
    hexagono:   {s:`<polygon points="150,15 235,65 235,165 150,215 65,165 65,65" fill="#FCE4EC" stroke="#C62828" stroke-width="3"/>`,l:'Hexágono — 6 lados',h:250},
    pentagono:  {s:`<polygon points="150,15 250,85 215,195 85,195 50,85" fill="#E8EAF6" stroke="#3949AB" stroke-width="3"/>`,l:'Pentágono — 5 lados',h:240},
    losango:    {s:`<polygon points="150,20 270,110 150,200 30,110" fill="#E0F7FA" stroke="#00838F" stroke-width="3"/>`,l:'Losango — 4 lados',h:230},
    trapezio:   {s:`<polygon points="80,30 220,30 270,180 30,180" fill="#FFF3E0" stroke="#E65100" stroke-width="3"/>`,l:'Trapézio — 4 lados',h:220},
  }[forma] || {s:`<polygon points="150,20 280,190 20,190" fill="#E3F2FD" stroke="#1565C0" stroke-width="3"/>`,l:'Triângulo',h:230};
  return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="${f.h}"><rect width="300" height="${f.h}" fill="white"/>${f.s}<text x="150" y="${f.h-8}" text-anchor="middle" font-size="15" font-weight="bold" fill="#444" font-family="Arial">${f.l}</text></svg>`;
}

function svgFracao(numerador, denominador) {
  const cols=Math.min(denominador,8), rows=Math.ceil(denominador/cols);
  const cw=48, ch=48, gap=5, W=cols*(cw+gap)+20, H=rows*(ch+gap)+52;
  let partes='';
  for (let i=0; i<denominador; i++) {
    const c=i%cols, r=Math.floor(i/cols), x=10+c*(cw+gap), y=10+r*(ch+gap);
    partes+=`<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="5" fill="${i<numerador?'#FF8F00':'#FFF3E0'}" stroke="#FF8F00" stroke-width="2"/>`;
    if (i<numerador) partes+=`<text x="${x+cw/2}" y="${y+ch*0.68}" text-anchor="middle" font-size="20" fill="white" font-family="Arial">✓</text>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="white"/>${partes}<text x="${W/2}" y="${H-6}" text-anchor="middle" font-size="18" fill="#E65100" font-weight="bold" font-family="Arial">${numerador}/${denominador} pintado</text></svg>`;
}

function svgGrafico(dados, titulo) {
  const maxVal=Math.max(...dados.map(d=>d.valor));
  const barW=50, barGap=20, mL=40, mB=40, chartH=160;
  const W=dados.length*(barW+barGap)+mL+20, H=chartH+mB+30;
  const cores=['#1565C0','#2E7D32','#E65100','#7B1FA2','#C62828','#F57F17'];
  let barras='';
  dados.forEach((d,i)=>{
    const x=mL+i*(barW+barGap), bH=Math.round((d.valor/maxVal)*chartH), y=mB+(chartH-bH);
    barras+=`<rect x="${x}" y="${y}" width="${barW}" height="${bH}" fill="${cores[i%cores.length]}" rx="4"/>`;
    barras+=`<text x="${x+barW/2}" y="${y-5}" text-anchor="middle" font-size="12" fill="#333" font-family="Arial">${d.valor}</text>`;
    barras+=`<text x="${x+barW/2}" y="${H-8}" text-anchor="middle" font-size="11" fill="#555" font-family="Arial">${d.label}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="white"/><line x1="${mL-5}" y1="${mB}" x2="${mL-5}" y2="${mB+chartH}" stroke="#333" stroke-width="2"/><line x1="${mL-5}" y1="${mB+chartH}" x2="${W-10}" y2="${mB+chartH}" stroke="#333" stroke-width="2"/>${barras}<text x="${W/2}" y="18" text-anchor="middle" font-size="13" font-weight="bold" fill="#333" font-family="Arial">${titulo||''}</text></svg>`;
}

// ── FÍSICA ────────────────────────────────────────────────────────────────────

function svgCircuitoEletrico(tipo) {
  // serie ou paralelo
  if (tipo === 'paralelo') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="220">
      <rect width="500" height="220" fill="white"/>
      <!-- Fios externos -->
      <line x1="40" y1="50" x2="40" y2="170" stroke="#333" stroke-width="3"/>
      <line x1="460" y1="50" x2="460" y2="170" stroke="#333" stroke-width="3"/>
      <line x1="40" y1="50" x2="460" y2="50" stroke="#333" stroke-width="3"/>
      <line x1="40" y1="170" x2="460" y2="170" stroke="#333" stroke-width="3"/>
      <!-- Ramo 1: Lâmpada -->
      <line x1="160" y1="50" x2="160" y2="80" stroke="#333" stroke-width="3"/>
      <circle cx="160" cy="100" r="20" fill="none" stroke="#F57F17" stroke-width="3"/>
      <line x1="148" y1="88" x2="172" y2="112" stroke="#F57F17" stroke-width="2"/>
      <line x1="148" y1="112" x2="172" y2="88" stroke="#F57F17" stroke-width="2"/>
      <line x1="160" y1="120" x2="160" y2="170" stroke="#333" stroke-width="3"/>
      <text x="160" y="145" text-anchor="middle" font-size="11" fill="#888" font-family="Arial">Lâmpada 1</text>
      <!-- Ramo 2: Lâmpada -->
      <line x1="340" y1="50" x2="340" y2="80" stroke="#333" stroke-width="3"/>
      <circle cx="340" cy="100" r="20" fill="none" stroke="#F57F17" stroke-width="3"/>
      <line x1="328" y1="88" x2="352" y2="112" stroke="#F57F17" stroke-width="2"/>
      <line x1="328" y1="112" x2="352" y2="88" stroke="#F57F17" stroke-width="2"/>
      <line x1="340" y1="120" x2="340" y2="170" stroke="#333" stroke-width="3"/>
      <text x="340" y="145" text-anchor="middle" font-size="11" fill="#888" font-family="Arial">Lâmpada 2</text>
      <!-- Bateria -->
      <line x1="40" y1="110" x2="65" y2="110" stroke="#333" stroke-width="3"/>
      <line x1="65" y1="95" x2="65" y2="125" stroke="#1565C0" stroke-width="5"/>
      <line x1="75" y1="100" x2="75" y2="120" stroke="#1565C0" stroke-width="3"/>
      <line x1="75" y1="110" x2="100" y2="110" stroke="#333" stroke-width="3"/>
      <text x="70" y="145" text-anchor="middle" font-size="11" fill="#1565C0" font-family="Arial">Bateria</text>
      <text x="250" y="205" text-anchor="middle" font-size="14" font-weight="bold" fill="#444" font-family="Arial">Circuito em Paralelo</text>
    </svg>`;
  }
  // Série (padrão)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="200">
    <rect width="500" height="200" fill="white"/>
    <line x1="40" y1="100" x2="90" y2="100" stroke="#333" stroke-width="3"/>
    <!-- Bateria -->
    <line x1="90" y1="80" x2="90" y2="120" stroke="#1565C0" stroke-width="5"/>
    <line x1="100" y1="88" x2="100" y2="112" stroke="#1565C0" stroke-width="3"/>
    <line x1="100" y1="100" x2="150" y2="100" stroke="#333" stroke-width="3"/>
    <text x="95" y="140" text-anchor="middle" font-size="11" fill="#1565C0" font-family="Arial">Bateria</text>
    <!-- Resistor -->
    <line x1="150" y1="100" x2="170" y2="100" stroke="#333" stroke-width="3"/>
    <rect x="170" y="88" width="60" height="24" fill="#FFF3E0" stroke="#E65100" stroke-width="2" rx="3"/>
    <line x1="230" y1="100" x2="250" y2="100" stroke="#333" stroke-width="3"/>
    <text x="200" y="128" text-anchor="middle" font-size="11" fill="#E65100" font-family="Arial">Resistor</text>
    <!-- Lâmpada -->
    <line x1="250" y1="100" x2="280" y2="100" stroke="#333" stroke-width="3"/>
    <circle cx="300" cy="100" r="20" fill="none" stroke="#F57F17" stroke-width="3"/>
    <line x1="288" y1="88" x2="312" y2="112" stroke="#F57F17" stroke-width="2"/>
    <line x1="288" y1="112" x2="312" y2="88" stroke="#F57F17" stroke-width="2"/>
    <line x1="320" y1="100" x2="350" y2="100" stroke="#333" stroke-width="3"/>
    <text x="300" y="128" text-anchor="middle" font-size="11" fill="#F57F17" font-family="Arial">Lâmpada</text>
    <!-- Chave -->
    <line x1="350" y1="100" x2="380" y2="100" stroke="#333" stroke-width="3"/>
    <circle cx="380" cy="100" r="4" fill="#333"/>
    <line x1="380" y1="100" x2="410" y2="82" stroke="#333" stroke-width="3"/>
    <circle cx="410" cy="80" r="4" fill="#333"/>
    <line x1="410" y1="100" x2="460" y2="100" stroke="#333" stroke-width="3"/>
    <text x="395" y="128" text-anchor="middle" font-size="11" fill="#555" font-family="Arial">Chave</text>
    <!-- Fios retorno -->
    <line x1="40" y1="100" x2="40" y2="160" stroke="#333" stroke-width="3"/>
    <line x1="40" y1="160" x2="460" y2="160" stroke="#333" stroke-width="3"/>
    <line x1="460" y1="160" x2="460" y2="100" stroke="#333" stroke-width="3"/>
    <text x="250" y="190" text-anchor="middle" font-size="14" font-weight="bold" fill="#444" font-family="Arial">Circuito em Série</text>
  </svg>`;
}

function svgModeloAtomico(tipo) {
  const modelos = {
    bohr: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
      <rect width="300" height="300" fill="white"/>
      <!-- Núcleo -->
      <circle cx="150" cy="150" r="25" fill="#C62828" opacity="0.9"/>
      <text x="150" y="155" text-anchor="middle" font-size="12" fill="white" font-weight="bold" font-family="Arial">Núcleo</text>
      <!-- Órbitas -->
      <ellipse cx="150" cy="150" rx="60" ry="60" fill="none" stroke="#1565C0" stroke-width="1.5" stroke-dasharray="4,3"/>
      <ellipse cx="150" cy="150" rx="100" ry="100" fill="none" stroke="#1565C0" stroke-width="1.5" stroke-dasharray="4,3"/>
      <ellipse cx="150" cy="150" rx="135" ry="135" fill="none" stroke="#1565C0" stroke-width="1.5" stroke-dasharray="4,3"/>
      <!-- Elétrons -->
      <circle cx="210" cy="150" r="7" fill="#1565C0"/>
      <circle cx="90" cy="150" r="7" fill="#1565C0"/>
      <circle cx="150" cy="50" r="7" fill="#2E7D32"/>
      <circle cx="150" cy="250" r="7" fill="#2E7D32"/>
      <circle cx="252" cy="97" r="7" fill="#7B1FA2"/>
      <circle cx="48" cy="203" r="7" fill="#7B1FA2"/>
      <text x="150" y="292" text-anchor="middle" font-size="13" font-weight="bold" fill="#444" font-family="Arial">Modelo de Bohr</text>
      <text x="220" y="155" font-size="10" fill="#1565C0" font-family="Arial">e⁻</text>
    </svg>`,
    thomson: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
      <rect width="300" height="300" fill="white"/>
      <circle cx="150" cy="145" r="110" fill="#FFECB3" stroke="#F57F17" stroke-width="3"/>
      <text x="150" y="85" text-anchor="middle" font-size="12" fill="#E65100" font-family="Arial">Carga positiva</text>
      <circle cx="110" cy="120" r="10" fill="#1565C0"/><text x="110" y="125" text-anchor="middle" font-size="9" fill="white" font-family="Arial">e⁻</text>
      <circle cx="180" cy="110" r="10" fill="#1565C0"/><text x="180" y="115" text-anchor="middle" font-size="9" fill="white" font-family="Arial">e⁻</text>
      <circle cx="150" cy="160" r="10" fill="#1565C0"/><text x="150" y="165" text-anchor="middle" font-size="9" fill="white" font-family="Arial">e⁻</text>
      <circle cx="120" cy="185" r="10" fill="#1565C0"/><text x="120" y="190" text-anchor="middle" font-size="9" fill="white" font-family="Arial">e⁻</text>
      <circle cx="185" cy="175" r="10" fill="#1565C0"/><text x="185" y="180" text-anchor="middle" font-size="9" fill="white" font-family="Arial">e⁻</text>
      <text x="150" y="285" text-anchor="middle" font-size="13" font-weight="bold" fill="#444" font-family="Arial">Modelo de Thomson</text>
    </svg>`
  };
  return modelos[tipo] || modelos.bohr;
}

function svgEstadosMateria() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="200">
    <rect width="520" height="200" fill="white"/>
    <!-- Sólido -->
    <rect x="20" y="30" width="120" height="120" rx="8" fill="#E3F2FD" stroke="#1565C0" stroke-width="2"/>
    ${[0,1,2,3].map(r=>[0,1,2,3].map(c=>`<circle cx="${42+c*28}" cy="${52+r*28}" r="9" fill="#1565C0" opacity="0.8"/>`).join('')).join('')}
    <text x="80" y="172" text-anchor="middle" font-size="14" font-weight="bold" fill="#1565C0" font-family="Arial">Sólido</text>
    <!-- Seta -->
    <text x="168" y="100" font-size="28" fill="#555" font-family="Arial">→</text>
    <!-- Líquido -->
    <rect x="200" y="30" width="120" height="120" rx="8" fill="#E8F5E9" stroke="#2E7D32" stroke-width="2"/>
    <circle cx="228" cy="75" r="9" fill="#2E7D32" opacity="0.8"/>
    <circle cx="258" cy="95" r="9" fill="#2E7D32" opacity="0.8"/>
    <circle cx="242" cy="118" r="9" fill="#2E7D32" opacity="0.8"/>
    <circle cx="275" cy="70" r="9" fill="#2E7D32" opacity="0.8"/>
    <circle cx="295" cy="110" r="9" fill="#2E7D32" opacity="0.8"/>
    <circle cx="222" cy="135" r="9" fill="#2E7D32" opacity="0.8"/>
    <circle cx="268" cy="140" r="9" fill="#2E7D32" opacity="0.8"/>
    <circle cx="305" cy="85" r="9" fill="#2E7D32" opacity="0.8"/>
    <text x="260" y="172" text-anchor="middle" font-size="14" font-weight="bold" fill="#2E7D32" font-family="Arial">Líquido</text>
    <!-- Seta -->
    <text x="348" y="100" font-size="28" fill="#555" font-family="Arial">→</text>
    <!-- Gasoso -->
    <rect x="380" y="30" width="120" height="120" rx="8" fill="#FCE4EC" stroke="#C62828" stroke-width="2"/>
    <circle cx="405" cy="55" r="9" fill="#C62828" opacity="0.7"/>
    <circle cx="470" cy="48" r="9" fill="#C62828" opacity="0.7"/>
    <circle cx="490" cy="90" r="9" fill="#C62828" opacity="0.7"/>
    <circle cx="415" cy="125" r="9" fill="#C62828" opacity="0.7"/>
    <circle cx="460" cy="140" r="9" fill="#C62828" opacity="0.7"/>
    <circle cx="430" cy="85" r="9" fill="#C62828" opacity="0.4"/>
    <text x="440" y="172" text-anchor="middle" font-size="14" font-weight="bold" fill="#C62828" font-family="Arial">Gasoso</text>
  </svg>`;
}

function svgEscalaPH() {
  const cores = ['#C62828','#D32F2F','#E53935','#F57F17','#F9A825','#FBC02D','#AFB42B','#7CB342','#43A047','#2E7D32','#1B5E20','#1565C0','#0D47A1','#880E4F'];
  const W = 560, barH = 50;
  let barras = '', nums = '', labels = '';
  cores.forEach((c,i)=>{
    const x = 20+i*37;
    barras+=`<rect x="${x}" y="40" width="36" height="${barH}" fill="${c}"/>`;
    nums+=`<text x="${x+18}" y="${40+barH+18}" text-anchor="middle" font-size="12" fill="#333" font-family="Arial">${i}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="130">
    <rect width="${W}" height="130" fill="white"/>
    ${barras}${nums}
    <text x="100" y="28" text-anchor="middle" font-size="12" fill="#C62828" font-weight="bold" font-family="Arial">← Ácido</text>
    <text x="280" y="28" text-anchor="middle" font-size="12" fill="#7CB342" font-weight="bold" font-family="Arial">Neutro</text>
    <text x="460" y="28" text-anchor="middle" font-size="12" fill="#1565C0" font-weight="bold" font-family="Arial">Base →</text>
    <text x="${W/2}" y="120" text-anchor="middle" font-size="14" font-weight="bold" fill="#444" font-family="Arial">Escala de pH (0 a 14)</text>
  </svg>`;
}

function svgTabelaPeriodica(elementos) {
  // elementos = [{ simbolo, nome, numero, grupo, periodo, categoria }]
  // categoria: metais, nao-metais, gases-nobres, semimetais
  const cores = {
    'metais': '#BBDEFB', 'nao-metais': '#C8E6C9',
    'gases-nobres': '#F8BBD0', 'semimetais': '#FFE0B2',
    'default': '#F5F5F5'
  };
  const cellW=70, cellH=80, cols=4, gap=8;
  const W = cols*(cellW+gap)+gap, H = Math.ceil(elementos.length/cols)*(cellH+gap)+gap+30;
  let cells='';
  elementos.forEach((el,i)=>{
    const c=i%cols, r=Math.floor(i/cols);
    const x=gap+c*(cellW+gap), y=gap+r*(cellH+gap);
    const cor=cores[el.categoria]||cores.default;
    cells+=`<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" rx="6" fill="${cor}" stroke="#CCC" stroke-width="1.5"/>`;
    cells+=`<text x="${x+8}" y="${y+16}" font-size="11" fill="#666" font-family="Arial">${el.numero}</text>`;
    cells+=`<text x="${x+cellW/2}" y="${y+50}" text-anchor="middle" font-size="26" font-weight="bold" fill="#333" font-family="Arial">${el.simbolo}</text>`;
    cells+=`<text x="${x+cellW/2}" y="${y+70}" text-anchor="middle" font-size="10" fill="#555" font-family="Arial">${el.nome}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="white"/>${cells}<text x="${W/2}" y="${H-4}" text-anchor="middle" font-size="12" font-weight="bold" fill="#444" font-family="Arial">Tabela Periódica — Elementos Selecionados</text></svg>`;
}

// ── EDUCAÇÃO FÍSICA ───────────────────────────────────────────────────────────

function svgQuadraEsporte(esporte) {
  const quadras = {
    futebol: `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="320">
      <rect width="500" height="320" fill="white"/>
      <rect x="30" y="30" width="440" height="260" fill="#4CAF50" stroke="#fff" stroke-width="3"/>
      <line x1="250" y1="30" x2="250" y2="290" stroke="white" stroke-width="2"/>
      <circle cx="250" cy="160" r="40" fill="none" stroke="white" stroke-width="2"/>
      <circle cx="250" cy="160" r="4" fill="white"/>
      <rect x="30" y="110" width="60" height="100" fill="none" stroke="white" stroke-width="2"/>
      <rect x="410" y="110" width="60" height="100" fill="none" stroke="white" stroke-width="2"/>
      <rect x="30" y="130" width="25" height="60" fill="none" stroke="white" stroke-width="2"/>
      <rect x="445" y="130" width="25" height="60" fill="none" stroke="white" stroke-width="2"/>
      <text x="250" y="308" text-anchor="middle" font-size="14" font-weight="bold" fill="#444" font-family="Arial">Quadra de Futebol</text>
    </svg>`,
    basquete: `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="300">
      <rect width="500" height="300" fill="white"/>
      <rect x="30" y="25" width="440" height="240" fill="#FFCC80" stroke="#E65100" stroke-width="3"/>
      <line x1="250" y1="25" x2="250" y2="265" stroke="#E65100" stroke-width="2"/>
      <circle cx="250" cy="145" r="45" fill="none" stroke="#E65100" stroke-width="2"/>
      <circle cx="250" cy="145" r="4" fill="#E65100"/>
      <rect x="30" y="85" width="100" height="120" fill="none" stroke="#E65100" stroke-width="2"/>
      <rect x="370" y="85" width="100" height="120" fill="none" stroke="#E65100" stroke-width="2"/>
      <circle cx="130" cy="145" r="30" fill="none" stroke="#E65100" stroke-width="2"/>
      <circle cx="370" cy="145" r="30" fill="none" stroke="#E65100" stroke-width="2"/>
      <!-- Cestas -->
      <line x1="30" y1="145" x2="55" y2="145" stroke="#C62828" stroke-width="3"/>
      <circle cx="60" cy="145" r="8" fill="none" stroke="#C62828" stroke-width="3"/>
      <line x1="470" y1="145" x2="445" y2="145" stroke="#C62828" stroke-width="3"/>
      <circle cx="440" cy="145" r="8" fill="none" stroke="#C62828" stroke-width="3"/>
      <text x="250" y="285" text-anchor="middle" font-size="14" font-weight="bold" fill="#444" font-family="Arial">Quadra de Basquete</text>
    </svg>`,
    volei: `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="280">
      <rect width="500" height="280" fill="white"/>
      <rect x="30" y="25" width="440" height="220" fill="#E3F2FD" stroke="#1565C0" stroke-width="3"/>
      <!-- Rede -->
      <line x1="250" y1="25" x2="250" y2="245" stroke="#333" stroke-width="4"/>
      <line x1="220" y1="25" x2="220" y2="245" stroke="#CCC" stroke-width="1" stroke-dasharray="4,4"/>
      <line x1="280" y1="25" x2="280" y2="245" stroke="#CCC" stroke-width="1" stroke-dasharray="4,4"/>
      <!-- Linhas de ataque -->
      <line x1="30" y1="98" x2="218" y2="98" stroke="#1565C0" stroke-width="2" stroke-dasharray="6,4"/>
      <line x1="282" y1="98" x2="470" y2="98" stroke="#1565C0" stroke-width="2" stroke-dasharray="6,4"/>
      <line x1="30" y1="172" x2="218" y2="172" stroke="#1565C0" stroke-width="2" stroke-dasharray="6,4"/>
      <line x1="282" y1="172" x2="470" y2="172" stroke="#1565C0" stroke-width="2" stroke-dasharray="6,4"/>
      <text x="130" y="262" text-anchor="middle" font-size="11" fill="#666" font-family="Arial">Time A</text>
      <text x="370" y="262" text-anchor="middle" font-size="11" fill="#666" font-family="Arial">Time B</text>
      <text x="250" y="275" text-anchor="middle" font-size="14" font-weight="bold" fill="#444" font-family="Arial">Quadra de Vôlei</text>
    </svg>`
  };
  return quadras[esporte] || quadras.futebol;
}

function svgTabelaPontos(times) {
  // times = [{ nome, vitorias, derrotas, pontos }]
  const rowH=36, W=460, H=times.length*rowH+60;
  let rows='';
  times.forEach((t,i)=>{
    const y=50+i*rowH;
    const bg=i%2===0?'#F5F5F5':'#FFFFFF';
    rows+=`<rect x="10" y="${y}" width="${W-20}" height="${rowH}" fill="${bg}"/>`;
    rows+=`<text x="30" y="${y+23}" font-size="14" fill="#333" font-family="Arial">${i+1}. ${t.nome}</text>`;
    rows+=`<text x="270" y="${y+23}" text-anchor="middle" font-size="14" fill="#2E7D32" font-family="Arial">${t.vitorias}</text>`;
    rows+=`<text x="340" y="${y+23}" text-anchor="middle" font-size="14" fill="#C62828" font-family="Arial">${t.derrotas}</text>`;
    rows+=`<text x="420" y="${y+23}" text-anchor="middle" font-size="14" font-weight="bold" fill="#1565C0" font-family="Arial">${t.pontos}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="white"/>
    <rect x="10" y="10" width="${W-20}" height="36" fill="#1565C0" rx="6"/>
    <text x="30" y="33" font-size="14" font-weight="bold" fill="white" font-family="Arial">Time</text>
    <text x="270" y="33" text-anchor="middle" font-size="14" font-weight="bold" fill="white" font-family="Arial">V</text>
    <text x="340" y="33" text-anchor="middle" font-size="14" font-weight="bold" fill="white" font-family="Arial">D</text>
    <text x="420" y="33" text-anchor="middle" font-size="14" font-weight="bold" fill="white" font-family="Arial">Pts</text>
    ${rows}
  </svg>`;
}

// ── INGLÊS ────────────────────────────────────────────────────────────────────

function svgDialogo(falas) {
  // falas = [{ personagem, texto, lado }] lado: 'esquerda' | 'direita'
  const W=500, rowH=80;
  const H=falas.length*rowH+20;
  let baloes='';
  falas.forEach((f,i)=>{
    const y=10+i*rowH;
    const dir=f.lado==='direita';
    const bx=dir?280:20, by=y+10, bw=200, bh=50;
    const cor=dir?'#E8F5E9':'#E3F2FD';
    const borCor=dir?'#2E7D32':'#1565C0';
    baloes+=`<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="12" fill="${cor}" stroke="${borCor}" stroke-width="2"/>`;
    // Ponteiro do balão
    if (dir) baloes+=`<polygon points="${bx},${by+20} ${bx-10},${by+30} ${bx},${by+38}" fill="${cor}" stroke="${borCor}" stroke-width="2"/>`;
    else baloes+=`<polygon points="${bx+bw},${by+20} ${bx+bw+10},${by+30} ${bx+bw},${by+38}" fill="${cor}" stroke="${borCor}" stroke-width="2"/>`;
    baloes+=`<text x="${bx+bw/2}" y="${by+22}" text-anchor="middle" font-size="11" font-weight="bold" fill="${borCor}" font-family="Arial">${f.personagem}:</text>`;
    baloes+=`<text x="${bx+bw/2}" y="${by+40}" text-anchor="middle" font-size="12" fill="#333" font-family="Arial">${f.texto}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="white"/>${baloes}</svg>`;
}

function svgVocabulario(palavras) {
  // palavras = [{ en, pt, emoji }]
  const cols=3, cellW=140, cellH=80, gap=10;
  const rows=Math.ceil(palavras.length/cols);
  const W=cols*(cellW+gap)+gap, H=rows*(cellH+gap)+gap+20;
  let cells='';
  const cores=['#E3F2FD','#E8F5E9','#FFF3E0','#F3E5F5','#FCE4EC','#E0F2F1'];
  palavras.forEach((p,i)=>{
    const c=i%cols, r=Math.floor(i/cols);
    const x=gap+c*(cellW+gap), y=gap+r*(cellH+gap);
    cells+=`<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" rx="8" fill="${cores[i%cores.length]}" stroke="#DDD" stroke-width="1.5"/>`;
    cells+=`<text x="${x+cellW/2}" y="${y+28}" text-anchor="middle" font-size="24" font-family="Segoe UI Emoji,sans-serif">${p.emoji||'📝'}</text>`;
    cells+=`<text x="${x+cellW/2}" y="${y+52}" text-anchor="middle" font-size="14" font-weight="bold" fill="#333" font-family="Arial">${p.en}</text>`;
    cells+=`<text x="${x+cellW/2}" y="${y+70}" text-anchor="middle" font-size="11" fill="#666" font-family="Arial">${p.pt}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="white"/>${cells}</svg>`;
}

// ── EDUCAÇÃO ESPECIAL — PICTOGRAMAS SVG PRÓPRIOS ──────────────────────────────

function svgPictograma(conceito) {
  const pictogramas = {
    sim: `<g>
      <circle cx="60" cy="60" r="55" fill="#E8F5E9" stroke="#2E7D32" stroke-width="4"/>
      <polyline points="30,60 50,80 90,35" stroke="#2E7D32" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="60" y="128" text-anchor="middle" font-size="16" font-weight="bold" fill="#2E7D32" font-family="Arial">SIM</text>
    </g>`,
    nao: `<g>
      <circle cx="60" cy="60" r="55" fill="#FCE4EC" stroke="#C62828" stroke-width="4"/>
      <line x1="35" y1="35" x2="85" y2="85" stroke="#C62828" stroke-width="8" stroke-linecap="round"/>
      <line x1="85" y1="35" x2="35" y2="85" stroke="#C62828" stroke-width="8" stroke-linecap="round"/>
      <text x="60" y="128" text-anchor="middle" font-size="16" font-weight="bold" fill="#C62828" font-family="Arial">NÃO</text>
    </g>`,
    comer: `<g>
      <circle cx="60" cy="60" r="55" fill="#FFF3E0" stroke="#E65100" stroke-width="3"/>
      <text x="60" y="80" text-anchor="middle" font-size="50" font-family="Segoe UI Emoji,sans-serif">🍽️</text>
      <text x="60" y="128" text-anchor="middle" font-size="16" font-weight="bold" fill="#E65100" font-family="Arial">COMER</text>
    </g>`,
    beber: `<g>
      <circle cx="60" cy="60" r="55" fill="#E3F2FD" stroke="#1565C0" stroke-width="3"/>
      <text x="60" y="80" text-anchor="middle" font-size="50" font-family="Segoe UI Emoji,sans-serif">🥤</text>
      <text x="60" y="128" text-anchor="middle" font-size="16" font-weight="bold" fill="#1565C0" font-family="Arial">BEBER</text>
    </g>`,
    dormir: `<g>
      <circle cx="60" cy="60" r="55" fill="#EDE7F6" stroke="#4527A0" stroke-width="3"/>
      <text x="60" y="80" text-anchor="middle" font-size="50" font-family="Segoe UI Emoji,sans-serif">😴</text>
      <text x="60" y="128" text-anchor="middle" font-size="16" font-weight="bold" fill="#4527A0" font-family="Arial">DORMIR</text>
    </g>`,
    banheiro: `<g>
      <circle cx="60" cy="60" r="55" fill="#E0F7FA" stroke="#006064" stroke-width="3"/>
      <text x="60" y="80" text-anchor="middle" font-size="50" font-family="Segoe UI Emoji,sans-serif">🚽</text>
      <text x="60" y="128" text-anchor="middle" font-size="16" font-weight="bold" fill="#006064" font-family="Arial">BANHEIRO</text>
    </g>`,
    ajuda: `<g>
      <circle cx="60" cy="60" r="55" fill="#FFF8E1" stroke="#F57F17" stroke-width="3"/>
      <text x="60" y="80" text-anchor="middle" font-size="50" font-family="Segoe UI Emoji,sans-serif">🤚</text>
      <text x="60" y="128" text-anchor="middle" font-size="16" font-weight="bold" fill="#F57F17" font-family="Arial">AJUDA</text>
    </g>`,
    feliz: `<g>
      <circle cx="60" cy="60" r="55" fill="#FFFDE7" stroke="#F9A825" stroke-width="3"/>
      <text x="60" y="80" text-anchor="middle" font-size="50" font-family="Segoe UI Emoji,sans-serif">😊</text>
      <text x="60" y="128" text-anchor="middle" font-size="16" font-weight="bold" fill="#F9A825" font-family="Arial">FELIZ</text>
    </g>`,
    triste: `<g>
      <circle cx="60" cy="60" r="55" fill="#E8EAF6" stroke="#283593" stroke-width="3"/>
      <text x="60" y="80" text-anchor="middle" font-size="50" font-family="Segoe UI Emoji,sans-serif">😢</text>
      <text x="60" y="128" text-anchor="middle" font-size="16" font-weight="bold" fill="#283593" font-family="Arial">TRISTE</text>
    </g>`,
    escola: `<g>
      <circle cx="60" cy="60" r="55" fill="#E8F5E9" stroke="#1B5E20" stroke-width="3"/>
      <text x="60" y="80" text-anchor="middle" font-size="50" font-family="Segoe UI Emoji,sans-serif">🏫</text>
      <text x="60" y="128" text-anchor="middle" font-size="16" font-weight="bold" fill="#1B5E20" font-family="Arial">ESCOLA</text>
    </g>`,
    casa: `<g>
      <circle cx="60" cy="60" r="55" fill="#FCE4EC" stroke="#880E4F" stroke-width="3"/>
      <text x="60" y="80" text-anchor="middle" font-size="50" font-family="Segoe UI Emoji,sans-serif">🏠</text>
      <text x="60" y="128" text-anchor="middle" font-size="16" font-weight="bold" fill="#880E4F" font-family="Arial">CASA</text>
    </g>`,
    brincar: `<g>
      <circle cx="60" cy="60" r="55" fill="#E3F2FD" stroke="#0D47A1" stroke-width="3"/>
      <text x="60" y="80" text-anchor="middle" font-size="50" font-family="Segoe UI Emoji,sans-serif">⚽</text>
      <text x="60" y="128" text-anchor="middle" font-size="16" font-weight="bold" fill="#0D47A1" font-family="Arial">BRINCAR</text>
    </g>`,
  };

  const shape = pictogramas[conceito];
  if (!shape) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="140">
      <rect width="120" height="140" fill="white"/>
      <circle cx="60" cy="60" r="55" fill="#F5F5F5" stroke="#CCC" stroke-width="3"/>
      <text x="60" y="65" text-anchor="middle" font-size="12" fill="#888" font-family="Arial">${conceito}</text>
    </svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="140">
    <rect width="120" height="140" fill="white"/>${shape}</svg>`;
}

function svgGradePictogramas(conceitos) {
  // Grade de múltiplos pictogramas para atividades de correspondência/identificação
  const cols=Math.min(conceitos.length, 4);
  const rows=Math.ceil(conceitos.length/cols);
  const cellW=130, cellH=150, gap=10;
  const W=cols*(cellW+gap)+gap, H=rows*(cellH+gap)+gap;
  let grade='';
  conceitos.forEach((c,i)=>{
    const col=i%cols, row=Math.floor(i/cols);
    const x=gap+col*(cellW+gap), y=gap+row*(cellH+gap);
    // Extrai o SVG interno do pictograma e posiciona
    grade+=`<g transform="translate(${x+5},${y+5})">${svgPictograma(c).replace(/<svg[^>]*>|<\/svg>/g,'').replace(/<rect[^>]*fill="white"[^>]*\/>/,'')}</g>`;
    grade+=`<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" fill="none" stroke="#DDD" stroke-width="1.5" rx="8"/>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="white"/>${grade}</svg>`;
}

module.exports = {
  // Matemática
  svgGrupos, svgRetaNumerica, svgGeometria, svgFracao, svgGrafico,
  // Física
  svgCircuitoEletrico, svgModeloAtomico, svgEstadosMateria, svgEscalaPH,
  // Química
  svgTabelaPeriodica,
  // Educação Física
  svgQuadraEsporte, svgTabelaPontos,
  // Inglês
  svgDialogo, svgVocabulario,
  // Educação Especial
  svgPictograma, svgGradePictogramas
};
