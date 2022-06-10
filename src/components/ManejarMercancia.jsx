import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import "./modal.css"
import axios from "axios";

export default function ManejarMercancia(){

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const handleShow2 = () => setShow2(true);
    const handleClose2 = () => setShow2(false);

    const [proceso, setProceso] = useState("");
    const [mercancia, setMercancia] = useState("");
    const [mercanciaDescargada, setMercanciaDescargada] = useState([{}]);
    const [mercanciaCargadando, setMercanciaCargadando] = useState([{}]);
    const [mercanciaMoverBodega, setMercanciaMoverBodega] = useState([{}]);
    const [mercanciaMoverBarco, setMercanciaMoverBarco] = useState([{}]);
    const [cargado, setCargado] = useState(false);

    
    const [spa, setSpa] = useState(process.env.IMJS_AUTH_CLIENT_CLIENT_ID);

    const access_token = localStorage.getItem("oidc.user:https://ims.bentley.com:"+spa).split("\"")[7];

    

    if(!cargado){
        axios
            .get("http://127.0.0.1:5000/api/mercanciasdescargadas")
            .then((response) => {
                setMercanciaDescargada(response.data.msg);  
                setCargado(true);              
            });
        axios
            .get("http://127.0.0.1:5000/api/mercanciascargando")
            .then((response) => {
                setMercanciaCargadando(response.data.msg);            
            });
        axios
            .get("http://127.0.0.1:5000/api/mercanciasmoverbodega")
            .then((response) => {
                setMercanciaMoverBodega(response.data.msg);            
            });
        axios
            .get("http://127.0.0.1:5000/api/mercanciasmoverbarco")
            .then((response) => {
                setMercanciaMoverBarco(response.data.msg);            
            });
    }

    const recogerMercancia = () => {
        if(proceso=="Descarga"){
            axios
                .patch("https://api.bentley.com/issues/"+mercancia.split("/")[1],
                {
                    status: "Review"
                },{
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        Accept: "application/vnd.bentley.itwin-platform.v1+json",
                        "Content-Type": "application/json",
                    },
                }).then(()=>{
                })
            axios
                .patch("https://api.bentley.com/issues/"+mercancia.split("/")[2],
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
                    "http://127.0.0.1:5000/mercancias/"+mercancia.split("/")[0],
                    {
                        estado: "Moviendo a bodega"
                    }
                )
                .then(()=>{
                    setCargado(false);
                    alert("Mercancia moviendose a bodega con exito");
                });

        }else if(proceso=="Carga"){
                axios
                    .patch("https://api.bentley.com/issues/"+mercancia.split("/")[1],
                    {
                        status: "Review"
                    },{
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            Accept: "application/vnd.bentley.itwin-platform.v1+json",
                            "Content-Type": "application/json",
                        },
                    }).then(()=>{
                    })

                axios
                    .patch("https://api.bentley.com/issues/"+mercancia.split("/")[2],
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
                        "http://127.0.0.1:5000/mercancias/"+mercancia.split("/")[0],
                        {
                            estado: "Moviendo a barco"
                        }
                    )
                    .then(()=>{
                        setCargado(false);
                        alert("Mercancia moviendose a barco con exito");
                    });
                
        }
    }

    const dejarMercancia = () => {
        if(proceso=="Descarga"){
            axios
                .patch("https://api.bentley.com/issues/"+mercancia.split("/")[1],
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
                    "http://127.0.0.1:5000/mercancias/"+mercancia.split("/")[0],
                    {
                        estado: "En bodega"
                    }
                )
                .then(()=>{
                    setCargado(false);
                    alert("Mercancia dejada en bodega con exito");
                });

        }else if(proceso=="Carga"){
            axios
                .patch("https://api.bentley.com/issues/"+mercancia.split("/")[1],
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
                    "http://127.0.0.1:5000/api/mercanciamoverbarco/"+mercancia.split("/")[0],
                    {
                        estado: "En barco"
                    }
                )
                .then(()=>{
                    setCargado(false);
                    alert("Mercancia dejada en barco con exito");
                });

        }
    }

    return(
        <>
        <Button variant="outline-success" onClick={handleShow} id="recogerButton">
            Recoger Mercancia
        </Button>
        <Button variant="outline-success" onClick={handleShow2} id="dejarButton">
            Dejar Mercancia
        </Button>
        <Modal show={show}>
            <Modal.Header>
            <Modal.Title className="titulo">Recoger Mercancia</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group
                className="mb-3"
                controlId="formBasicBarco"
                onChange={(evt) => setProceso(evt.target.value)}
                >
                <Form.Label className="titulo">Proceso</Form.Label>
                <Form.Select aria-label="Default select example">
                    <option value="">Selecciona el proceso</option>
                    <option value="Descarga">Descarga</option>
                    <option value="Carga">Carga</option>
                </Form.Select>
                </Form.Group>
                <Form.Group
                className="mb-3"
                controlId="formBasicBarco"
                onChange={(evt) => setMercancia(evt.target.value)}
                >
                <Form.Label className="titulo">Mercancia</Form.Label>
                <Form.Select aria-label="Default select example">
                    <option>Selecciona la mercancia</option>
                    {proceso==""?(<></>):(proceso=="Descarga"?(<>
                    {mercanciaDescargada.map((obj, index) => (
                        <>
                        <option value={obj.id+"/"+obj.idIssueBodega+"/"+obj.idIssueLlegada}>{obj.nombre}</option>
                        </>
                    ))}
                    </>):(<>
                    {mercanciaCargadando.map((obj, index) => (
                        <>
                        <option value={obj.id+"/"+obj.idIssueSalida+"/"+obj.idIssueBodega}>{obj.nombre}</option>
                        </>
                    ))}
                    </>))}
                </Form.Select>
                </Form.Group>
                <Button
                variant="primary"
                onClick={() => {
                    if (proceso === "" || mercancia === "") {
                    alert("Debe completar todos los campos.");
                    } else {
                    recogerMercancia();
                    handleClose();
                    }
                }}
                >
                Recoger Mercancia
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
            <Modal.Title className="titulo">Dejar Mercancia</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group
                className="mb-3"
                controlId="formBasicProceso"
                onChange={(evt) => setProceso(evt.target.value)}
                >
                <Form.Label className="titulo">Proceso</Form.Label>
                <Form.Select aria-label="Default select example">
                    <option value="">Selecciona el proceso</option>
                    <option value="Descarga">Descarga</option>
                    <option value="Carga">Carga</option>
                </Form.Select>
                </Form.Group>
                <Form.Group
                className="mb-3"
                controlId="formBasicProceso"
                onChange={(evt) => setMercancia(evt.target.value)}
                >
                <Form.Label className="titulo">Mercancia</Form.Label>
                <Form.Select aria-label="Default select example">
                    <option>Selecciona la mercancia</option>
                    {proceso==""?(<></>):(proceso=="Descarga"?(<>
                    {mercanciaMoverBodega.map((obj, index) => (
                        <>
                        <option value={obj.id+"/"+obj.idIssueBodega}>{obj.nombre}</option>
                        </>
                    ))}
                    </>):(<>
                    {mercanciaMoverBarco.map((obj, index) => (
                        <>
                        <option value={obj.id+"/"+obj.idIssueSalida}>{obj.nombre}</option>
                        </>
                    ))}
                    </>))}
                </Form.Select>
                </Form.Group>
                <Button
                variant="primary"
                onClick={() => {
                    if (proceso === "" || mercancia === "") {
                    alert("Debe completar todos los campos.");
                    } else {
                    dejarMercancia();
                    handleClose2();
                    }
                }}
                >
                Dejar Mercancia
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