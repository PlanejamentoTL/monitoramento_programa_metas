// api.js
const BASE_URL    = import.meta.env.VITE_SHEETS_API;     // default (ex.: PPA / gerais)
const BASE_URLPG  = import.meta.env.VITE_SHEETS_APIPG;   // Plano de Governo
const BASE_URLLDO = import.meta.env.VITE_SHEETS_APILDO;  // LDO

// escolhe a base conforme o plano selecionado
function getBaseForPlano(plano = "") {
  const p = (plano || "").toLowerCase();

  // use termos em minúsculas porque 'p' foi lowercased
  if (p.includes("ldo")) {
    return BASE_URL;
  }
  if (p.includes("plano de governo")) {
    return BASE_URLPG;
  }
  return BASE_URL;
}

// POST simples (evita preflight)
async function postPlain(base, bodyObj) {
  const res = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(bodyObj),
    redirect: "follow",
  });
  return res.json();
}

// -------------------- APIs --------------------

export async function getHeaders(plano = "") {
  const BASE = getBaseForPlano(plano);
  const res = await fetch(`${BASE}?action=headers`, { redirect: "follow" });
  return res.json(); // { ok, headers: [...] }
}

export async function listItems(plano = "", secretaria = "") {
  const BASE = getBaseForPlano(plano);
  const params = new URLSearchParams({
    action: "list",
    plano,
    secretaria,
  });
  const res = await fetch(`${BASE}?${params.toString()}`, {
    method: "GET",
    redirect: "follow",
  });
  return res.json(); // { ok, data: [...] }
}

// (opcional; você disse que não cria novas metas)
export async function createItem(payload, plano = "") {
  const BASE = getBaseForPlano(plano);
  return postPlain(BASE, { action: "create", ...payload });
}

export async function updateItem(payload, plano = "") {
  const BASE = getBaseForPlano(plano);
  return postPlain(BASE, { action: "update", ...payload });
}

export async function deleteItem(id, plano = "") {
  const BASE = getBaseForPlano(plano);
  return postPlain(BASE, { action: "delete", id });
}

export async function uploadFile({ Numero, Secretaria, field, file, plano = "" }) {
  const BASE = getBaseForPlano(plano);

  const toBase64 = (f) =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result.split(",")[1]);
      r.onerror = rej;
      r.readAsDataURL(f);
    });

  const dataBase64 = await toBase64(file);

  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" }, // evita preflight
    body: JSON.stringify({
      action: "upload",
      Numero,
      Secretaria,
      field,
      filename: file.name,
      mimeType: file.type || "application/pdf",
      dataBase64,
    }),
    redirect: "follow",
  });
  return res.json();
}
