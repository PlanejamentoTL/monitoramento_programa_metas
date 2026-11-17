"""Gera public/modelos/relatorio.docx a partir do modelo original, adicionando:
  - {{FOR m IN metas}} / {{END-FOR m}} em volta do bloco de cada meta (repete o bloco para cada meta);
  - os campos {{resultado-indicador-AAAA-S}} na tabela de resultados (que tinha valores fixos);
  - o comando IMAGE nos dois gráficos ({{IMAGE grafico-rosca-atual}} e {{IMAGE grafico-barra-evolucao}}).
Uso: python scripts/preparar-modelo-relatorio.py "public/modelos/modelo-relatorio(1).docx" public/modelos/relatorio.docx
"""
import re, sys, zipfile

origem, destino = sys.argv[1], sys.argv[2]
zin = zipfile.ZipFile(origem)
x = zin.read("word/document.xml").decode("utf-8")

def paragrafo(texto):
    return ('<w:p><w:pPr><w:rPr/></w:pPr><w:r><w:rPr><w:rtl w:val="0"/></w:rPr>'
            f'<w:t xml:space="preserve">{texto}</w:t></w:r></w:p>')

# 1) Loop por meta: do quadro "{{n}} {{meta}}" até o fim da tabela de resultados
i_n = x.index("{{meta}}")
ini = x.rfind("<w:tbl>", 0, i_n)
assert x.count("<w:tbl>", 0, ini) == x[:ini].count("<w:tbl>")
i_res = x.index("Resultado indicador 2026-1")
fim = x.index("</w:tbl>", i_res) + len("</w:tbl>")
x = x[:fim] + paragrafo("{{END-FOR m}}") + x[fim:]
x = x[:ini] + paragrafo("{{FOR m IN metas}}") + x[ini:]

# 2) Resultados do indicador: troca os valores fixos (0, 0, -, -, ...) pelos campos
i_res = x.index("Resultado indicador 2026-1")
s = x.rfind("<w:tbl>", 0, i_res); e = x.index("</w:tbl>", i_res)
tabela = x[s:e]
linhas = re.findall(r"<w:tr[ >].*?</w:tr>", tabela, re.S)
assert len(linhas) == 2, len(linhas)
semestres = [f"{a}-{s_}" for a in range(2026, 2030) for s_ in (1, 2)]
it = iter(semestres)
nova = re.sub(r'(<w:t xml:space="preserve">)[^<]*(</w:t>)',
              lambda m: f"{m.group(1)}{{{{resultado-indicador-{next(it)}}}}}{m.group(2)}", linhas[1])
tabela = tabela.replace(linhas[1], nova)
x = x[:s] + tabela + x[e:]

# 3) Gráficos: o docx-templates só insere imagem com o comando IMAGE
x = x.replace("{{grafico-rosca-atual}}", "{{IMAGE grafico-rosca-atual}}")
x = x.replace("{{grafico-barra-evolucaol}}", "{{IMAGE grafico-barra-evolucao}}")
assert "{{IMAGE grafico-rosca-atual}}" in x and "{{IMAGE grafico-barra-evolucao}}" in x

zout = zipfile.ZipFile(destino, "w", zipfile.ZIP_DEFLATED)
for item in zin.infolist():
    dados = x.encode("utf-8") if item.filename == "word/document.xml" else zin.read(item.filename)
    zout.writestr(item, dados)
zout.close()
print("ok:", destino)
