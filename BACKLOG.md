# Backlog Técnico — `src/pages`

Análise de código feita em 2026-08-13 sobre os 9 arquivos de `src/pages`:
`Home.jsx`, `visualizacaoGeral.jsx`, `PainelMetas.jsx`, `LoginLocal.jsx`, `footer.jsx`,
`pop-up_meta.jsx`, `Pop_up_planos_gerais.jsx`, `pop-up-ldo-ppa.jsx`, `pop-up-ppa.jsx`.

Legenda de prioridade: 🔴 Crítico · 🟠 Alto · 🟡 Médio · 🟢 Baixo

---

## 🔴 Bugs críticos (corrigir primeiro)

1. **Campo de status trocado por copy-paste — `pop-up_meta.jsx:130-135`**
   O select rotulado "Status 2026-1" (segundo campo, linha 127) lê o valor de
   `status-2026-2` mas grava em `status-2028-2` no `onChange`:
   ```jsx
   value={gv("status-2026-2")}
   onChange={(e) => handleChange("status-2028-2", e.target.value)}
   ```
   Resultado: o usuário edita um campo achando que está atualizando 2026-2 e o
   sistema silenciosamente grava em 2028-2. Corrigir o par `value`/`onChange`
   e o `<label>` (duplicado, ambos dizem "Status 2026-1").

2. **`handleFileUpload` quebra em runtime — `Home.jsx:255-273` e `visualizacaoGeral.jsx:194-212`**
   A função chama `await refresh()`, mas `refresh` está definida dentro de um
   bloco de comentário (`Home.jsx:180-203`) e não existe de forma alguma em
   `visualizacaoGeral.jsx`. Qualquer chamada a `handleFileUpload` lança
   `ReferenceError: refresh is not defined`. Hoje a função não é chamada em
   lugar nenhum (código morto), mas é uma bomba-relógio caso alguém a conecte.
   → Remover ou implementar `refresh` de fato (recarregar `rows` do Firestore).

3. **Perda de dados na exportação de planilha — `visualizacaoGeral.jsx:384-387`**
   No mapeamento do plano `ldo-2026`, as chaves do objeto exportado são
   duplicadas por engano:
   ```js
   "meta-fisica-2028" : row["meta-fisica-2028"],
   "meta-financeira-2028" : row["meta-financeira-2028"],
   "meta-fisica-2028" : row["meta-fisica-2029"],   // sobrescreve a linha acima
   "meta-financeira-2028" : row["meta-financeira-2029"], // idem
   ```
   Os valores de 2029 sobrescrevem os de 2028 sob a mesma chave — a planilha
   exportada nunca contém a coluna "2029" e perde os dados reais de "2028".

4. **IDs HTML duplicados dentro do mesmo modal — todos os 4 pop-ups**
   Vários `<select>` no mesmo componente usam `id="campo_status_meta2"`
   (ex.: `pop-up_meta.jsx` repete esse id 8 vezes). HTML não permite IDs
   duplicados; quebra `label[for]`, `document.getElementById` e leitores de
   tela. Ou remover os ids fixos ou gerar ids únicos por campo/ano.

## 🟠 Alto impacto

