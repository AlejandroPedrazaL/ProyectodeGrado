import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import "./modal.css"
import axios from "axios";

export default function Carga(){

    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const [barco, setBarco] = useState("");
    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState(""); 

    const [mercanciaMateriasPrimas, setMercanciaMateriasPrimas] = useState([{}]);
    const [mercanciaTecnologia, setMercanciaTecnologia] = useState([{}]);
    const [mercanciaTextiles, setMercanciaTextiles] = useState([{}]);
    const [mercanciaMuebles, setMercanciaMuebles] = useState([{}]);
    const [mercanciaConsumibles, setMercanciaConsumibles] = useState([{}]);
    const [mercanciaOtro, setMercanciaOtro] = useState([{}]);
    const [gruasAtracadas, setGruasAtracadas] = useState([{}]);
    const [cargado, setCargado] = useState(false);

    const [spa, setSpa] = useState(process.env.IMJS_AUTH_CLIENT_CLIENT_ID);

    const access_token = localStorage.getItem("oidc.user:https://ims.bentley.com:"+spa).split("\"")[7];
    const [formId, setFormId] = useState(process.env.IMJS_AUTH_CLIENT_ISSUE_ID);

    if(!cargado){
        axios
            .get("http://127.0.0.1:5000/api/mercanciasparacargarmp")
            .then((response) => {
                setMercanciaMateriasPrimas(response.data.msg);  
                setCargado(true);              
            });
        axios
            .get("http://127.0.0.1:5000/api/mercanciasparacargartec")
            .then((response) => {
                setMercanciaTecnologia(response.data.msg);             
            });
        axios
            .get("http://127.0.0.1:5000/api/mercanciasparacargartex")
            .then((response) => {
                setMercanciaTextiles(response.data.msg);             
            });
        axios
            .get("http://127.0.0.1:5000/api/mercanciasparacargarmu")
            .then((response) => {
                setMercanciaMuebles(response.data.msg);             
            });
        axios
            .get("http://127.0.0.1:5000/api/mercanciasparacargarcon")
            .then((response) => {
                setMercanciaConsumibles(response.data.msg);             
            });
        axios
            .get("http://127.0.0.1:5000/api/mercanciasparacargaro")
            .then((response) => {
                setMercanciaOtro(response.data.msg);             
            });
        axios
            .get("http://127.0.0.1:5000/api/gruasatracadas")
            .then((response) => {
                setGruasAtracadas(response.data.msg);
            });
    }

    const cargarMercancia = () => {
        console.log(nombre)
        axios
            .patch("https://api.bentley.com/issues/"+nombre.split("/")[2],
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

        let x=0, y=0, z=0;

        switch(barco.split("/")[1]){
            case "1":
              x=-176;
              y=-122;
              z=48
              break;
            case "2":
              x=229;
              y=-85;
              z=48
              break;
            default:
              x=670;
              y=-41;
              z=48
              break;
          }
      
        let barcoNombre = barco.split("/")[0];
        let mercanciaNombre = nombre.split("/")[1];
        let mercanciaId = nombre.split("/")[0];

        axios
            .post("https://api.bentley.com/issues/",
            {
              formId: formId,
              subject: mercanciaNombre,
              description: "Dejar "+mercanciaNombre+" en el muelle indicado",
              dueDate:"2023-07-30T00:00:00Z",
               modelPin: {
                    location: {
                        x: x,
                        y: y,
                        z: z
                    },
                    description: "Localizacion de la descarga de la mercancia"
                }
            },{
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    Accept: "application/vnd.bentley.itwin-platform.v1+json",
                    "Content-Type": "application/json",
                },
            }).then((response)=>{
                
                console.log(response.data)
                console.log(response.data.issue.id)
                axios
                    .patch("https://api.bentley.com/issues/"+response.data.issue.id,
                    {
                        status: "Assigned"
                    },{
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            Accept: "application/vnd.bentley.itwin-platform.v1+json",
                            "Content-Type": "application/json",
                        },
                    }).then(()=>{
                        axios
                            .patch("https://api.bentley.com/issues/"+response.data.issue.id,
                            {
                                status: "Review"
                            },{
                                headers: {
                                    Authorization: `Bearer ${access_token}`,
                                    Accept: "application/vnd.bentley.itwin-platform.v1+json",
                                    "Content-Type": "application/json",
                                },
                            }).then(()=>{
                                axios
                                    .patch("https://api.bentley.com/issues/"+response.data.issue.id,
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
                            })
                    })

                axios
                    .put("http://127.0.0.1:5000/mercancias/"+mercanciaId,
                    {
                    estado: "Cargando",
                    barcoSalida: barcoNombre,
                    idIssueSalida: response.data.issue.id
                    })
                    .then(() => { 
                        setCargado(false);    
                        alert("Mercancia cargada con exito");          
                    });
            })
        
    }

    return(
        <>
        <Button variant="outline-success" onClick={handleShow} id="cargarButton">
            Cargar
        </Button>
        <Modal show={show}>
            <Modal.Header>
            <Modal.Title className="titulo">Cargar</Modal.Title>
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
                        <option>Selecciona barco para cargar</option>
                        {gruasAtracadas.map((obj, index) => (
                        <>
                        <option value={obj.nombreBarco+"/"+obj.id}>{obj.nombreBarco}</option>
                        </>
                    ))}
                </Form.Select>
                </Form.Group>
                <Form.Group
                className="mb-3"
                controlId="formBasicTipo"
                onChange={(evt) => setTipo(evt.target.value)}
                >
                <Form.Label className="titulo">Tipo de la mercancia</Form.Label>
                <Form.Select aria-label="Select Tipo">
                    <option>Selecciona tipo de mercancia</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Textiles">Textiles</option>
                    <option value="Muebles">Muebles</option>
                    <option value="Materias Primas">Materias Primas</option>
                    <option value="Consumibles">Consumibles</option>
                    <option value="Otro">Otro</option>
                </Form.Select>
                </Form.Group>
                <Form.Group
                className="mb-3"
                controlId="formBasicNombre"
                onChange={(evt) => setNombre(evt.target.value)}
                >
                <Form.Label className="titulo">Nombre de la mercancia</Form.Label>
                <Form.Select aria-label="Default select example">
                    <option>Selecciona mercancia para cargar</option>
                    {tipo==''?(<></>):(<>
                        {tipo=='Tecnologia'?(<>
                                {mercanciaTecnologia.map((obj, index) => (
                                    <>
                                    <option value={obj.id+"/"+obj.nombre+"/"+obj.idIssueBodega}>{obj.nombre}</option>
                                    </>
                                ))}
                            </>):(<>
                                {tipo=='Textiles'?(<>
                                        {mercanciaTextiles.map((obj, index) => (
                                            <>
                                            <option value={obj.id+"/"+obj.nombre+"/"+obj.idIssueBodegabj}>{obj.nombre}</option>
                                            </>
                                        ))}
                                    </>):(<>
                                        {tipo=='Muebles'?(<>
                                            {mercanciaMuebles.map((obj, index) => (
                                                <>
                                                <option value={obj.id+"/"+obj.nombre+"/"+obj.idIssueBodega}>{obj.nombre}</option>
                                                </>
                                            ))}
                                            </>):(<>
                                                {tipo=='Materias Primas'?(<>
                                                        {mercanciaMateriasPrimas.map((obj, index) => (
                                                            <>
                                                            <option value={obj.id+"/"+obj.nombre+"/"+obj.idIssueBodega}>{obj.nombre}</option>
                                                            </>
                                                        ))}
                                                    </>):(<>
                                                        {tipo=='Consumibles'?(<>
                                                                {mercanciaConsumibles.map((obj, index) => (
                                                                    <>
                                                                    <option value={obj.id+"/"+obj.nombre+"/"+obj.idIssueBodega}>{obj.nombre}</option>
                                                                    </>
                                                                ))}
                                                            </>):(<>
                                                                {mercanciaOtro.map((obj, index) => (
                                                                    <>
                                                                    <option value={obj.id+"/"+obj.nombre+"/"+obj.idIssueBodega}>{obj.nombre}</option>
                                                                    </>
                                                                ))}
                                                        </>)}
                                                </>)}
                                        </>)}
                                </>)}
                        </>)}
                    </>)}
                </Form.Select>
                </Form.Group>
                <Button
                variant="primary"
                onClick={() => {
                    if (barco === "" || nombre === "" || tipo === "") {
                    alert("Debe completar todos los campos.");
                    } else {
                    cargarMercancia();
                    handleClose();
                    }
                }}
                >
                Cargar mercancia
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