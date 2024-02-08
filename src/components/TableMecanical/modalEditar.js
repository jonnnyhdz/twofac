import React, { useState, useEffect } from "react";
import axios from 'axios';
import './AgregarDatosModal.css';

function EditarDatosModal({ onClose, onEditarDatos, selectedRow }) {
  const [formData, setFormData] = useState({
    nombreCliente: "",
    modeloVehiculo: "",
    servicioId: "",  // Usar el ID del servicio en lugar del nombre
    piezaId: "",     // Usar el ID de la pieza en lugar del nombre
    comentarios: "",
    valorPieza: "",
    tiempo: "",
    precioTotal: "",
    estatus: "",
  });

  const [servicios, setServicios] = useState([]);
  const [piezas, setPiezas] = useState([]);

  // useEffect(() => {
  //   if (selectedRow) {
  //     setFormData({
  //       nombreCliente: selectedRow.nombreCliente,
  //       modeloVehiculo: selectedRow.modeloVehiculo,
  //       servicioId: selectedRow.servicios[0]?.id || "", // Extraer ID del servicio
  //       piezaId: selectedRow.piezas[0]?.id || "",       // Extraer ID de la pieza
  //       comentarios: selectedRow.comentarios,
  //       valorPieza: selectedRow.valorPieza,
  //       tiempo: selectedRow.tiempo,
  //       precioTotal: selectedRow.precioTotal,
  //       estatus: selectedRow.estatus,
  //     });
  //   }
  // }, [selectedRow]);

  useEffect(() => {
    if (selectedRow) {
      setFormData({
        nombreCliente: selectedRow.nombreCliente,
        modeloVehiculo: selectedRow.modeloVehiculo,
        // Verifica si `selectedRow.servicios` existe antes de intentar acceder a su primer elemento
        servicioId: selectedRow.servicios && selectedRow.servicios.length > 0 ? selectedRow.servicios[0].id : "",
        // Verifica si `selectedRow.piezas` existe antes de intentar acceder a su primer elemento
        piezaId: selectedRow.piezas && selectedRow.piezas.length > 0 ? selectedRow.piezas[0].id : "",
        comentarios: selectedRow.comentarios,
        valorPieza: selectedRow.valorPieza,
        tiempo: selectedRow.tiempo,
        precioTotal: selectedRow.precioTotal,
        estatus: selectedRow.estatus,
      });
    }
  }, [selectedRow]);
  

  useEffect(() => {
    // Cargar la lista de servicios
    axios.get('http://localhost:3001/api/servicios')
      .then(response => setServicios(response.data))
      .catch(error => console.error('Error al obtener servicios', error));

    // Cargar la lista de piezas
    axios.get('http://localhost:3001/api/piezas')
      .then(response => setPiezas(response.data))
      .catch(error => console.error('Error al obtener piezas', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    onEditarDatos(formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <span className="close" onClick={handleCancel}>
          &times;
        </span>
        <form>
          <label>Nombre Cliente:</label>
          <input
            type="text"
            name="nombreCliente"
            value={formData.nombreCliente}
            onChange={handleInputChange}
          />
          <label>Modelo Vehiculo:</label>
          <input
            type="text"
            name="modeloVehiculo"
            value={formData.modeloVehiculo}
            onChange={handleInputChange}
          />
          <label>Servicio:</label>
          <select
            name="servicioId"
            value={formData.servicioId}
            onChange={handleInputChange}
          >
            <option value="">Seleccionar Servicio</option>
            {servicios.map(servicio => (
              <option key={servicio.id} value={servicio.id}>
                {servicio.servicio_nombre}
              </option>
            ))}
          </select>
          <label>Piezas:</label>
          <select
            name="piezaId"
            value={formData.piezaId}
            onChange={handleInputChange}
          >
            <option value="">Seleccionar Pieza</option>
            {piezas.map(pieza => (
              <option key={pieza.id} value={pieza.id}>
                {pieza.nombre_pieza}
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
          <label>Estatus:</label>
          <input
            type="text"
            name="estatus"
            value={formData.estatus}
            onChange={handleInputChange}
          />
          <div className="button-container">
            <button
              type="button"
              className="save-button"
              onClick={handleSaveChanges}
            >
              Guardar
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarDatosModal;
