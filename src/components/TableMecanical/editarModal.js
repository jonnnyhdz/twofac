import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditarDatosModal.css";

const EditarDatosModal = ({ onClose, onEditarDatos, editedRow }) => {
    const [editedComments, setEditedComments] = useState(editedRow.comentarios || "");
    const [newService, setNewService] = useState("");
    const [newPiece, setNewPiece] = useState("");
    const [servicios, setServicios] = useState([]);
    const [piezas, setPiezas] = useState([]);
    const [editedServices, setEditedServices] = useState(editedRow.servicios_adicionales || []);
    const [editedPieces, setEditedPieces] = useState(editedRow.piezas_adicionales || []);
  

  useEffect(() => {
    // Obtener datos de servicios al cargar el modal
    axios
      .get("http://localhost:3001/api/servicios")
      .then((response) => {
        setServicios(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener servicios:", error);
      });

    // Obtener datos de piezas al cargar el modal
    axios
      .get("http://localhost:3001/api/piezas")
      .then((response) => {
        setPiezas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener piezas:", error);
      });
  }, []); 

  const handleCommentsChange = (e) => {
    setEditedComments(e.target.value);
  };

  const handleNewServiceChange = (e) => {
    setNewService(e.target.value);
  };

  const handleNewPieceChange = (e) => {
    setNewPiece(e.target.value);
  };

  
  const handleEditarClick = async () => {
    try {
      const editedData = { ...editedRow };
      editedData.comentarios = editedComments;
      editedData.servicios_adicionales = editedServices;
      editedData.piezas_adicionales = editedPieces;
  
      // Agregar nuevos servicios y piezas directamente a la fila
      if (newService) {
        editedData.servicios_adicionales.push(newService);
      }
  
      if (newPiece) {
        editedData.piezas_adicionales.push(newPiece);
      }
  
      const response = await axios.put(`http://localhost:3001/api/registros_mecanicos/${editedRow.id}`, editedData);
  
      if (response.status === 200) {
        console.log('Datos actualizados correctamente');
        onEditarDatos(editedData);
      } else {
        console.error('Error al actualizar datos en la base de datos');
      }
  
      onClose();
    } catch (error) {
      console.error('Error al editar datos', error);
    }
  };
  

  const handleCancelarClick = () => {
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Editar Datos</h2>
        <label>
          Comentarios:
          <textarea value={editedComments} onChange={handleCommentsChange} />
        </label>
        <label>
  Agregar Nuevo Servicio:
  <select value={newService} onChange={handleNewServiceChange}>
    <option value="">Seleccionar Servicio</option>
    {servicios.map((servicio) => (
      <option key={servicio.id} value={servicio.id}>
        {servicio.servicio_nombre}
      </option>
    ))}
  </select>
</label>

<label>
  Agregar Nueva Pieza:
  <select value={newPiece} onChange={handleNewPieceChange}>
    <option value="">Seleccionar Pieza</option>
    {piezas.map((pieza) => (
      <option key={pieza.id} value={pieza.id}>
        {pieza.nombre_pieza}
      </option>
    ))}
  </select>
</label>
        <div className="button-container">
          <button className="save-button" onClick={handleEditarClick}>
            Guardar cambios
          </button>
          <button className="cancel-button" onClick={handleCancelarClick}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarDatosModal;
