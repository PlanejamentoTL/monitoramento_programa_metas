"""Prepara um modelo de relatório (.docx) para o docx-templates.

A partir do modelo original, gera uma cópia com:
  - {{FOR m IN metas}} / {{END-FOR m}} em volta do bloco de cada meta
    (do primeiro item depois da tabela de fases até o último item do documento);
  - o comando IMAGE nos gráficos ({{IMAGE grafico-rosca-atual}} e {{IMAGE grafico-barra-evolucao}});
  - os campos {{resultado-indicador-AAAA-S}} na tabela de resultados (que tinha valores fixos);
  - "Status Atual" e o resultado ao lado dele ligados ao período atual
    ({{status-atual}}, {{resultado-indicador-atual}}, {{periodo-atual}});
  - {{porcentagem-execução}} normalizado para {{porcentagem-execucao}};
  - quebra de página antes de cada meta e remoção das linhas em branco que
    sobravam antes/depois do loop (evita páginas em branco e imagens fixas na
    página sobrepostas ao conteúdo da meta anterior);
  - imagens giradas 90°/270° pelo Google Docs (quadro "deitado" + rotação +
    recortes negativos) convertidas em quadro horizontal sem rotação, que o
    Word exibe igual ao Google Docs;
  - opcional --compactar N: remove N linhas em branco do bloco da meta, uma de
    cada vez e sempre da maior sequência, para a meta caber em 1 página no Word;
  - opcional --compactar-capa N: o mesmo na 1ª página (gráficos e tabelas).
    O Google Docs usa linhas mais baixas que o Word; por isso modelos feitos
    nele costumam precisar de alguns ajustes. Confira o resultado no Word.

Uso (rode de novo sempre que editar o modelo original):
  python scripts/preparar-modelo-relatorio.py "public/modelos/modelo-relatorio(1).docx" public/modelos/relatorio.docx
  python scripts/preparar-modelo-relatorio.py public/modelos/modelo-relatorio3.docx public/modelos/relatorio3.docx
  python scripts/preparar-modelo-relatorio.py public/modelos/modelo-relatorio4.docx public/modelos/relatorio4.docx --compactar 2
  python scripts/preparar-modelo-relatorio.py public/modelos/modelo-relatorio5.docx public/modelos/relatorio5.docx --compactar 28 --compactar-capa 2
"""
import re, sys, zipfile

args = sys.argv[1:]


def opcao(nome):
    if nome not in args:
        return 0
    k = args.index(nome)
    valor = int(args[k + 1])
    del args[k:k + 2]
    return valor


compactar = opcao("--compactar")
compactar_capa = opcao("--compactar-capa")
origem, destino = args[0], args[1]
zin = zipfile.ZipFile(origem)
x = zin.read("word/document.xml").decode("utf-8")


def textos(xml):
    return "".join(re.findall(r"<w:t[^>]*>([^<]*)</w:t>", xml))


def itens_do_corpo(xml):
    """Elementos de primeiro nível do <w:body>: (tipo, início, fim) em posições absolutas."""
    base = xml.index("<w:body>") + len("<w:body>")
    corpo = xml[base:xml.index("</w:body>")]
    itens, prof = [], 0
    for m in re.finditer(r"<(/?)w:(p|tbl|sectPr)\b[^>]*?(/?)>", corpo):
        fecha, tag, auto = m.groups()
        if auto:
            if prof == 0:
                itens.append((tag, base + m.start(), base + m.end()))
            continue
        if not fecha:
            if prof == 0:
                ini, tipo = m.start(), tag
            prof += 1
        else:
            prof -= 1
            if prof == 0:
                itens.append((tipo, base + ini, base + m.end()))
    return itens


def tem_conteudo(xml):
    return textos(xml).strip() != "" or "<w:drawing" in xml


