// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProviderLocal } from "./context/AuthContextLocal";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import LoginLocal from "./pages/LoginLocal";


export default function App() {
  return (
    <AuthProviderLocal>
      <BrowserRouter>
        <Routes>
         
         

           <Route
            path="/monitoramento_programa_metas"
            element={
              <ProtectedRoute>
                <Home />
              
              </ProtectedRoute>
            }
          />
           <Route path="/login" element={<LoginLocal />} />
        </Routes>
      </BrowserRouter>
    </AuthProviderLocal>
  );
}
