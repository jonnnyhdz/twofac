import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import IngresarToken from './IngresarToken.jsx';

function enviarCorreo(email) {
  

  // Crear objeto XMLHttpRequest
  var xhr = new XMLHttpRequest();
  
  // Configurar la solicitud
  xhr.open("POST", "http://localhost/api_2factor/dfactor.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  // Manejar la respuesta de la API
  xhr.onload = function() {
      if (xhr.status === 200) {
          var respuesta = JSON.parse(xhr.responseText);
          //alert(respuesta.mensaje);
          if (respuesta.codigo) {
              //alert("Tu código de doble factor es: " + respuesta.codigo);
          }
      } else {
          //alert("Error al realizar la solicitud a la API");
      }
  };

  // Enviar la solicitud con el parámetro 'email'
  xhr.send("email=" + email);
}


const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Nuevo estado para manejar la carga
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    // Verifica si ya está en proceso una solicitud
    if (loading) {
      return;
    }
  
    // Resetea el error al intentar iniciar sesión nuevamente
    setError('');
  
    // Verifica si se han ingresado datos
    if (!email || !password) {
      setError('Por favor, ingresa tu correo y contraseña');
      return;
    }
  
    // Inicia el indicador de carga
    setLoading(true);
  
    try {
      // Hacer una solicitud al servidor para verificar el estado de multifactor, roles y contraseña
      const loginResponse = await fetch(`http://localhost:3001/api/verificarmultifactor/${email}?password=${password}`);
      const loginData = await loginResponse.json();
  
      // Verifica si el servidor devolvió un error
      if (!loginResponse.ok) {
        throw new Error(loginData.error || 'Error al verificar el estado de multifactor y contraseña');
      }
  
      // Verifica el estado de multifactor
      if (loginData.multifactor === 1) {
        enviarCorreo(email);
        // Redirecciona a la vista de ingresar token
        navigate(`/IngresarToken/${email}`);
        
        // Llama a la función onLogin si es necesario
        onLogin();
      } else {
         
        // Si no hay multifactor, verifica el estado de roles
        const rolesResponse = await fetch(`http://localhost:3001/api/verificarroles/${email}/-1`);
        const rolesData = await rolesResponse.json();
  
        // Verifica si el servidor devolvió un error
        if (!rolesResponse.ok) {
          throw new Error(rolesData.error || 'Error al verificar el estado de roles');
        }
  
        // Verifica el estado de roles y redirecciona en consecuencia
        if (rolesData.roles === 1) {
          // Redirecciona al componente de Mecanicos
          navigate('/Mecanicos');
        } else {
          // Redirecciona al componente de VistaMec
          navigate('/VistaMec');
        }

  
        // Llama a la función onLogin si es necesario
        onLogin();
      }
    } catch (error) {
      console.error('Error al verificar los datos:', error);
      setError('Error al verificar los datos');
    } finally {
      // Finaliza la carga, independientemente del resultado
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
