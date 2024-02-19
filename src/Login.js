import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, useNavigate } from 'react-router-dom';

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    // En el efecto, verifica si el usuario está autenticado y redirige si es necesario
    if (isAuthenticated) {
      navigate('/VistaMec');
      // También puedes usar navigate('/VistaMec', { replace: true }) si no quieres que el usuario pueda volver atrás con el botón del navegador
    }
  }, [isAuthenticated, navigate]);  // Asegúrate de incluir navigate como dependencia para evitar advertencias

  const handleLogin = () => {
    loginWithRedirect();
  };

  return <button onClick={handleLogin}>Iniciar</button>;
};

export default LoginButton;
