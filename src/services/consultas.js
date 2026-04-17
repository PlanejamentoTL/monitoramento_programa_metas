import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getFirestore,
} from "firebase/firestore";
import { useEffect, useState } from "react";


export const dadosMetas = () =>{

    const [rows, setRows] = useState([]);
    const [plano, setPlano] = useState("plano-governo");



   


    useEffect(() => { 


         const getMetas = async () =>{ 
        try{

             const collectionMetas = collection(db, plano);
             const data = await getDocs(collectionMetas);
             setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

        } catch(error){

            console.error("Erro ao buscar metas: ", error);
            setRows([]);

        }
     };

        getMetas();
    }, [plano]);
}