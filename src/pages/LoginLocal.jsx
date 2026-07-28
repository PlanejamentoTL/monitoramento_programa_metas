import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthLocal } from "../context/AuthContextLocal";
import '../estilos/EstiloLogin.css'

export default function LoginLocal() {
  const { login } = useAuthLocal();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!email || !senha) {
      setError("Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    const res = await login(email, senha);
    setLoading(false);

    if (res.ok) {
      navigate("/monitoramento_programa_metas");
    } else {
      const map = {
        CREDENCIAIS_INVALIDAS: "Usuário ou senha incorretos.",
        USUARIO_INATIVO: "Usuário inativo. Fale com o administrador.",
      };
      setError(map[res.error] || "Falha no login.");
    }
  }

  return (
    <div className="main-login" style={{ opacity: loading ? 0.7 : 1 }}>
      <div className="left-login">
        <a href="https://imgbox.com/CGKKTGS0" target="_blank" rel="noreferrer">
          <img
            className="img-login"
            src="https://i.ibb.co/CphSWNsZ/programa-metas-limpo-1.png"
            alt="logo"
          />
        </a>
      </div>

      <div className="right-login">
        <form className="card-login" onSubmit={handleSubmit} noValidate>
          <div className="textfield">
            <label htmlFor="user">Email Institucional</label>
            <input
              id="user"
              type="email"
              name="email"
              placeholder="E-mail Institucional"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="textfield">
            <label htmlFor="senha">Código de Acesso</label>
            <input
              id="senha"
              type="password"
              name="password"
              placeholder="Código de Acesso"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="login-error" style={{ color: "crimson", marginTop: 10 }}>
              {error}
            </div>
          )}

          <button
            id="btn-login"
            className="btn-login"
            type="submit"
            name="LoginButton"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Acessar"}
          </button>
        </form>
      </div>
    </div>
  );
}
