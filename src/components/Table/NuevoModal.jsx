import React, { useState } from 'react';
import './NuevoModal.css';

const NuevoModal = ({ onCloseModal, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    contrasena: '', // Nuevo campo para la contraseña
  });

  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    // Validaciones específicas para cada campo
    if (field === 'nombre') {
      // Permitir solo texto
      if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
        setFormData({
          ...formData,
          [field]: value,
        });
      }
    } else if (field === 'correo') {
      // Validar formato de correo electrónico
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value === '') {
        setFormData({
          ...formData,
          [field]: value,
        });
      }
    } else if (field === 'telefono') {
      // Permitir solo números
      if (/^\d*$/.test(value) || value === '') {
        setFormData({
          ...formData,
          [field]: value,
        });
      }
    } else if (field === 'contrasena') {
      // Permitir cualquier caracter para la contraseña
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const isFormValid = () => {
    // Validar que todos los campos estén llenos
    return (
      formData.nombre.trim() !== '' &&
      formData.correo.trim() !== '' &&
      formData.telefono.trim() !== '' &&
      formData.contrasena.trim() !== ''
    );
  };

  const handleSaveClick = () => {
    if (!isFormValid()) {
      setError('Por favor, complete todos los campos antes de guardar.');
      return;
    }

    // Enviar datos al servidor
    fetch('http://localhost:3001/api/registros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        console.log('Respuesta del servidor (raw):', response);
        return response.json();
      })
      .then((data) => {
        console.log('Respuesta del servidor (parsed):', data);
        if (data.success) {
          onSave(formData);
        } else {
          console.error('Error al agregar nuevo registro:', data.error);
        }
        onCloseModal();
      })
      .catch((error) => {
        console.error('Error al enviar datos al servidor:', error);
      });
  };

  return (
    <div className="modal-overlay" onClick={onCloseModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Agregar Nuevo Registro</h3>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            placeholder="Ingrese el nombre"
            value={formData.nombre}
            onChange={(e) => handleInputChange('nombre', e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="correo">Correo:</label>
          <input
            type="text"
            id="correo"
            placeholder="Ingrese el correo"
            value={formData.correo}
            onChange={(e) => handleInputChange('correo', e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="telefono">Teléfono:</label>
          <input
            type="text"
            id="telefono"
            placeholder="Ingrese el teléfono"
            value={formData.telefono}
            onChange={(e) => handleInputChange('telefono', e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="contrasena">Contraseña:</label>
          <input
            type="password"
            id="contrasena"
            placeholder="Ingrese la contraseña"
            value={formData.contrasena}
            onChange={(e) => handleInputChange('contrasena', e.target.value)}
          />
        </div>
        <div className="modal-buttons">
          <button onClick={onCloseModal}>Cancelar</button>
          <button onClick={handleSaveClick}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default NuevoModal;
