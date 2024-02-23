import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import PrivateRoute from "./PrivateRoute.js";
import Login from "./components/Login/Login.js";
import Header from "./components/Header/Header.js";
import Buttons from "./components/Buttons/Buttons.js";
import Table from "./components/Table/Table.js";
import ServicesTable from "./components/ServicesTable/ServicesTable.js";
import PartsTable from "./components/PartsTable/PartsTable.js";
import TableMecanical from "./components/TableMecanical/TableMecanical.jsx";
import IngresarToken from "./components/Login/IngresarToken.jsx";
import Boton from "./components/Buttons/Boton.js";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const { correo = '' } = useParams();  // Proporciona un valor predeterminado para correo
// console.log(correo);
  const handleLogin = () => {
    console.log("Usuario ha iniciado sesión");
    setAuthenticated(true);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/IngresarToken/:correo"
            element={
              <PrivateRoute
                element={<IngresarToken />}
                isAuthenticated={authenticated}
              />
            }
          />
          <Route
            path="/Header"
            element={
              <PrivateRoute
                element={<Header />}
                isAuthenticated={authenticated}
              />
            }
          />
          <Route
            path="/Buttons"
            element={
              <PrivateRoute
                element={<Buttons />}
                isAuthenticated={authenticated}
              />
            }
          />
          <Route
            path="/Boton"
            element={
              <PrivateRoute
                element={<Boton />}
                isAuthenticated={authenticated}
              />
            }
          />
          <Route
            path="/Mecanicos/:correo"
            element={
              <PrivateRoute
                element={<Table />}
                isAuthenticated={authenticated}
              />
            }
          />
          <Route
            path="/Servicios"
            element={
              <PrivateRoute
                element={<ServicesTable />}
                isAuthenticated={authenticated}
              />
            }
          />
          <Route
            path="/Piezas/:correo"
            element={
              <PrivateRoute
                element={<PartsTable />}
                isAuthenticated={authenticated}
              />
            }
          />
          <Route
            path="/VistaMec/:correo"
            element={
              <PrivateRoute
                element={<TableMecanical correo={correo} />}  // Pasa 'correo' como prop
                isAuthenticated={authenticated}
              />
            }
            //<Route path="/VistaMec/:correoElectronico" component={VistaMecComponent} />
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
