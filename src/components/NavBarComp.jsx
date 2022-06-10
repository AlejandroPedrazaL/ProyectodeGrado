import React, { useState } from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import AsignarMuelle from "./AsignarMuelle";
import Carga from "./Cargar";
import Descarga from "./Descargar";
import ManejarMercancia from "./ManejarMercancia";
import Zarpar from "./Zarpar";

const NavbarComp = (props) => {
    return (
      <Navbar variant="dark" bg="dark" expand="lg">
        <Container>
            <AsignarMuelle />
            <Descarga />
            <ManejarMercancia />
            <Carga />
            <Zarpar />
        </Container>
      </Navbar>
    );
};
  
export default NavbarComp;