# Parágrafo de altura mínima (1 pt): usado nos comandos do loop e no fim do
# documento, para não empurrar o conteúdo nem criar página em branco.
PPR_MINIMO = ('<w:pPr><w:spacing w:before="0" w:after="0" w:line="20" w:lineRule="exact"/>'
              '<w:rPr><w:sz w:val="2"/><w:szCs w:val="2"/></w:rPr></w:pPr>')


def paragrafo(texto=""):
    corpo = (f'<w:r><w:rPr><w:sz w:val="2"/><w:szCs w:val="2"/></w:rPr>'
             f'<w:t xml:space="preserve">{texto}</w:t></w:r>') if texto else ""
    return f"<w:p>{PPR_MINIMO}{corpo}</w:p>"


def tabela_com(xml, trecho):
    i = xml.index(trecho)
    return xml.rfind("<w:tbl>", 0, i), xml.index("</w:tbl>", i)


# 1) Loop por meta
itens = itens_do_corpo(x)
i_fases = next(k for k, (t, s, e) in enumerate(itens) if t == "tbl" and "Metas sem atividade" in textos(x[s:e]))
bloco = [k for k in range(i_fases + 1, len(itens)) if itens[k][0] != "sectPr" and tem_conteudo(x[itens[k][1]:itens[k][2]])]
assert bloco, "bloco da meta não encontrado"
ini, fim = itens[bloco[0]][1], itens[bloco[-1]][2]
x = x[:fim] + paragrafo("{{END-FOR m}}") + x[fim:]
x = x[:ini] + paragrafo("{{FOR m IN metas}}") + x[ini:]

# 2) Gráficos: o docx-templates só insere imagem com o comando IMAGE
x = x.replace("{{grafico-rosca-atual}}", "{{IMAGE grafico-rosca-atual}}")
x = re.sub(r"\{\{[\w-]*barra-evolucaol?\}\}", "{{IMAGE grafico-barra-evolucao}}", x)
assert "{{IMAGE grafico-rosca-atual}}" in x and "{{IMAGE grafico-barra-evolucao}}" in x

# 3) Resultados do indicador: troca a linha de valores fixos (0, 0, -, ...) pelos campos
semestres = [f"{a}-{s}" for a in range(2026, 2030) for s in (1, 2)]
for s, e in [tabela_com(x, t) for t in ("Resultado indicador 2026-1", "Resultados do Indicador") if t in x]:
    tabela = x[s:e]
    linhas = re.findall(r"<w:tr[ >].*?</w:tr>", tabela, re.S)
    fixa = next(l for l in linhas if set(c.strip() for c in re.findall(r"<w:t[^>]*>([^<]*)</w:t>", l)) <= {"0", "-", ""})
    it = iter(semestres)
    nova = re.sub(r'(<w:t xml:space="preserve">)[^<]*(</w:t>)',
                  lambda m: f"{m.group(1)}{{{{resultado-indicador-{next(it)}}}}}{m.group(2)}", fixa)
    x = x[:s] + tabela.replace(fixa, nova) + x[e:]

# 4) "Status Atual": usa o período atual em vez de um semestre fixo
if "Status Atual" in x:
    s, e = tabela_com(x, "Status Atual")
    tabela = x[s:e]
    tabela = re.sub(r"\{\{status-\d{4}-[12]\}\}", "{{status-atual}}", tabela)
    tabela = re.sub(r"\{\{resultado-indicador-\d{4}-[12]\}\}", "{{resultado-indicador-atual}}", tabela)
    tabela = re.sub(r"Resultado Indicador \d{4}-[12]:", "Resultado Indicador {{periodo-atual}}:", tabela)
    x = x[:s] + tabela + x[e:]

# 5) Nome de campo com acento
x = x.replace("{{porcentagem-execução}}", "{{porcentagem-execucao}}")

# 6) Paginação: cada meta começa numa página nova
PARAGRAFO = r"<w:p[ >](?:(?!<w:p[ >]).)*?</w:p>"


