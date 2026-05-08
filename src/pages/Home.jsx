import React, { useEffect, useRef, useState,  useCallback  } from "react";
import { useAuthLocal } from "../context/AuthContextLocal";
import { useNavigate } from "react-router-dom";

import EditPGModal from './pop-up_meta';
import EditPlanos_geraisModal from './Pop_up_planos_gerais';
import EditPPALDOModal from './pop-up-ldo-ppa';
import EditPPAModal from './pop-up-ppa';
import '../estilos/Home.css';
import { MdOutlineExitToApp } from "react-icons/md";
import Footer from "./footer";
import PainelMetas from "./PainelMetas";
import { db } from "../services/firebase";
import { collection, getDocs, query, updateDoc, where, doc } from "firebase/firestore"; 
import { FaUserAlt, FaHouseUser, FaFileAlt, FaGlobeAmericas } from "react-icons/fa";



import { listItems, updateItem, uploadFile } from "../api";

// Se quiser usar Chart.js pelo npm, instale: npm i chart.js
// e descomente as linhas abaixo:
// import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
// Chart.register(ArcElement, Tooltip, Legend);

export default function Home() {

  const { user, logout } = useAuthLocal();

  const navigate = useNavigate();


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalplanosOpen, setIsModalplanosOpen] = useState(false);  
  const [isModalPPALDOOpen, setIsModalPPALDOOpen] = useState(false);
  const [isModalPPAOpen, setIsModalPPAOpen] = useState(false);
  const [selected, setSelected] = useState({});
  const [saving, setSaving] = useState(false);
  const [secretariaSelecionada, setsecretariaSelecionada] = useState(user.secretaria);
  const [rows, setRows] = useState([]);
  const [plano, setPlano] = useState("plano-governo");
  const [isAdmin, setisAdmin] = useState(false);



useEffect(() => {
  const getMetas = async () => {
    try {
      // 1. Referência básica da coleção baseada no plano
      const collectionRef = collection(db, plano);
      let q;

      // 2. Lógica de Filtro: Se "Todas" estiver selecionada, busca tudo. 
      // Caso contrário, aplica o filtro 'where'
      if (secretariaSelecionada === "Todas" || !secretariaSelecionada) {
        q = query(collectionRef);
      } else {
        q = query(
          collectionRef, 
          where("secretaria-responsavel", "==", secretariaSelecionada)
        );
      }

      const data = await getDocs(q);
      setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    } catch (error) {
      console.error("Erro ao buscar metas: ", error);
    }
  };

  // O useEffect agora "escuta" tanto a mudança de plano quanto de secretaria
  getMetas();
}, [plano, secretariaSelecionada]);

useEffect(()=> {

  if(user?.secretaria === "SEGOV"){

    setisAdmin(true);

  } else{

    setisAdmin(false);
  }


}, [user]);


function openModal(row) {
  setSelected(row);
  // Deve bater com o 'value' do <select>
  if (plano === "plano-governo") {
     setIsModalOpen(true);
  } else if(plano === "plano-plurianual") {

    setIsModalPPAOpen(true);
    
  } else if(plano === "ldo-2026"){

     setIsModalPPALDOOpen(true);

   

  } else{

     setIsModalplanosOpen(true);
  }
}

  function closeModal() {
    setIsModalOpen(false);
    setIsModalplanosOpen(false);
    setIsModalPPALDOOpen(false);
    setIsModalPPAOpen(false);
    setSelected({});
  }



  const onChangeField = (field, value) => {
  setSelected(prev => ({
    ...prev,
    [field]: value // O uso de [field] entre colchetes é obrigatório para nomes com hífen
  }));
};
  
async function onSave() {

  try {

    setSaving(true);

    const docRef = doc(db, plano, selected.id);

    const dadosAtualizados = {
      ...selected,
      "data-ultima-atualizacao": new Date().toLocaleString("pt-BR"),
      "responsavel-ultima-atualizacao": user.nome || "Anônimo",
    };

    console.log("Verificando link antes de salvar:", dadosAtualizados["documentos-comprobatorios"]);

    await updateDoc(docRef, dadosAtualizados);

    /*Para que a lista de metas na tela atualize sem precisar dar reload*/
    setRows(prevRows => 
      prevRows.map(item => item.id === selected.id ? dadosAtualizados : item)
    );
   
      alert("Atualizado com sucesso!");
      closeModal();
      
    
  } catch (err) {
    console.error("Erro ao salvar:", err);
    alert("Erro ao salvar!");
  } finally {
    setSaving(false);
  }
}
   
