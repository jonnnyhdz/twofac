import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Buttons.css';

const Boton = () => {
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  const handleButtonMouseEnter = (buttonName) => {
    setSelectedButton(buttonName);
  };

  const handleButtonMouseLeave = () => {
    setSelectedButton(null);
  };

  return (
    <div className="buttons-container">
      <Link
        to="/VistaMec"
        className={`button ${selectedButton === 'Mecanicos' ? 'selected' : ''}`}
        onClick={() => handleButtonClick('Mecanicos')}
        onMouseEnter={() => handleButtonMouseEnter('Mecanicos')}
        onMouseLeave={handleButtonMouseLeave}
      >
        Mecánicos
      </Link>
    </div>
  );
}

export default Boton;
