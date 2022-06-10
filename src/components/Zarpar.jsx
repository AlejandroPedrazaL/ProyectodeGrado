import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import "./modal.css"
import axios from "axios";

export default function Zarpar(){

    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const [barco, setBarco] = useState("");
    const [gruasAtracadas, setGruasAtracadas] = useState([{}]);
    const [cargado, setCargado] = useState(false);

    if(!cargado){
        axios
            .get("http://127.0.0.1:5000/api/gruasatracadas")
            .then((response) => {
                setGruasAtracadas(response.data.msg);  
                setCargado(true);              
            });
    }

    async function zarpar() {
        let resp = await fetch("http://127.0.0.1:5000/api/zarpar/"+barco);
        let json = await resp.json();

        if(resp["status"] !== 200){
            alert(json["msg"]);
            return;
        }
        else{
            axios
                .put("http://127.0.0.1:5000/gruas/"+barco,
                {
                    estado: "Disponible"
                })
                .then((response) => {  
                    setCargado(true);                    
                    window.location.reload();              
                });
        }

    }

    return(
        <>
        <Button variant="outline-success" onClick={handleShow} id="zarparButton">
            Zarpar Barco
        </Button>
        <Modal show={show}>
            <Modal.Header>
            <Modal.Title className="titulo">Zarpar Barco</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group
                className="mb-3"
                controlId="formBasicBarco"
                onChange={(evt) => setBarco(evt.target.value)}
                >
                <Form.Label className="titulo">Barco</Form.Label>
                <Form.Select aria-label="Default select example">
                    <option>Selecciona barco para zarpar</option>
                    {gruasAtracadas.map((obj, index) => (
                        <>
                        <option value={obj.id}>{obj.nombreBarco}</option>
                        </>
                    ))}
              </Form.Select>
                </Form.Group>
                <Button
                variant="primary"
                onClick={() => {
                    if (barco === "") {
                    alert("Debe completar todos los campos.");
                    } else {
                    zarpar();
                    handleClose();
                    }
                }}
                >
                Zarpar Barco
                </Button>
            </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={handleClose} varian="secondary">
                Cerrar
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}