import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import NuevoModalParts from './NuevoModalParts.jsx';
import EditarModal from './EditarModal.jsx';
import './PartsTable.css';
import Buttons from '../Buttons/Buttons.js';
import Header from '../Header/Header.js';
import Boton from '../Buttons/Boton.js';
import { Link, useParams } from 'react-router-dom';

const PartsTable = () => {
  const { correo } = useParams();
  const [parts, setParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/piezas');
      const data = await response.json();
      const partsWithEdited = data.map((part) => ({ ...part, edited: [false, false, false] }));
      setParts(partsWithEdited);
    } catch (error) {
      console.error('Error al obtener datos del servidor:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleModalClose = () => {
    setSelectedPart(null);
    setUpdateModalVisible(false);
    setAddModalVisible(false);
  };

  const handleAddPart = () => {
    setAddModalVisible(true);
  };

  const handleDeletePart = async (part) => {
    try {
      const response = await fetch(`http://localhost:3001/api/piezas/${part.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      } else {
        console.error('Error al eliminar pieza:', response.statusText);
      }
    } catch (error) {
      console.error('Error al eliminar pieza:', error.message);
    }
  };

  const handleUpdatePart = (part) => {
    setSelectedPart(part);
    setUpdateModalVisible(true);
  };

  const handleSavePart = async (formData) => {
    try {
      const response = await fetch('http://localhost:3001/api/piezas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al enviar datos al servidor');
      }

      const result = await response.json();
      console.log('Respuesta del servidor:', result);

      fetchData();
    } catch (error) {
      console.error('Error al enviar datos al servidor:', error);
    }
  };

  return (
    <div>
      <Header />
      <br/>
      <h1>Piezas</h1>
      <Link to={`/VistaMec/${correo}`}>
  <button className='BotonPiezas'>Mecanicos</button>
</Link>
      <br/>
      <br/>
      <table className="parts-table">
        <thead>
          <tr>
            <th>Pieza</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part) => (
            <tr key={part.id}>
              <td>
                <input type="text" value={part.nombre_pieza} readOnly />
              </td>
              <td>
                <input type="text" value={part.cantidad} readOnly />
              </td>
              <td>
                <input type="text" value={part.costo} readOnly />
              </td>
              <td>
                <button onClick={() => handleUpdatePart(part)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDeletePart(part)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-button" onClick={handleAddPart}>
        <FontAwesomeIcon icon={faPlus} /> Agregar Pieza
      </button>

      {isAddModalVisible && (
        <NuevoModalParts
          onCloseModal={handleModalClose}
          onSave={async (formData) => {
            try {
              const response = await fetch('http://localhost:3001/api/piezas', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
              });

              if (!response.ok) {
                throw new Error('Error al enviar datos al servidor');
              }

              const result = await response.json();
              console.log('Respuesta del servidor:', result);

              fetchData();
              setAddModalVisible(false);
            } catch (error) {
              console.error('Error al enviar datos al servidor:', error);
            }
          }}
        />
      )}

      {isUpdateModalVisible && selectedPart && (
        <EditarModal
          part={selectedPart}
          onCloseModal={() => setUpdateModalVisible(false)}
          onSave={async (formData) => {
            try {
              const response = await fetch(`http://localhost:3001/api/piezas/${selectedPart.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
              });

              if (!response.ok) {
                throw new Error('Error al enviar datos al servidor');
              }

              const result = await response.json();
              console.log('Respuesta del servidor:', result);

              fetchData();
              setUpdateModalVisible(false);
            } catch (error) {
              console.error('Error al enviar datos al servidor:', error);
            }
          }}
        />
      )}
    </div>
  );
};

export default PartsTable;
