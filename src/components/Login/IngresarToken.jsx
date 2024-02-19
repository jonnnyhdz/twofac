// IngresarToken.jsx
import React, { useState, useEffect } from 'react';
import './IngresarToken.css';
import { useParams, useNavigate } from 'react-router-dom';

const IngresarToken = ({ onTokenSubmit }) => {
  const { correo } = useParams();
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    // Puedes realizar operaciones adicionales cuando cambia 'correo', si es necesario
    console.log('Correo actual:', correo);
  }, [correo]);


  const handleTokenSubmit = async (e) => {
    e.preventDefault();
  
    // Validación básica del token
    if (!token.trim()) {
      setError('Por favor, ingresa un token válido');
      return;
    }
  
    try {
      const rolesResponse = await fetch(`http://localhost:3001/api/verificarroles/${correo}/${token}`);
      const rolesData = await rolesResponse.json();
  
      // Verifica si el servidor devolvió un error
      if (!rolesResponse.ok) {
        setError(rolesData.error || 'Error al verificar el estado de roles');
        return;
      }
  
      // Verifica el estado de roles y redirecciona en consecuencia
      if (rolesData.roles === 1) {
        // Redirecciona al componente de Mecanicos
        navigate('/Mecanicos');
      } else {
        // Redirecciona al componente de VistaMec
        navigate('/VistaMec');
      }
  
      // Llama a la función onTokenSubmit si es necesario
      onTokenSubmit(token);
    } catch (error) {
      console.error('Error al verificar el estado de roles:', error);
      setError('Error al verificar el estado de roles');
    }
  };

  return (
    <div className="ingresar-token-container">
      <div className="ingresar-token-card">
        <h2>Ingrese el Token</h2>
        <form onSubmit={handleTokenSubmit}>
          <div className="input-group">
            <label>Token</label>
            <input
              type="text"
              placeholder="Ingrese el token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="token-submit-button">
            Validar Token
          </button>
        </form>
      </div>
    </div>
  );
};

export default IngresarToken;
