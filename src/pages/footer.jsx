
import "../estilos/Footer.css"; 


import { FaInstagram, FaFacebookF } from "react-icons/fa";


const Footer = () =>{



    return(

     <footer className="rodape" >

           <hr className="horizontal-line" />

        <div className="dados_direitos" > 
            <p>Desenvolvido pelo Departamento de Planejamento e Estatística</p>
            
            <p>Secretaria de Governo e Políticas Públicas</p>
      
         </div>
     </footer>
    );
}

export default Footer; 