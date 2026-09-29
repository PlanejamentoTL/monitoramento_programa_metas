import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";


// Converte Timestamps do Firestore para string legível
function normalizarDoc(docSnap) {
  const data = docSnap.data();
  Object.keys(data).forEach(key => {
    if (data[key]?.seconds !== undefined && data[key]?.nanoseconds !== undefined) {
      data[key] = new Date(data[key].seconds * 1000).toLocaleString("pt-BR");
    }
  });
  return { ...data, id: docSnap.id };
}

// Busca as metas de um plano (coleção), filtrando por secretaria quando informada.
// "Todas" ou vazio = sem filtro.
export async function buscarMetas(plano, secretaria) {
  const collectionRef = collection(db, plano);
  const q = (!secretaria || secretaria === "Todas")
    ? query(collectionRef)
    : query(collectionRef, where("secretaria-responsavel", "==", secretaria));

  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(normalizarDoc)
    .sort((a, b) => Number(a.numero) - Number(b.numero));
}

export async function atualizarMeta(plano, id, dados) {
  await updateDoc(doc(db, plano, id), dados);
}

// Hook: recarrega as metas sempre que plano ou secretaria mudarem.
// setRows é exposto para atualizar a lista localmente após salvar.
export function useDadosMetas(plano, secretaria) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;

    const getMetas = async () => {
      setLoading(true);
      setError(null);
      try {
        const dados = await buscarMetas(plano, secretaria);
        if (!cancelado) setRows(dados);
      } catch (err) {
        console.error("Erro ao buscar metas: ", err);
        if (!cancelado) {
          setError(err);
          setRows([]);
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    };

    getMetas();
    // Evita que uma resposta antiga sobrescreva a de um filtro mais recente
    return () => { cancelado = true; };
  }, [plano, secretaria]);

  return { rows, setRows, loading, error };
}
