import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import AgregarDatosModal from './modal';
import EditarDatosModal from './modalEditar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './styles.css';

function TableMecanical() {
  const [data, setData] = useState([]);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/registros_mecanicos');
      console.log('Respuesta de la API:', response.data);
      setData(response.data || []);

    } catch (error) {
      console.error('Error al obtener datos de la API', error);
      setData([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Llamada a la API para eliminar el registro
      await axios.delete(`http://localhost:3001/api/registros_mecanicos/${id}`);

      // Eliminar la fila
      setData((prevData) => prevData.filter((row) => row.id !== id));

      alert('Se borró correctamente');
    } catch (error) {
      console.error('Error al eliminar datos', error);
      alert('Sucedió un error al intentar borrar los datos');
    }
  };

  const handleDeleteClick = async (row) => {
    try {
      console.log(".a.a.a.a-", row)
      if (!row.id || data.findIndex(item => item.id === row.id) === -1) {
        console.error('ID de registro no válido o no encontrado');
        alert('ID de registro no válido o no encontrado');
        return;
      }
  
      console.log('Intentando eliminar registro con ID:', row.id);
  
      const response = await axios.delete(`http://localhost:3001/api/registros_mecanicos/${row.id}`);
  
      console.log('Respuesta del servidor:', response);
  
      if (response.status === 200) {
        alert('Se borró correctamente');
        fetchUsers(); // Actualiza la tabla después de eliminar un registro
      } else {
        console.error('Error al eliminar registro');
        alert('Sucedió un error al intentar borrar los datos');
      }
    } catch (error) {
      console.error('Error al eliminar registro', error);
      alert('Sucedió un error al intentar borrar los datos');
    }
  };
  


  const handleStatusChange = async (id, isChecked) => {
    const newStatus = isChecked ? 'Terminado' : 'En proceso';

    try {
      await axios.put(`http://localhost:3001/api/registros_mecanicos/${id}`, { estatus: newStatus });

      setData((prevData) =>
        prevData.map((row) =>
          row.id === id ? { ...row, estatus: newStatus } : row
        )
      );
    } catch (error) {
      console.error('Error al cambiar el estatus', error);
    }
  };

  const handleOpenAgregarModal = () => {
    setShowAgregarModal(true);
  };

  const handleCloseAgregarModal = () => {
    setShowAgregarModal(false);
    fetchUsers();
  };

  const handleAgregarDatos = async (nuevosDatos) => {
    try {
      // Lógica de inserción en el modal
      // ...

      // Actualizar la lista de datos después de la inserción
      fetchUsers();
    } catch (error) {
      console.error('Error al agregar datos', error);
    }
  };

  const handleOpenEditarModal = (row) => {
    setSelectedRow(row);
    setShowEditarModal(true);
  };

  const handleCloseEditarModal = () => {
    setSelectedRow(null);
    setShowEditarModal(false);
    fetchUsers();
  };

  const handleEditarDatos = async (datosEditados) => {
    try {
      await axios.put(`http://localhost:3001/api/registros_mecanicos/${selectedRow.id}`, datosEditados);

      setData((prevData) =>
        prevData.map((row) =>
          row.id === selectedRow.id ? { ...row, ...datosEditados } : row
        )
      );

      alert('Se editó correctamente');
      handleCloseEditarModal();
    } catch (error) {
      console.error('Error al editar datos', error);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formatNumber = (num) => (num < 10 ? `0${num}` : num);

    return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(remainingSeconds)}`;
  };

  return (
    <div>
      <Header onOpenAgregarModal={handleOpenAgregarModal} />
      {showAgregarModal && (
        <AgregarDatosModal onClose={handleCloseAgregarModal} onAgregarDatos={handleAgregarDatos} />
      )}
      {showEditarModal && (
        <EditarDatosModal
          onClose={handleCloseEditarModal}
          onEditarDatos={handleEditarDatos}
          selectedRow={selectedRow}
        />
      )}

      <button className="add-button" onClick={handleOpenAgregarModal}>
        Agregar Servicio
      </button>
      <div className="flex justify-center">
        <table className="my-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre Cliente</th>
              <th>Modelo Vehiculo</th>
              <th>Servicio</th>
              <th>Piezas</th>
              <th>Comentarios</th>
              <th>Tiempo</th>
              <th>Costo Total</th>
              <th>Estatus</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
          {data.map((row) => (
  <tr key={row.id}>
    <th scope="row">{row.id}</th>
    <td>{row.nombreCliente}</td>
    <td>{row.modeloVehiculo}</td>
    <td>
      {row.servicio_nombre}
      <br />
      {"costo: " + row.precio}
    </td>
    <td>
      {row.nombre_pieza} <br />
      {"costo: " + row.costo}
    </td>
    <td>{row.comentarios}</td>
    <td>{formatTime(row.tiempo)}</td>
    <td>{row.costoTotal}</td>
    <td>
      <input
        type="checkbox"
        checked={row.estatus === 'Terminado'}
        onChange={(e) => handleStatusChange(row.id, e.target.checked)}
      />
      {row.estatus === 'Pendiente' ? 'En proceso' : 'Terminado'}
    </td>
    <td>
      <button className="icon-button" onClick={() => handleOpenEditarModal(row)}>
        <FontAwesomeIcon icon={faEdit} />
      </button>{" "}
      <button className="icon-button" onClick={() => handleDeleteClick(row)}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </td>
  </tr>
))}

          </tbody>
        </table>
      </div>
      <div className="add-button-row">
        <div className="add-button-cell"></div>
      </div>
    </div>
  );
}

export default TableMecanical;