def sem_vazios(trecho, quantos=None, manter=0):
    vazios = [p for p in re.findall(PARAGRAFO, trecho, re.S) if not tem_conteudo(p)]
    alvo = vazios[:quantos] if quantos is not None else vazios[:max(len(vazios) - manter, 0)]
    for p in alvo:
        trecho = trecho.replace(p, "", 1)
    return trecho


def limpar_entre(a, b, **kw):
    global x
    x = x[:a] + sem_vazios(x[a:b], **kw) + x[b:]


# 6a) Linhas em branco entre a tabela de fases e o loop (geravam uma página em branco)
ini_loop = x.index("{{FOR m IN metas}}")
_, _, fim_fases = next((t, s, e) for t, s, e in itens_do_corpo(x) if t == "tbl" and "Metas sem atividade" in textos(x[s:e]))
limpar_entre(fim_fases, x.rfind("<w:p>", 0, ini_loop))

# 6b) Quebra de página no primeiro parágrafo do bloco da meta
p = x.index("<w:p", x.index("</w:p>", x.index("{{FOR m IN metas}}")))
pp = x.index("<w:pPr>", p) + len("<w:pPr>")
x = x[:pp] + "<w:pageBreakBefore/>" + x[pp:]

# 6c) Linhas em branco depois do loop: troca todas por 1 parágrafo mínimo
# (a tabela flutuante do fim da meta precisa de um parágrafo depois dela)
fim_loop = x.index("</w:p>", x.index("{{END-FOR m}}")) + len("</w:p>")
limpar_entre(fim_loop, x.index("<w:sectPr", fim_loop))
x = x[:fim_loop] + paragrafo() + x[fim_loop:]

# 6d) Opcional: remove n linhas em branco entre a e b, uma de cada vez, sempre
# da maior sequência de linhas em branco naquele momento
def compactar_trecho(inicio, fim, n):
    global x
    for _ in range(n):
        a, b = x.index(inicio), x.index(fim)
        seqs, atual = [], []
        for t, s, e in itens_do_corpo(x):
            if s < a or e > b:
                continue
            if t == "p" and not tem_conteudo(x[s:e]) and "{{" not in x[s:e]:
                atual.append((s, e))
            else:
                seqs.append(atual)
                atual = []
        seqs.append(atual)
        maior = max(seqs, key=len)
        if not maior:
            return
        s, e = maior[0]
        x = x[:s] + x[e:]


compactar_trecho("{{FOR m IN metas}}", "{{END-FOR m}}", compactar)

compactar_trecho("<w:body>", "{{qtd-sem-atividade}}", compactar_capa)

# 7) Imagens giradas 90°/270° (Google Docs): o Word não aplica a rotação do mesmo
# jeito e mostra a imagem em pé. Troca largura/altura, remove a rotação e os
# recortes, deixando a imagem inteira no quadro já na orientação final.
def endireitar(m):
    d = m.group(0)
    if not re.search(r'<a:xfrm rot="(5400000|16200000)"', d):
        return d
    cx, cy = re.search(r'<wp:extent cx="(\d+)" cy="(\d+)"', d).groups()
    d = re.sub(r'<wp:extent cx="\d+" cy="\d+"', f'<wp:extent cx="{cy}" cy="{cx}"', d)
    d = re.sub(r'<a:ext cx="\d+" cy="\d+"', f'<a:ext cx="{cy}" cy="{cx}"', d)
    d = re.sub(r'<a:xfrm rot="\d+"', "<a:xfrm", d)
    d = re.sub(r'<a:srcRect[^>]*/>', '<a:srcRect b="0" l="0" r="0" t="0"/>', d)
    return d


x = re.sub(r"<w:drawing>.*?</w:drawing>", endireitar, x, flags=re.S)

zout = zipfile.ZipFile(destino, "w", zipfile.ZIP_DEFLATED)
for item in zin.infolist():
    dados = x.encode("utf-8") if item.filename == "word/document.xml" else zin.read(item.filename)
    zout.writestr(item, dados)
zout.close()
print("ok:", destino)
