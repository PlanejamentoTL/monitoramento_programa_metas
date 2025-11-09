import React, { createContext, useContext, useEffect, useState } from 'react';
import usersData from '../data/users.json';

const AuthContext = createContext({});

export const AuthProviderLocal = ({ children }) => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
const saved = localStorage.getItem('local_user');
if (saved) {
try { setUser(JSON.parse(saved)); } catch {}
}
setLoading(false);
}, []);

async function login(email, senha) {
const emailNorm = String(email || '').trim().toLowerCase();
const found = (usersData || []).find(u =>
String(u.email).trim().toLowerCase() === emailNorm && String(u.senha) === String(senha)
);

if (!found) return { ok: false, error: 'CREDENCIAIS_INVALIDAS' };
if (!found.ativo) return { ok: false, error: 'USUARIO_INATIVO' };

const minimalUser = { email: found.email, nome: found.nome, secretaria: found.secretaria, role: found.role };
setUser(minimalUser);
localStorage.setItem('local_user', JSON.stringify(minimalUser));
return { ok: true };
}

function logout() {
setUser(null);
localStorage.removeItem('local_user');
}

return (
<AuthContext.Provider value={{ user, loading, login, logout }}>
{children}
</AuthContext.Provider>
);
};

export const useAuthLocal = () => useContext(AuthContext);