5. **Duplicação quase total entre `Home.jsx` e `visualizacaoGeral.jsx`**
   ~90% do código (fetch do Firestore, `onSave`, `uploadParaDrive`, wiring
   dos 4 modais, estados de admin) está copiado entre os dois arquivos.
   Qualquer correção (como o bug #1 e #2) precisa ser replicada manualmente
   nos dois lugares — e já não foi (ex.: o rótulo do PPA está com anos
   diferentes nos dois arquivos, ver item 10). Extrair um hook
   `useMetas(plano, secretaria)` e um componente `MetasDashboard` compartilhado.

6. **4 modais de edição quase idênticos** (`pop-up_meta.jsx`,
   `Pop_up_planos_gerais.jsx`, `pop-up-ldo-ppa.jsx`, `pop-up-ppa.jsx`, ~470-610
   linhas cada) repetem a mesma estrutura de "Histórico de Status" por
   semestre/ano, upload de PDF e `normalizeDateInput` (função idêntica
   copiada em pelo menos 4 arquivos). Extrair um componente genérico
   `<StatusHistoryFields periods={[...]} />` e mover `normalizeDateInput`
   para `src/utils`.

7. **Períodos "atual" vs "bloqueado" hardcoded em cada modal**
   Cada select de status tem o atributo `disabled` fixado manualmente por
   arquivo (ex.: "2026-1" editável, os demais `disabled`). Quando o ciclo
   avançar (2026-2, 2027...), alguém terá que editar os 4 arquivos à mão —
   já é a causa provável dos bugs #1 e #3. Calcular o período editável
   dinamicamente (a partir de uma constante de "período vigente") em vez de
   fixar no JSX.

8. **Upload sem tratamento de erro — todos os pop-ups**
   `await uploadParaDrive(f)` (ex.: `pop-up_meta.jsx:271`) não está dentro de
   `try/catch`. Como `uploadParaDrive` (`Home.jsx:289-313`) pode rejeitar a
   Promise (erro de rede, resposta não-JSON do Apps Script), uma falha deixa
   `setLoading(true)` travado para sempre — o spinner "Enviando documento..."
   nunca some e o usuário não recebe feedback de erro.

9. **URL do Google Apps Script hardcoded e duplicada no código-fonte**
   `Home.jsx:297` e `visualizacaoGeral.jsx:236` contêm a mesma URL de script
   de upload cravada no bundle do frontend. Deveria estar em variável de
   ambiente (`import.meta.env.VITE_UPLOAD_SCRIPT_URL`), tanto por segurança
   quanto para não ter duas fontes de verdade.

10. **Textos e imagens divergentes entre páginas quase-duplicadas**
    - Rótulo do plano plurianual: "2026-2029" em `Home.jsx:399` vs
      "2022-2025" em `visualizacaoGeral.jsx:534` — um dos dois está errado.
    - Logo carregada de hosts diferentes: `i.ibb.co` (`Home.jsx:325`) vs
      `images2.imgbox.com` (`visualizacaoGeral.jsx:454`) — ambas hotlinks
      externos sem fallback local; se o host cair, o logo simplesmente some.

11. **`/visualizacao_geral` não é protegida no próprio componente**
    O link no menu só aparece se `isAdmin` (`Home.jsx:350-356`), mas
    `visualizacaoGeral.jsx` não verifica `isAdmin` nem redireciona — qualquer
    usuário autenticado que digitar a URL acessa dados de todas as
    secretarias. Ocultar o link não é controle de acesso; adicionar guarda
    de rota (e idealmente regra correspondente no Firestore Security Rules).

12. **Salvamento sobrescreve o documento inteiro sem checagem de concorrência**
    `onSave` (`Home.jsx:145-178`, repetido em `visualizacaoGeral.jsx`) envia
    `{...selected, ...}` inteiro via `updateDoc`. Se dois usuários abrirem a
    mesma meta ao mesmo tempo, o segundo `save` sobrescreve silenciosamente as
    mudanças do primeiro (last-write-wins, sem aviso). Considerar enviar
    apenas os campos alterados e/ou checar `data-ultima-atualizacao` antes de
    salvar.

## 🟡 Médio impacto

13. **Gráfico de pizza pode não bater com o contador "Total de Metas"**
    `PainelMetas.jsx:16-28` só conta linhas cujo `status-2026-1` esteja
    exatamente entre os 4 valores mapeados. Uma meta com status vazio, nulo
    ou com texto diferente (espaço extra, typo) é silenciosamente excluída
    das fatias do gráfico, mas ainda conta em `total = rows.length`
    (linha 30) — o percentual do doughnut nunca soma 100% do total exibido
    e não há indicação visual do porquê.

14. **Race condition na busca de metas ao trocar filtros rapidamente**
    `useEffect` de fetch (`Home.jsx:46-90`, mesmo padrão em
    `visualizacaoGeral.jsx:41-80`) não cancela a requisição anterior. Ao
    trocar `plano`/`secretaria` rapidamente, uma resposta antiga pode chegar
    depois da mais nova e sobrescrever `rows` com dados desatualizados.

15. **Ordenação por `numero` pode falhar silenciosamente**
    `rows.sort((a, b) => Number(a.numero) - Number(b.numero))` — se `numero`
    for `undefined`/texto não numérico, `Number()` retorna `NaN` e a
    comparação produz ordem inconsistente sem erro nem aviso.

16. **`console.log`/`console.error` deixados em produção**
    `console.log("Dados recebidos no Modal:", meta)` roda a cada render dos
    3 modais (`pop-up_meta.jsx:17`, `pop-up-ldo-ppa.jsx:17`,
    `pop-up-ppa.jsx:17`) enquanto o popup está aberto. Remover ou usar um
    logger com nível/flag de debug.

17. **Feedback de erro apenas no console, nunca na UI**
    Falhas no `getDocs`/fetch (`catch (error) { console.error(...) }`) não
    mostram nada ao usuário — a tela só fica com a lista vazia, sem explicar
    o motivo. Adicionar estado de erro visível.

18. **Uso de `alert()` para mensagens de sucesso/erro**
    `Home.jsx:168/174`, `pop-up_meta.jsx:276/278`, etc. usam `alert()`
    bloqueante do navegador. Substituir por toast/snackbar não-bloqueante
    melhora a UX, principalmente em fluxos de upload.

19. **Código morto acumulado**
    - `Home.jsx`/`visualizacaoGeral.jsx`: estados `totalMetas`, `concluidas`,
      `emPartes`, `planejadas`, `naoContempladas`, `graficoStatusRef` e as
      funções `handlePesquisar`, `verificaUsuario`, `handleFileUpload` nunca
      são usados na árvore renderizada (o gráfico real já vive em
      `PainelMetas.jsx`).
    - `Pop_up_planos_gerais.jsx:23-53` (`isReadOnly`) e `:60-71`
      (`editableInputs`) são declarados e nunca usados.
    - Imports não utilizados: `listItems`, `updateItem` em ambos os
      dashboards (`../api`).
    - Bloco inteiro comentado de ~24 linhas (`refresh`,
      `Home.jsx:180-203`) e do Chart.js manual (`Home.jsx:221-242`).

20. **Campos `readOnly` com `onChange` morto**
    Em `pop-up-ldo-ppa.jsx` e `pop-up-ppa.jsx`, vários inputs de
    "Meta indicador"/"Resultado indicador" têm `readOnly` **e** um
    `onChange` que nunca dispara (ex.: `pop-up-ppa.jsx:256-262`). Remover o
    handler morto ou, melhor, extrair um subcomponente `<CampoIndicador
    readOnly={...} />` que decide isso uma vez só.

## 🟢 Baixo impacto / qualidade

21. **Acessibilidade**: `<span className="titulo_campo" htmlFor="planos">`
    (`Home.jsx:386`) — `htmlFor` não tem efeito em `<span>`; deveria ser
    `<label htmlFor="planos">`. De forma geral, nenhum `<label>` dos pop-ups
    está de fato associado ao seu `<input>/<select>` via `htmlFor`/`id`
    único (agravado pelo item 4), prejudicando leitores de tela.

22. **Listas de opções (secretarias, planos) hardcoded e duplicadas** em
    `Home.jsx` e `visualizacaoGeral.jsx` — inclui typo no rótulo
    `"Diretoria de Agronegócio Agronegócio"` (`visualizacaoGeral.jsx:559`,
    palavra repetida). Mover para um arquivo de constantes compartilhado
    (`src/data`) e corrigir o texto.

23. **Mapa de cor do status recriado inline em cada card** (`Home.jsx:437-447`,
    `visualizacaoGeral.jsx:609-619`) — mesma lógica duplicada; extrair para
    `src/utils/statusColors.js` reaproveitando as cores já centralizadas em
    `PainelMetas.jsx:31-36`.

24. **Nome de estado confuso**: `const [uploading, setLoading] = useState(false)`
    nos 4 pop-ups — o setter chama-se `setLoading` mas a variável é
    `uploading`, e já existe uma prop `loading` diferente no mesmo escopo.
    Renomear para `setUploading` evita futuras trocas acidentais.

25. **Sem `PropTypes`/TypeScript**: nenhum componente valida o formato de
    `meta`, `rows`, `onSave` etc. Dado o histórico de bugs de campo trocado
    (#1), tipagem ajudaria a pegar isso em tempo de build.

26. **Sem paginação/virtualização** na lista `rows.map(...)` dos dashboards —
    pode degradar performance conforme a base cresce.

27. **Estilos inline extensos** espalhados pelo JSX (cores de status, layout
    de linha/coluna) em vez de classes CSS — dificulta manutenção de tema e
    consistência visual.

28. **Pequenos typos**: `className="bento-card "` com espaço sobrando
    (`PainelMetas.jsx:96`); comentário `// components/EditPGModal.jsx` no
    topo de `Pop_up_planos_gerais.jsx:1` não bate com o nome real do
    arquivo/exportação (`EditPlanosGeraisModal`).

---

## Sugestão de ordem de execução

1. Corrigir bugs de dados (#1, #3) — risco de corromper informação real já em produção.
2. Corrigir/skip `handleFileUpload` quebrado (#2) e IDs duplicados (#4).
3. Adicionar guarda de acesso em `/visualizacao_geral` (#11) e mover a URL do Apps Script para `.env` (#9).
4. Extrair hook/component compartilhado para eliminar a duplicação Home ↔ visualizacaoGeral (#5) e o padrão repetido dos 4 modais (#6, #20) — isso por si só evita boa parte dos bugs futuros do tipo #1.
5. Tratar erros de upload/fetch com feedback visível (#8, #17) e resolver a race condition de filtros (#14).
6. Faxina de código morto e itens de qualidade (🟡/🟢) conforme a agenda permitir.
