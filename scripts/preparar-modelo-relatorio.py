"""Prepara um modelo de relatório (.docx) para o docx-templates.

A partir do modelo original, gera uma cópia com:
  - {{FOR m IN metas}} / {{END-FOR m}} em volta do bloco de cada meta
    (do primeiro item depois da tabela de fases até o último item do documento);
  - o comando IMAGE nos gráficos ({{IMAGE grafico-rosca-atual}} e {{IMAGE grafico-barra-evolucao}});
  - os campos {{resultado-indicador-AAAA-S}} na tabela de resultados (que tinha valores fixos);
  - "Status Atual" e o resultado ao lado dele ligados ao período atual
    ({{status-atual}}, {{resultado-indicador-atual}}, {{periodo-atual}});
  - {{porcentagem-execução}} normalizado para {{porcentagem-execucao}}.

Uso (rode de novo sempre que editar o modelo original):
  python scripts/preparar-modelo-relatorio.py "public/modelos/modelo-relatorio(1).docx" public/modelos/relatorio.docx
  python scripts/preparar-modelo-relatorio.py public/modelos/modelo-relatorio3.docx public/modelos/relatorio3.docx
"""
import re, sys, zipfile

origem, destino = sys.argv[1], sys.argv[2]
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


def paragrafo(texto):
    return ('<w:p><w:pPr><w:rPr/></w:pPr><w:r><w:rPr><w:rtl w:val="0"/></w:rPr>'
            f'<w:t xml:space="preserve">{texto}</w:t></w:r></w:p>')


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

zout = zipfile.ZipFile(destino, "w", zipfile.ZIP_DEFLATED)
for item in zin.infolist():
    dados = x.encode("utf-8") if item.filename == "word/document.xml" else zin.read(item.filename)
    zout.writestr(item, dados)
zout.close()
print("ok:", destino)
