import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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

function App() {
  const [authenticated, setAuthenticated] = useState(false);

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
            path="/Mecanicos"
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
            path="/Piezas"
            element={
              <PrivateRoute
                element={<PartsTable />}
                isAuthenticated={authenticated}
              />
            }
          />

          <Route
            path="/VistaMec"
            element={
              <PrivateRoute
                element={<TableMecanical />}
                isAuthenticated={authenticated}
              />
            }
          />
                    <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
