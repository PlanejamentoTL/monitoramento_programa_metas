import React, { useEffect, useRef, useState,  useCallback  } from "react";
import { useAuthLocal } from "../context/AuthContextLocal";
import { useNavigate } from "react-router-dom";

import EditPGModal from './pop-up_meta';
import EditPlanos_geraisModal from './Pop_up_planos_gerais';
import '../estilos/Home.css';
import { MdOutlineExitToApp } from "react-icons/md";
import Footer from "./footer";
import PainelMetas from "./PainelMetas";



import { listItems, updateItem, uploadFile } from "../api";

// Se quiser usar Chart.js pelo npm, instale: npm i chart.js
// e descomente as linhas abaixo:
// import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
// Chart.register(ArcElement, Tooltip, Legend);

export default function Home() {

 
const { user, logout } = useAuthLocal();

  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [plano, setPlano] = useState("Plano Plurianual 2022-2025");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalplanosOpen, setIsModalplanosOpen] = useState(false);
  const [selected, setSelected] = useState({});
  const [saving, setSaving] = useState(false);

  function openModal(row) {
    
    setSelected(row);

    if(plano === "Plano de Governo"){

       setIsModalOpen(true);


    } else {

      setIsModalplanosOpen(true);


    }

    
   
  }

  function closeModal() {
    setIsModalOpen(false);
    setIsModalplanosOpen(false);
    setSelected({});
  }
  function onChangeField(key, value) {
    setSelected((prev) => ({ ...prev, [key]: value }));
  }
async function onSave() {
    try {
      setSaving(true);

      const payload = {
  ...selected,
  Numero: selected?.Numero || "",
  Secretaria: selected?.Secretaria || user?.secretaria || "",
  Ultima_atualizacao: new Date().toISOString(),
  Responsavel_envio: user?.nome || user?.email || "Anônimo",
};

console.log("Enviando payload para update:", payload); // 👈 debug
const res = await updateItem(payload, plano);


     
      if (!res.ok) {
        console.error(res.error);
        alert("Falha ao salvar: " + (res.error || "erro desconhecido"));
        return;
      }

      closeModal();
      await refresh();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }
   


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

  function handleLogout() {
    logout();
    navigate("/login");
  }

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
                  <i className="uil uil-user" />
                  Olá, <span id="nome_usuario">{user?.nome || user?.email}</span>
                </span>
             
                <span id="nome_secretaria" className="link-name">
                   <i className="uil uil-university" />
                 {user?.secretaria}
                </span>
          
                <span className="link-name2">
                   <i className="uil uil-home" />
                  Atualização de Planos</span>
   
               
           
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
               
                <select  id="planos" className="select_planos" name="lista" value={plano} onChange={(e) => setPlano(e.target.value)}>
                   <option value="Plano de Governo">Plano de Governo</option>
                  <option value="Plano Plurianual 2022-2025">Plano Plurianual</option>
                  <option value="Lei de Diretrizes Orçamentárias">Lei de Diretrizes Orçamentárias</option>
                  <option value="Plano Diretor">Plano Diretor</option>
                  <option value="Plano Municipal da Primeira Infância">Plano Municipal da Primeira Infância</option>
                  <option value="Plano Três Lagoas Sustentável">Plano Três Lagoas Sustentável</option>
                  <option value="Plano Setorial">Plano Setorial - Assistência Social</option>
                </select>

                 <hr className="horizontal-line" />

                </div>
            
         
        
        </div>

        <PainelMetas rows={rows} />




       
      
        <div className="metas">

           {rows.map((row, idx) => (
              <div className="meta" key={idx} onClick={() => openModal(row)}>
              
              
                  <span> {row.Numero} -  </span>
                  <span> {row.Meta} {row.Objetivo}  </span>
                  <br/>
                  <br/>

                   <span> Status atual: {row.Status_2025_1} </span>
                   <br/>
                   <span> Previsão de conclusão: {row.Data_conclusao}</span>

                 
                
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
         onFileSelect={async (file, field) => {
          // ⬇️ AQUI você usa await uploadFile(...)
          if (!file) return;
          const res = await uploadFile({
            Numero: selected.Numero,
            Secretaria: selected.Secretaria,
            field,                 // ex: "Documento_comprobatorio_url"
            file,
            plano,
          });
          if (res.ok) {
            // atualiza o campo com a URL retornada
            onChangeField(field, res.url);
          } else {
            alert("Falha no upload: " + (res.error || "erro"));
          }
        }}
      />
      

      <EditPlanos_geraisModal  isOpen={isModalplanosOpen}
        meta={selected}
        loading={saving}
        onClose={closeModal}
        onChangeField={onChangeField}
        onSave={onSave}
         onFileSelect={async (file, field) => {
          // ⬇️ AQUI você usa await uploadFile(...)
          if (!file) return;
          const res = await uploadFile({
            Numero: selected.Numero,
            Secretaria: selected.Secretaria,
            field,                 // ex: "Documento_comprobatorio_url"
            file,
            plano,
          });
          if (res.ok) {
            // atualiza o campo com a URL retornada
            onChangeField(field, res.url);
          } else {
            alert("Falha no upload: " + (res.error || "erro"));
          }
        }}

         />

    </section>
    
  );
}