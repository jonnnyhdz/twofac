import React, { useState, useEffect } from 'react';
import './AgregarDatosModal.css';
import axios from 'axios';

function AgregarDatosModal({ onClose, onAgregarDatos }) {
  const [formData, setFormData] = useState({
    nombreCliente: '',
    modeloVehiculo: '',
    servicios: [],
    piezas: [],
    comentarios: '',
    costoTotal: 0,
  });

  const [servicios, setServicios] = useState([]);
  const [piezas, setPiezas] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      await cargarServicios();
      await cargarPiezas();
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    // Recalcular el costo total cada vez que servicios o piezas cambian
    calcularCostoTotal();
  }, [formData.servicios, formData.piezas]);

  const cargarServicios = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/servicios');
      setServicios(response.data);
    } catch (error) {
      console.error('Error al obtener servicios:', error);
    }
  };

  const cargarPiezas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/piezas');
      setPiezas(response.data);
    } catch (error) {
      console.error('Error al obtener piezas:', error);
    }
  };

  const handleAgregar = async () => {
    // Preparar los datos para enviar, incluyendo el mapeo de servicios y piezas seleccionados
    const nuevosDatos = {
      nombreCliente: formData.nombreCliente,
      modeloVehiculo: formData.modeloVehiculo,
      servicio_id: formData.servicios.map((servicio) => servicio.id), // Mapear solo los IDs de los servicios seleccionados
      piezas_id: formData.piezas.map((pieza) => pieza.id), // Mapear solo los IDs de las piezas seleccionadas
      comentarios: formData.comentarios,
      costoTotal: formData.costoTotal,
    };
  
    console.log('Datos a enviar:', nuevosDatos);
  
    try {
      const response = await axios.post('http://localhost:3001/api/registros_mecanicos', nuevosDatos);
      if (response.data.success) {
        onAgregarDatos(nuevosDatos); // Suponiendo que esta función actualiza la lista de registros en el componente padre
        onClose(); // Cerrar el modal después de agregar los datos
      } else {
        console.error('Error al agregar datos:', response.data.error);
      }
    } catch (error) {
      console.error('Error al agregar datos:', error.response?.data || error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, options } = e.target;
    if (options) {
      const values = Array.from(options).filter(option => option.selected).map(option => JSON.parse(option.value));
      setFormData(prevData => ({
        ...prevData,
        [name]: values,
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: e.target.value,
      }));
    }
  };

  const calcularCostoTotal = () => {
    const costoServicios = formData.servicios.reduce((total, servicio) => total + servicio.precio, 0);
    const costoPiezas = formData.piezas.reduce((total, pieza) => total + pieza.costo, 0);
    setFormData(prevData => ({
      ...prevData,
      costoTotal: costoServicios + costoPiezas,
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Agregar Servicio</h2>
        <label>Nombre del Cliente:</label>
        <input
          type="text"
          name="nombreCliente"
          value={formData.nombreCliente}
          onChange={handleInputChange}
        />

        <label>Modelo del Vehículo:</label>
        <input
          type="text"
          name="modeloVehiculo"
          value={formData.modeloVehiculo}
          onChange={handleInputChange}
        />

        <label>Servicios:</label>
        <select multiple name="servicios" value={formData.servicios.map(s => JSON.stringify(s))} onChange={handleInputChange} size={servicios.length}>
          {servicios.map(servicio => (
            <option key={servicio.id} value={JSON.stringify(servicio)}>
              {servicio.servicio_nombre} - ${servicio.precio}
            </option>
          ))}
        </select>

        <label>Piezas:</label>
        <select multiple name="piezas" value={formData.piezas.map(p => JSON.stringify(p))} onChange={handleInputChange} size={piezas.length}>
          {piezas.map(pieza => (
            <option key={pieza.id} value={JSON.stringify(pieza)}>
              {pieza.nombre_pieza} - ${pieza.costo}
            </option>
          ))}
        </select>

        <label>Comentarios:</label>
        <input
          type="text"
          name="comentarios"
          value={formData.comentarios}
          onChange={handleInputChange}
        />

        <p>Costo Total: ${formData.costoTotal}</p>
        <button onClick={handleAgregar}>Agregar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}

export default AgregarDatosModal;
