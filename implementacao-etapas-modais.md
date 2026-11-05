# Tarefa: exibir e editar as etapas das metas nos modais de visualização

## Contexto

Os documentos da coleção `plano-governo` no Firestore ganharam 20 campos novos, que descrevem **5 etapas** de execução de cada meta. Esses campos já existem em todos os documentos. Quero que eles apareçam nos **modais de visualização de metas** do projeto.

Antes de começar, procure no projeto:
- os componentes dos modais de visualização de metas (e qualquer outro modal ou tela que mostre os detalhes de uma meta);
- como esses modais leem e gravam dados no Firestore hoje;
- os componentes de UI, estilos e padrões de formulário já usados, para manter a implementação consistente com o resto do código.

Se outras coleções usarem os mesmos modais (por exemplo `plano-tres-lagoas-sustentavel`), a implementação deve funcionar para elas também.

## Estrutura dos campos no Firestore

Os nomes dos campos têm hífen, então use sempre a notação com colchetes/aspas: `meta["peso-etapa1"]`, **nunca** `meta.peso-etapa1`.

Para cada etapa `N` de 1 a 5:

| Campo               | Tipo salvo | Exemplo                                              |
|---------------------|------------|------------------------------------------------------|
| `descricao-etapaN`  | string     | `"O que vamos fazer está definido e documentado?"`   |
| `peso-etapaN`       | string     | `"10"`                                               |
| `previsao-etapaN`   | string     | `""` (vazio) ou data                                 |
| `status-etapaN`     | string     | `""` (vazio) ou uma das opções de status             |

Valores atuais de descrição e peso:

| Etapa | Descrição                                                        | Peso |
|-------|------------------------------------------------------------------|------|
| 1     | O que vamos fazer está definido e documentado?                   | 10   |
| 2     | Recurso, projeto, licenças e autorizações estão assegurados?     | 15   |
| 3     | Quem vai executar já está contratado ou alocado?                 | 15   |
| 4     | O objeto foi realizado?                                          | 45   |
| 5     | Foi entregue à população, recebido e formalmente encerrado?      | 15   |

Os pesos somam 100. Não use esses valores fixos no código: leia sempre do documento.

## Layout pedido

Exiba as 5 etapas em sequência (Etapa 1 a Etapa 5). **Dentro de cada etapa, os campos devem aparecer exatamente nesta ordem:**

1. **Descrição da etapa** (`descricao-etapaN`): texto, somente leitura.
2. **Peso da etapa** (`peso-etapaN`): somente leitura, exibido como percentual (ex.: `10%`).
3. **Previsão da etapa** (`previsao-etapaN`): campo de **data**.
4. **Status da etapa** (`status-etapaN`): **select**.

Uma linha ou um card por etapa, com um título como "Etapa 1", funciona bem. Em telas pequenas, os campos podem quebrar em coluna mantendo a mesma ordem.

## Regras do campo Previsão (data)

- Exibir e digitar no **formato brasileiro `dd/mm/aaaa`**.
- Gravar no Firestore como string ISO `AAAA-MM-DD` (ex.: `"2026-12-31"`), para ordenar e comparar datas com facilidade. Converter na leitura e na gravação.
- Valor vazio (`""`) significa "sem previsão": mostrar o campo vazio ou um placeholder `dd/mm/aaaa`, sem erro.
- Se algum documento já tiver data em outro formato (ex.: `dd/mm/aaaa`), a leitura deve aceitar esse formato também e não quebrar.
- Validar a data (não aceitar `31/02/2026`, por exemplo).

## Regras do campo Status (select)

O select deve ter exatamente estas 4 opções, nesta ordem:

1. `Planejada`
2. `Em Partes`
3. `Concluída`
4. `Não Contemplada`

- Gravar no Firestore o próprio texto da opção (ex.: `"Em Partes"`), com acento e maiúsculas iguais aos acima.
- Valor vazio (`""`) significa "não definido": mostrar um placeholder como `Selecione...`, que não é uma opção válida para gravar.
- Se possível, diferenciar visualmente cada status (cor ou badge), seguindo o padrão visual do projeto.

## Leitura e gravação

- Se o modal já tiver modo de edição, a previsão e o status devem ser editáveis e salvos no Firestore com `update` apenas nos campos alterados (não sobrescrever o documento inteiro).
- Se o modal for apenas de visualização, mostre a data formatada (`dd/mm/aaaa`) e o status como texto ou badge, e me diga onde faz mais sentido colocar a edição.
- Documentos sem algum desses campos não devem quebrar o modal: tratar como vazio.

## Critérios de aceite

- [ ] As 5 etapas aparecem no modal de visualização de metas.
- [ ] Em cada etapa a ordem é: Descrição → Peso → Previsão → Status.
- [ ] A previsão aparece e é digitada como `dd/mm/aaaa` e é gravada como `AAAA-MM-DD`.
- [ ] O status é um select com Planejada, Em Partes, Concluída e Não Contemplada.
- [ ] Valores vazios são exibidos sem erro.
- [ ] A edição grava só os campos alterados no documento correto.
- [ ] O visual segue os componentes e estilos já existentes no projeto.

Ao terminar, liste os arquivos alterados e explique brevemente o que mudou em cada um.