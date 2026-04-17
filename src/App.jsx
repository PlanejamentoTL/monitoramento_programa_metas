// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProviderLocal } from "./context/AuthContextLocal";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import LoginLocal from "./pages/LoginLocal";
import VisualizacaoGeral from "./pages/visualizacaoGeral";


export default function App() {
  return (
    <AuthProviderLocal>
      <BrowserRouter>
        <Routes>
          {/* Rota principal: Redireciona para o login ou home automaticamente */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Rota da Home (Secretaria Específica) */}
          <Route
            path="/monitoramento_programa_metas"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Rota da Visualização Geral (Administrativo SEGOV) */}
          <Route
            path="/visualizacao_geral"
            element={
              <ProtectedRoute>
                <VisualizacaoGeral />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<LoginLocal />} />
        </Routes>
      </BrowserRouter>
    </AuthProviderLocal>
  );
}
