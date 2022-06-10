import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import "./modal.css"
import axios from "axios";

export default function Descarga(){
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [barco, setBarco] = useState("");
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");  
  const [descripcion, setDescripcion] = useState("");
  let bodega ="";

  const [gruasAtracadas, setGruasAtracadas] = useState([{}]);
  const [mercanciaEnBodega, setMercanciaEnBodega] = useState([{}]);
  const [cargado, setCargado] = useState(false);
  const [spa, setSpa] = useState(process.env.IMJS_AUTH_CLIENT_CLIENT_ID);

  const access_token = localStorage.getItem("oidc.user:https://ims.bentley.com:"+spa).split("\"")[7];
  const [formId, setFormId] = useState(process.env.IMJS_AUTH_CLIENT_ISSUE_ID);

  let a=0, b=0, c=0, d=0;
  let v="a", min=a;
  let x=0,y=0,z=0;
  let x1=0, y1=0, z1=0;

  if(!cargado){
    axios
        .get("http://127.0.0.1:5000/api/gruasatracadas")
        .then((response) => {
            setGruasAtracadas(response.data.msg);  
            setCargado(true);              
        });
    axios
        .get("http://127.0.0.1:5000/api/mercanciasenbodega")
        .then((response) => {
            setMercanciaEnBodega(response.data.msg);             
        });
  }

  const descargarMercancia = () => {
    switch(tipo){
      case "Materias Primas":
        a=0, b=0, c=0, d=0;
        for(let i=0; i<mercanciaEnBodega.length;i++){
          if(mercanciaEnBodega[i].bodega == "6a")
            a+=1;
          else if(mercanciaEnBodega[i].bodega == "6b")
            b+=1;
          else if(mercanciaEnBodega[i].bodega == "6c")
            c+=1;
          else if(mercanciaEnBodega[i].bodega == "6d")
            d+=1;
        }
        v="a", min=a;
        if(min>b){
          min=b;
          v="b";
        }
        if(min>c){
          min=c;
          v="c";
        }
        if(min>d){
          min=d;
          v="d";
        }
        bodega="6"+v;
        break;
      case "Tecnologia":
        a=0, b=0, c=0, d=0;
        for(let i=0; i<mercanciaEnBodega.length;i++){
          if(mercanciaEnBodega[i].bodega == "5a")
            a+=1;
          else if(mercanciaEnBodega[i].bodega == "5b")
            b+=1;
          else if(mercanciaEnBodega[i].bodega == "5c")
            c+=1;
          else if(mercanciaEnBodega[i].bodega == "5d")
            d+=1;
        }
        v="a", min=a;
        if(min>b){
          min=b;
          v="b";
        }
        if(min>c){
          min=c;
          v="c";
        }
        if(min>d){
          min=d;
          v="d";
        }
        bodega="5"+v;
        break;
      case "Textiles":
        a=0, b=0, c=0;
        for(let i=0; i<mercanciaEnBodega.length;i++){
          if(mercanciaEnBodega[i].bodega == "4a")
            a+=1;
          else if(mercanciaEnBodega[i].bodega == "4b")
            b+=1;
          else if(mercanciaEnBodega[i].bodega == "4c")
            c+=1;
        }
        v="a", min=a;
        if(min>b){
          min=b;
          v="b";
        }
        if(min>c){
          min=c;
          v="c";
        }
        bodega="4"+v;
        break;
      case "Consumibles":
        a=0, b=0, c=0;
        for(let i=0; i<mercanciaEnBodega.length;i++){
          if(mercanciaEnBodega[i].bodega == "3a")
            a+=1;
          else if(mercanciaEnBodega[i].bodega == "3b")
            b+=1;
          else if(mercanciaEnBodega[i].bodega == "3c")
            c+=1;
        }
        v="a", min=a;
        if(min>b){
          min=b;
          v="b";
        }
        if(min>c){
          min=c;
          v="c";
        }
        bodega="3"+v;
        break;
      case "Muebles":
        a=0, b=0, c=0;
        for(let i=0; i<mercanciaEnBodega.length;i++){
          if(mercanciaEnBodega[i].bodega == "2a")
            a+=1;
          else if(mercanciaEnBodega[i].bodega == "2b")
            b+=1;
          else if(mercanciaEnBodega[i].bodega == "2c")
            c+=1;
        }
        v="a", min=a;
        if(min>b){
          min=b;
          v="b";
        }
        if(min>c){
          min=c;
          v="c";
        }
        bodega="2"+v;
        break;
      default:
        a=0, b=0, c=0;
        for(let i=0; i<mercanciaEnBodega.length;i++){
          if(mercanciaEnBodega[i].bodega == "1a")
            a+=1;
          else if(mercanciaEnBodega[i].bodega == "1b")
            b+=1;
          else if(mercanciaEnBodega[i].bodega == "1c")
            c+=1;
        }
        v="a", min=a;
        if(min>b){
          min=b;
          v="b";
        }
        if(min>c){
          min=c;
          v="c";
        }
        bodega="1"+v;
        break;
    }
    
    z1=38;

    switch(bodega){
      case "1a":
          x1=-128;
          y1=-155;
          break;
      case "1b":
          x1=-124;
          y1=-184;
          break;
      case "1c":
          x1=-121;
          y1=-210;
          break;
      case "2a":
          x1=101;
          y1=-130;
          break;
      case "2b":
          x1=102;
          y1=-162;
          break;
      case "2c":
          x1=-102;
          y1=-190;
          break;
      case "3a":
          x1=312;
          y1=-110;
          break;
      case "3b":
          x1=316;
          y1=-142;
          break;
      case "3c":
          x1=318;
          y1=-167;
          break;
      case "4a":
          x1=589;
          y1=-84;
          break;
      case "4b":
          x1=588;
          y1=-119;
          break;
      case "4c":
          x1=589;
          y1=-144;
          break;
      case "5a":
          x1=795;
          y1=-63;
          break;
      case "5b":
          x1=797;
          y1=-98;
          break;
      case "5c":
          x1=797;
          y1=-122;
          break;
      case "5d":
          x1=806;
          y1=-154;
          break;
      case "6a":
          x1=966;
          y1=-48;
          break;
      case "6b":
          x1=969;
          y1=-81;
          break;
      case "6c":
          x1=971;
          y1=-107;
          break;
      case "6d":
          x1=-973;
          y1=-138;
          break;
    }

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

    let barcoNombre =barco.split("/")[0]
    axios
      .post("https://api.bentley.com/issues/",
      {
        formId: formId,
        subject: nombre,
        description: "Recoger "+nombre+" en el muelle indicado",
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
          let idIssueLlegada = response.data.issue.id;
          axios
            .patch("https://api.bentley.com/issues/"+idIssueLlegada,
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
                  .patch("https://api.bentley.com/issues/"+idIssueLlegada,
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
            })

            axios
            .post("https://api.bentley.com/issues/",
            {
              formId: formId,
              subject: nombre,
              description: "Dejar o recoger "+nombre+" en la bodega indicado",
              dueDate:"2023-07-30T00:00:00Z",
               modelPin: {
                    location: {
                        x: x1,
                        y: y1,
                        z: z1
                    },
                    description: "Localizacion de la mercancia en la bodega"
                }
            },{
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    Accept: "application/vnd.bentley.itwin-platform.v1+json",
                    "Content-Type": "application/json",
                },
            }).then((response1)=>{
              axios
                .patch("https://api.bentley.com/issues/"+response1.data.issue.id,
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
                      .patch("https://api.bentley.com/issues/"+response1.data.issue.id,
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
                            .patch("https://api.bentley.com/issues/"+response1.data.issue.id,
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
                        .post("http://127.0.0.1:5000/mercancias",
                        {
                          nombre: nombre,
                          tipo: tipo,
                          descripcion: descripcion,
                          estado: "Descargando",
                          bodega: bodega.split("/")[0],
                          barcoLlegada: barcoNombre,
                          idIssueLlegada: idIssueLlegada,
                          idIssueBodega: response1.data.issue.id,
                          idIssueSalida: ""
                        })
                        .then(() => { 
                            setCargado(false);    
                            alert("Mercancia descargada con exito");          
                        });

                })   

              })

  }

  return (
    <>
      <Button variant="outline-success" onClick={handleShow} id="descargarButton">
        Descargar
      </Button>
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title className="titulo">Descargar</Modal.Title>
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
                    <option>Selecciona barco para descargar</option>
                    {gruasAtracadas.map((obj, index) => (
                        <>
                        <option value={obj.nombreBarco+"/"+obj.id}>{obj.nombreBarco}</option>
                        </>
                    ))}
              </Form.Select>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="formBasicNombre"
              onChange={(evt) => setNombre(evt.target.value)}
            >
              <Form.Label className="titulo">Nombre de la mercancia</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el nombre de la mercancia"
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="formBasicTipo"
              onChange={(evt) => setTipo(evt.target.value)}
            >
              <Form.Label className="titulo">Tipo de la mercancia</Form.Label>
              <Form.Select aria-label="Select Tipo">
                <option>Selecciona tipo de la mercancia</option>
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
              controlId="formBasicDescripcion"
              onChange={(evt) => setDescripcion(evt.target.value)}
            >
              <Form.Label className="titulo">Descripcion de la mercancia</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa la descripcion de la mercancia"
                as="textarea"
                rows={3}
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={() => {
                if (barco === "" || nombre === "" || tipo === "" || descripcion === "") {
                  alert("Debe completar todos los campos.");
                } else {
                  descargarMercancia();
                  handleClose();
                }
              }}
            >
              Añadir mercancia
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