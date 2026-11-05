import * as XLSX from "xlsx";

// Gera e baixa a planilha (.xlsx) com as metas do plano e secretaria selecionados.
// Usado em "Visualização Geral" e em "Atualização de Planos".
export function gerarPlanilha(rows, plano, secretaria) {
  if (!rows || rows.length === 0) {
    alert("Nenhum dado para exportar.");
    return;
  }

  const dados = mapeiaDadosPlano(rows, plano);

  const worksheet = XLSX.utils.json_to_sheet(dados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Metas");

  // Nome do arquivo reflete os filtros ativos
  const data = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-");
  const nomeArquivo = `metas_${plano}_${secretaria || "Todas"}_${data}.xlsx`;

  XLSX.writeFile(workbook, nomeArquivo);
}

// Campos exportados para cada plano
function mapeiaDadosPlano(rows, plano) {



  if(plano === "plano-governo"){

     const dados = rows.map((row) => ({
      "numero": row.numero,
      "objetivo": row.objetivo,
      "ods-vinculados": row["ods-vinculados"],
      "status-2025-1": row["status-2025-1"],
      "status-2025-2": row["status-2025-2"],
      "status-2026-1": row["status-2026-1"],
      "status-2026-2": row["status-2026-2"],
      "status-2027-1": row["status-2027-1"],
      "status-2027-2": row["status-2027-2"],
      "status-2028-1": row["status-2028-1"],
      "status-2028-2": row["status-2028-2"],
      "documentos-comprobatorios": row["documentos-comprobatorios"],
      "porcentagem-execucao": row["porcentagem-execucao"],
      "data-conclusao" : row["data-conclusao"],
      "justificativa-nao-conclusao" : row["justificativa-nao-conclusao"],
      "informacoes-adicionais": row["informacoes-adicionais"],
      "data-ultima-atualizacao": row["data-ultima-atualizacao"],
      "secretaria-responsavel": row["secretaria-responsavel"],
      "plano" : row.plano
  }));

  return dados;

  } else if(plano === "plano-plurianual"){

    const dados = rows.map((row) => ({
      "numero": row.numero,
      "meta": row.meta,
      "indicador": row.indicador,
      "un-medida": row["un-medida"],

      "status-2026-1": row["status-2026-1"],
      "status-2026-2": row["status-2026-2"],
      "status-2027-1": row["status-2027-1"],
      "status-2027-2": row["status-2027-2"],
      "status-2028-1": row["status-2028-1"],
      "status-2028-2": row["status-2028-2"],
      "status-2029-1": row["status-2029-1"],
      "status-2029-2": row["status-2029-2"],

      "resultado-indicador-2026-1": row["resultado-indicador-2026-1"],
      "resultado-indicador-2026-2": row["resultado-indicador-2026-2"],
      "resultado-indicador-2027-1": row["resultado-indicador-2027-1"],
      "resultado-indicador-2027-2": row["resultado-indicador-2027-2"],
      "resultado-indicador-2028-1": row["resultado-indicador-2028-1"],
      "resultado-indicador-2028-2": row["resultado-indicador-2028-2"],
      "resultado-indicador-2029-1": row["resultado-indicador-2029-1"],
      "resultado-indicador-2029-2": row["resultado-indicador-2029-2"],

       "detalhamento": row["detalhamento"],
       "tipo-meta": row["tipo-meta"],
       "custeio-investimento": row["custeio-investimento"],
       "programa": row["programa"],
       "projeto-atividade": row["projeto-atividade"],

       "funcao": row["funcao"],
       "subfuncao": row["subfuncao"],
       "objetivo": row["objetivo"],
       "ods-vinculado": row["ods-vinculado"],
      
      "documentos-comprobatorios": row["documentos-comprobatorios"],
      "porcentagem-execucao": row["porcentagem-execucao"],
      "data-conclusao" : row["data-conclusao"],
      "justificativa-nao-conclusao" : row["justificativa-nao-conclusao"],
      "informacoes-adicionais": row["informacoes-adicionais"],
      "data-ultima-atualizacao": row["data-ultima-atualizacao"],
      "secretaria-responsavel": row["secretaria-responsavel"],
      "plano" : row.plano
  }));
    
  
 return dados;

  }  else if(plano === "ldo-2026"){

    const dados = rows.map((row) => ({
      "numero": row.numero,
      "objetivo": row["objetivo"],
      "meta": row.meta,
      "ods-vinculado": row["ods-vinculado"],
      "indicador": row.indicador,
      "un-medida": row["un-medida"],
      "status-2026-1": row["status-2026-1"],
      "status-2026-2": row["status-2026-2"],
      "resultado-indicador-2026-1": row["resultado-indicador-2026-1"],
      "resultado-indicador-2026-2": row["resultado-indicador-2026-2"],
      "documentos-comprobatorios": row["documentos-comprobatorios"],
      "porcentagem-execucao": row["porcentagem-execucao"],
      "data-conclusao" : row["data-conclusao"],
      "detalhamento": row["detalhamento"],
      "tipo-meta": row["tipo-meta"],
      "custeio-investimento": row["custeio-investimento"],
      "programa": row["programa"],
      "funcao": row["funcao"],
      "fonte-orcamentaria" : row["fonte-orcamentaria"],
      "projeto-atividade": row["projeto-atividade"],
      "subfuncao": row["subfuncao"],
      "co-fonte-orcamentaria" : row["co-fonte-orcamentaria"],
      "meta-previamente-planejada" : row["meta-previamente-planejada"],
      "meta-fisica-2026" : row["meta-fisica-2026"],
      "meta-financeira-2026" : row["meta-financeira-2026"],
      "meta-fisica-2027" : row["meta-fisica-2027"],
      "meta-financeira-2027" : row["meta-financeira-2027"],
      "meta-fisica-2028" : row["meta-fisica-2028"],
      "meta-financeira-2028" : row["meta-financeira-2028"],
      "meta-fisica-2029" : row["meta-fisica-2029"],
      "meta-financeira-2029" : row["meta-financeira-2029"],
      "informacoes-adicionais": row["informacoes-adicionais"],
      "data-ultima-atualizacao": row["data-ultima-atualizacao"],
      "responsavel-ultimo-envio" : row["responsavel-ultimo-envio"],
      "secretaria-responsavel": row["secretaria-responsavel"],
      "plano" : row.plano
      
  }));
    
  
 return dados;

  } else {

    const dados = rows.map((row) => ({

      "numero": row.numero,
      "meta": row.meta,
      "ods-vinculado": row["ods-vinculado"],
      "status-2025-1": row["status-2025-1"],
      "status-2025-2": row["status-2025-2"],
      "status-2026-1": row["status-2026-1"],
      "status-2026-2": row["status-2026-2"],
      "status-2027-1": row["status-2027-1"],
      "status-2027-2": row["status-2027-2"],
      "status-2028-1": row["status-2028-1"],
      "status-2028-2": row["status-2028-2"],
      "porcentagem-execucao": row["porcentagem-execucao"],
      "data-conclusao": row["data-conclusao"],
      "plano-acao": row["plano-acao"],
      "detalhamento": row["detalhamento"],
      "documentos-comprobatorios": row["documentos-comprobatorios"],
      "justificativa-nao-conclusao": row["justificativa-nao-conclusao"],
      "documentos-justificativa": row["documentos-justificativa"],
      "informacoes-adicionais": row["informacoes-adicionais"],
      "data-ultima-atualizacao": row["data-ultima-atualizacao"],
      "responsavel-ultimo-envio" : row["responsavel-ultimo-envio"],
      "secretaria-responsavel": row["secretaria-responsavel"],
      "plano" : row.plano




       }));
       return dados; 
  }
}