/*

const refresh = useCallback(async () => {
    try {
      const secretaria = (user?.secretaria || "").trim();
      const res = await listItems(plano, secretaria); // ← filtros no servidor
      if (res.ok) {
        console.log("Dados filtrados:", res.data.length);
        setRows(res.data);
      } else {
        console.error("Erro ao buscar dados:", res.error);
      }
    } catch (err) {
      console.error("Exceção ao buscar dados:", err);
    }
  }, [plano, user?.secretaria]);


  // Carrega na montagem e sempre que plano/secretaria mudarem
  useEffect(() => {
    refresh();
  }, [refresh]);

*/





  // Estados simples para os contadores
 
  const [totalMetas, setTotalMetas] = useState(0);
  const [concluidas, setConcluidas] = useState(0);
  const [emPartes, setEmPartes] = useState(0);
  const [planejadas, setPlanejadas] = useState(0);
  const [naoContempladas, setNaoContempladas] = useState(0);

  // Refs para elementos que no HTML eram por id
  const graficoStatusRef = useRef(null);

  // Exemplo de inicialização do Chart.js
  useEffect(() => {
    // Se NÃO for usar Chart.js agora, você pode remover todo esse useEffect.
    // if (!graficoStatusRef.current) return;
    // const ctx = graficoStatusRef.current.getContext("2d");
    // const chart = new Chart(ctx, {
    //   type: "doughnut",
    //   data: {
    //     labels: ["Concluídas", "Em Partes", "Planejadas", "Não contempladas"],
    //     datasets: [
    //       {
    //         data: [concluidas, emPartes, planejadas, naoContempladas],
    //       },
    //     ],
    //   },
    //   options: {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     plugins: { legend: { display: true } },
    //   },
    // });
    // return () => chart.destroy();
  }, [concluidas, emPartes, planejadas, naoContempladas]);

  function handlePesquisar() {
    // Aqui você implementa a lógica para buscar/atualizar os indicadores
    // conforme o "plano" selecionado.
    // Abaixo deixo valores mock para visualizar:
    setTotalMetas(120);
    setConcluidas(42);
    setEmPartes(25);
    setPlanejadas(40);
    setNaoContempladas(13);
  }

  const handleFileUpload = async (file, field) => {
  if (!file) return;

  // Ajuste os nomes para bater com os campos do Firestore (minúsculos)
  const res = await uploadFile({
    numero: selected.numero,
    secretaria: selected["secretaria-responsavel"], 
    field: field, 
    file: file,
    plano: plano, // O estado 'plano' que você já usa no select
  });

  if (res.ok) {
    onChangeField(field, res.url);
    await refresh(); // Garante que a lista reflita a nova URL do documento
  } else {
    alert("Falha no upload: " + (res.error || "erro desconhecido"));
  }
};


  function handleLogout() {
    logout();
    navigate("/login");
  }

  function verificaUsuario(){

    if(user.secretaria === "SEGOV"){

      setisAdmin(true); 
    }
  }

  const uploadParaDrive = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result.split(",")[1]; // Remove o cabeçalho do base64
      
      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbzMf-2lcYgfAEMEad5jw7tz33kawnSym2LkLCocqgZDKJlFEBpEYnnavIQrciT3-Cs3VQ/exec", {
          method: "POST",
          body: JSON.stringify({
            base64: base64,
            mimeType: file.type,
            fileName: `${new Date().getTime()}_${file.name}`
          }),
        });
        
        const res = await response.json();
        resolve(res); // Retorna { ok: true, url: "..." }
      } catch (err) {
        reject(err);
      }
    };
  });
};

  return (
    <section className="dashboard">
     

    
      <div className="barra_lateral" >

        
          <div >
            <img className="logo_image"
              src="https://images2.imgbox.com/f9/ba/L0DP1bQd_o.png"
              alt="logo"
            />
          </div>
      

        <div className="menu-items">
          
      
                <span className="link-name">
                <span style={{marginRight: "2px"}}  >  <FaUserAlt /> </span>
                  Olá, <span id="nome_usuario">{user?.nome || user?.email}</span>
                </span>
             
                <span id="nome_secretaria" className="link-name">
                 <span style={{marginRight: "2px"}} ><FaHouseUser /></span>
                 {user?.secretaria}
                </span>
          
                <span className="link-name2"  style={{ backgroundColor:"blue", color:"#FFF", width:"100%", padding:"5%", display:"flex", gap:"0.5rem", alignItems:"center", borderRadius:"5px"}} >
                   <span style={{marginRight: "2px"}} ><FaFileAlt /></span>
                  Atualização de Planos</span>

              

              {isAdmin && (

                 <span className="link-name2" onClick={() => navigate("/visualizacao_geral")}>
   <FaGlobeAmericas/> Visualização Geral
</span>

              )}

        </div>

        <div className="logout_div" >

         <button className="LogoutButton" onClick={handleLogout}>
                  <MdOutlineExitToApp />
                  <i className="uil uil-signout" /> Logout
          </button>

          </div>

      </div>

    
     

     
      <div className="conteudo">

        
       


     

          <div className="pesquisa_planos">
          
          
                <span className="titulo_campo" htmlFor="planos">
                  Instrumento de Planejamento:
                </span>

                <div className="pesquisa" >  
               
<select 
  id="planos" 
  className="select_planos" 
  value={plano} 
  onChange={(e) => setPlano(e.target.value)}
>
  <option value="plano-governo">Plano de Governo</option>
  <option value="plano-plurianual">Plano Plurianual 2026-2029</option>
  <option value="ldo-2026">Lei de Diretrizes Orçamentárias 2026</option>
  <option value="plano-diretor">Plano Diretor</option>
  <option value="plano-primeira-infancia">Plano Municipal da 1ª Infância</option>
  <option value="plano-tres-lagoas-sustentavel">Plano Três Lagoas Sustentável</option>
  <option value="plano-setorial">Plano Setorial - Assistência Social</option>
  {isAdmin &&   <option value="base-teste">Teste</option>}



  {/* Adicione os outros mapeando para as coleções corretas */}
</select>

                 <hr className="horizontal-line" />

                </div>
            
         
        
        </div>

        <PainelMetas rows={rows} />




       
      
        <div className="metas">
{rows.map((row) => (
  <div className="meta" key={row.id} onClick={() => openModal(row)}>
    {/* Use nomes minúsculos se foi assim que salvamos no Firestore */}
    <span> {row.numero} - </span>
    <span> {row.meta} {row.objetivo} </span>
    <br/><br/>

    <div className="status" style={{
      background: {
        "Concluída": "rgba(0, 226, 0, 0.7)",
        "Em Partes": "rgba(0, 96, 163, 0.7 )",
        "Planejada": "rgba(255, 255, 0, 0.7)",
        "Não Contemplada": "rgba(232, 36, 36, 0.7 )"
      }[row["status-2026-1"]] || "gray", // Adicionado fallback        
      padding: "8px",
      borderRadius: "5px",
      color: "#000",
    }}>
      <strong>Status:</strong> {row["status-2026-1"]}
    </div>
    <br/>
    <span> Previsão de conclusão: {row["data-conclusao"]}</span>
  </div>
))}

            
            

        </div>

         <Footer/>



        
       
       

       </div>
       


        <EditPGModal
  isOpen={isModalOpen}
  meta={selected}
  loading={saving}
  onClose={closeModal}
  onChangeField={onChangeField}
  onSave={onSave}
  uploadParaDrive={uploadParaDrive}

/>

<EditPlanos_geraisModal  
  isOpen={isModalplanosOpen}
  meta={selected}
  loading={saving}
  onClose={closeModal}
  onChangeField={onChangeField}
  onSave={onSave}
  uploadParaDrive={uploadParaDrive}
  
/>

<EditPPALDOModal  
  isOpen={isModalPPALDOOpen}
  meta={selected}
  loading={saving}
  onClose={closeModal}
  onChangeField={onChangeField}
  onSave={onSave}
  uploadParaDrive={uploadParaDrive}
  
/>


<EditPPAModal  
  isOpen={isModalPPAOpen}
  meta={selected}
  loading={saving}
  onClose={closeModal}
  onChangeField={onChangeField}
  onSave={onSave}
  uploadParaDrive={uploadParaDrive}
  
/>

    </section>
    
  );
}