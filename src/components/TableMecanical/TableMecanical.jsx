import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import AgregarDatosModal from './modal';
import EditarDatosModal from './editarModal'; // Asegúrate de importar el componente EditarDatosModal
import './styles.css';
import Boton from '../Buttons/Boton';
import { useParams, useNavigate, Link } from 'react-router-dom';


function TableMecanical(props) {
  const { correo } = useParams();
  const [data, setData] = useState([]);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [editedRow, setEditedRow] = useState({});
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));
  const [proveedor, setProveedor] = useState(0); // Agregado para almacenar el valor de proveedor


  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    // Consulta la API para obtener el valor actual de proveedor
    const fetchProveedor = async () => {
      try {
        // Verifica si props.correo tiene un valor antes de realizar la solicitud
        if (!correo) {
          console.error('Correo no definido');
          return;
        }

        const response = await axios.get(`http://localhost:3001/api/verificarproveedor/${correo}`);
        const proveedorValue = response.data.proveedor;
        // Actualiza el estado de proveedor
        setProveedor(proveedorValue);
      } catch (error) {
        console.error('Error al obtener datos de proveedor', error);
      }
    };

    fetchProveedor();
  }, [correo]);


  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/registros_mecanicos');
      const mainData = response.data;

      const detailedData = mainData.map((row) => {
        const tiempoInicio = row.tiempo || 0;
        const currentTime = Math.floor(Date.now() / 1000);
        const tiempoTranscurrido = currentTime - tiempoInicio;

        return {
          ...row,
          tiempoTranscurrido,
        };
      });

      setData(detailedData || []);
    } catch (error) {
      console.error('Error al obtener datos de la API', error);
      setData([]);
    }
  };

  const handleDeleteClick = async (row) => {
    try {
      console.log(".a.a.a.a-", row);
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

  const handleOpenAgregarModal = () => {
    setShowAgregarModal(true);
  };

  const handleCloseAgregarModal = () => {
    setShowAgregarModal(false);
    fetchUsers();
  };


  const handleAgregarDatos = async (nuevosDatos) => {
    try {
      // Lógica para agregar datos (si es necesario)
      fetchUsers();
    } catch (error) {
      console.error('Error al agregar datos', error);
    }
  };

  const handleOpenEditarModal = (row) => {
    setShowEditarModal(true);
    setEditedRow(row);
  };

  const handleCloseEditarModal = () => {
    setShowEditarModal(false);
    setEditedRow({});
    fetchUsers();
  };

  const handleEditarDatos = async (datosEditados) => {
    try {
      // Actualizar la fila correspondiente en el estado data
      setData((prevData) => {
        const updatedData = prevData.map((row) => (row.id === datosEditados.id ? datosEditados : row));
        return updatedData;
      });
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



  const handleTerminarClick = async (row) => {
    try {
      // Lógica para cambiar el estado a "Terminado" (si es necesario)
      console.log('Intentando cambiar el estatus a "Terminado" para el registro con ID:', row.id);

      const response = await axios.put(`http://localhost:3001/api/registros_mecanicos/${row.id}`, {
        estatus: "Terminado",
      });

      console.log('Respuesta del servidor:', response);

      if (response.status === 200) {
        alert('Se cambió el estatus correctamente');
        fetchUsers(); // Actualiza la tabla después de cambiar el estatus
      } else {
        console.error('Error al cambiar el estatus');
        alert('Sucedió un error al intentar cambiar el estatus');
      }
    } catch (error) {
      console.error('Error al cambiar el estatus', error);
      alert('Sucedió un error al intentar cambiar el estatus');
    }
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
          editedRow={editedRow}
        />
      )}
      <br/>
      <br/>
      <br/>
      <Link to={`/Piezas/${correo}`}>       
       <button className={`BotonPiezas ${proveedor == 1 ? '' : 'disabled'}`} disabled={proveedor !== 1}>
        Piezas
      </button>
      </Link>
      <br/>
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
              <th>Servicios Extras</th>
              <th>Piezas Extras</th>
              <th>Comentarios</th>
              <th>Tiempo</th>
              <th>Costo Total</th>
              <th>Estatus</th> {/* Nueva columna */}
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
                  {row.servicio_nombre && (
                    <>
                      {row.servicio_nombre}
                      <br />
                      {"costo: " + row.servicio_precio}
                      <br />
                    </>
                  )}
                </td>
                <td>
                  {row.nombre_pieza && (
                    <>
                      {row.nombre_pieza}
                      <br />
                      {"costo: " + row.pieza_costo}
                      <br />
                    </>
                  )}
                </td>
                <td>
                  {row.serviciosAdicionales &&
                    row.serviciosAdicionales.map((servicio) => (
                      <div key={servicio.id}>
                        {servicio.nombre}
                        <br />
                        {"costo: " + servicio.precio}
                      </div>
                    ))}
                </td>
                <td>
                  {row.piezasAdicionales &&
                    row.piezasAdicionales.map((pieza) => (
                      <div key={pieza.id}>
                        {pieza.nombre}
                        <br />
                        {"costo: " + pieza.costo}
                      </div>
                    ))}
                </td>
                <td>{row.comentarios}</td>
                <td>{formatTime(row.tiempoTranscurrido)}</td>
                <td>{row.costoTotal}</td>
                <td>{row.estatus || "En proceso"}</td>
                <td>
                  {(row.estatus === "En proceso" || row.estatus === null) && (
                    <>
                      <button className="icon-button" onClick={() => handleOpenEditarModal(row)}>
                        Editar
                      </button>{" "}
                      <button className="icon-button" onClick={() => handleDeleteClick(row)}>
                        Eliminar
                      </button>{" "}
                      {row.estatus === "En proceso" && (
                        <button className="icon-button" onClick={() => handleTerminarClick(row)}>
                          Terminar
                        </button>
                      )}
                    </>
                  )}
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
};

export default TableMecanical;