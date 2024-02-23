import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import IngresarToken from './IngresarToken.jsx';

function enviarCorreo(email) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost/api_2factor/dfactor.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function() {
      if (xhr.status === 200) {
          var respuesta = JSON.parse(xhr.responseText);
          if (respuesta.codigo) {
              // Código de doble factor
          }
      } else {
          // Error al realizar la solicitud a la API
      }
  };

  xhr.send("email=" + email);
}

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError('');

    if (!email || !password) {
      setError('Por favor, ingresa tu correo y contraseña');
      return;
    }

    setLoading(true);

    try {
      const loginResponse = await fetch(`http://localhost:3001/api/verificarmultifactor/${email}?password=${password}`);
      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.error || 'Error al verificar el estado de multifactor y contraseña');
      }

      if (loginData.multifactor === 1) {
        enviarCorreo(email);
        navigate(`/IngresarToken/${email}`);
        onLogin();
      } else {
        const rolesResponse = await fetch(`http://localhost:3001/api/verificarroles/${email}/-1`);
        const rolesData = await rolesResponse.json();

        if (!rolesResponse.ok) {
          throw new Error(rolesData.error || 'Error al verificar el estado de roles');
        }

        if (rolesData.proveedor === 1) {
          // Cambié la ruta a '/Piezas' para redirigir correctamente
          navigate('/Piezas');
        } else if (rolesData.roles === 1) {
          navigate('/Mecanicos');
        } else {
          navigate('/VistaMec');
        }

        onLogin();
      }
    } catch (error) {
      console.error('Error al verificar los datos:', error);
      setError('Error al verificar los datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Taller-TECH</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Ingrese su correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">
            {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;