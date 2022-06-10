import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./modal.css"
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

export default function AsignarMuelle(){

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const handleShow2 = () => setShow2(true);
    const handleClose2 = () => setShow2(false);

    const [barco, setBarco] = useState("");
    const [idMuelle, setIdMuelle] = useState("");
    const [gruasDisponibles, setGruasDisponibles] = useState([{}]);
    const [gruasAsignadas, setGruasAsignadas] = useState([{}]);
    const [cargado, setCargado] = useState(false);
    const [spa, setSpa] = useState(process.env.IMJS_AUTH_CLIENT_CLIENT_ID);

    const access_token = localStorage.getItem("oidc.user:https://ims.bentley.com:"+spa).split("\"")[7];

    if(!cargado){
        axios
            .get("http://127.0.0.1:5000/api/gruasdisponibles")
            .then((response) => {
                setGruasDisponibles(response.data.msg);  
                setCargado(true);              
            });
        axios
            .get("http://127.0.0.1:5000/api/gruasasignadas")
            .then((response) => {
                setGruasAsignadas(response.data.msg);
            });
    }

    const asignarMuelle = (nombreBarco) => {
        if(gruasDisponibles.length>0){
            axios
                .patch("https://api.bentley.com/issues/"+gruasDisponibles[0].idIssue,
                {
                    status: "Review"
                },{
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        Accept: "application/vnd.bentley.itwin-platform.v1+json",
                        "Content-Type": "application/json",
                    },
                }).then(()=>{
                    window.location.reload();
                })
            axios
                .put(
                    "http://127.0.0.1:5000/gruas/"+gruasDisponibles[0].id,
                    {
                        estado: "Asignado",
                        nombreBarco: nombreBarco,
                    }
                )
                .then(()=>{
                    setCargado(false);
                    alert("Muelle asignado con exito");
                });            
        }else{
            alert("No hay muelles disponibles en este momento");
        }        
    }

    const atracar = (id) => {
        axios
            .patch("https://api.bentley.com/issues/"+id.split("/")[1],
            {
                status: "Approved"
            },{
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    Accept: "application/vnd.bentley.itwin-platform.v1+json",
                    "Content-Type": "application/json",
                  },
            }).then(()=>{
                window.location.reload();
            })
        axios
            .put(
                "http://127.0.0.1:5000/gruas/"+id.split("/")[0],
                {
                    estado: "Atracado",
                    barco: "Ninguno"
                }
            )
            .then(()=>{
                setCargado(false);
                alert("Barco atracado con exito");
            });
 
    }

    return(
        <>
        <Button variant="outline-success" onClick={handleShow} id="muelleButton">
            Asignar Muelle
        </Button>
        <Button variant="outline-success" onClick={handleShow2} id="atracarButton">
            Atracar
        </Button>
        <Modal show={show}>
            <Modal.Header>
            <Modal.Title className="titulo">Asignar Muelle</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group
                className="mb-3"
                controlId="formBasicBarco"
                onChange={(evt) => setBarco(evt.target.value)}
                >
                <Form.Label className="titulo">Barco</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Ingresa el nombre del barco"
                />
                </Form.Group>
                <Button
                variant="primary"
                onClick={() => {
                    if (barco === "") {
                    alert("Debe completar todos los campos.");
                    } else {
                    asignarMuelle(barco);
                    handleClose();
                    }
                }}
                >
                Asignar Muelle
                </Button>
            </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={handleClose} varian="secondary">
                Cerrar
            </Button>
            </Modal.Footer>
        </Modal>
        <Modal show={show2}>
            <Modal.Header>
            <Modal.Title className="titulo">Atracar en Muelle</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group
                className="mb-3"
                controlId="formBasicBarco"
                onChange={(evt) => setIdMuelle(evt.target.value)}
                >
                <Form.Label className="titulo">Barco</Form.Label>
                <Form.Select aria-label="Default select example">
                    <option>Selecciona barco por atracar</option>
                    {gruasAsignadas.map((obj, index) => (
                        <>
                        <option value={obj.id+"/"+obj.idIssue}>{obj.nombreBarco}</option>
                        </>
                    ))}
                </Form.Select>
                </Form.Group>
                <Button
                variant="primary"
                onClick={() => {
                    if (idMuelle === "") {
                    alert("Debe completar todos los campos.");
                    } else {
                    atracar(idMuelle);
                    handleClose2();
                    }
                }}
                >
                Atracar barco
                </Button>
            </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={handleClose2} varian="secondary">
                Cerrar
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}