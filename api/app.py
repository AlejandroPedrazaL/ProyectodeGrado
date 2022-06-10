from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource 
import json
from flask_cors.extension import CORS
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)
ma = Marshmallow(app)
api = Api(app)
CORS(app)

class Mercancia(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String(255))
    tipo = db.Column(db.String(255))
    descripcion = db.Column(db.String(255))
    estado = db.Column(db.String(255))
    bodega = db.Column(db.String(255))
    barcoLlegada = db.Column(db.String(255))
    barcoSalida = db.Column(db.String(255))
    fechaLlegada = db.Column(db.DateTime)
    fechaSalida = db.Column(db.DateTime)
    idIssueLlegada = db.Column(db.String(255))
    idIssueBodega = db.Column(db.String(255))
    idIssueSalida = db.Column(db.String(255))

class Grua(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String(255))
    estado = db.Column(db.String(255))
    nombreBarco = db.Column(db.String(255))
    idIssue = db.Column(db.String(255))

class Mercancia_Schema(ma.Schema):
    class Meta:
        fields = ("id", "nombre", "tipo", "descripcion", "estado", "bodega", "barcoLlegada", "barcoSalida", "fechaLlegada", "fechaSalida", "idIssueLlegada", "idIssueBodega", "idIssueSalida")

class Grua_Schema(ma.Schema):
    class Meta:
        fields = ("id", "nombre", "estado", "nombreBarco","idIssue")

schema_mercancia = Mercancia_Schema()
schema_mercancias = Mercancia_Schema(many=True)

schema_grua = Grua_Schema()
schema_gruas = Grua_Schema(many=True)

class RecursoListarMercancias(Resource):
    def get(self):
        mercancias = Mercancia.query.all()
        return schema_mercancias.dump(mercancias)

    def post(self):
            nueva_mercancia = Mercancia(
                nombre = request.json['nombre'],
                tipo = request.json['tipo'],
                descripcion = request.json['descripcion'],
                estado = request.json['estado'],
                bodega = request.json['bodega'],
                barcoLlegada = request.json['barcoLlegada'],
                barcoSalida = 'Ninguno',
                fechaLlegada = datetime.now(),
                fechaSalida = datetime.now(),
                idIssueLlegada = request.json['idIssueLlegada'],
                idIssueBodega = request.json['idIssueBodega'],
                idIssueSalida = request.json['idIssueSalida']
            )
            db.session.add(nueva_mercancia)
            db.session.commit()
            return schema_mercancia.dump(nueva_mercancia)

class RecursoListarGruas(Resource):
    def get(self):
        gruas = Grua.query.all()
        return schema_gruas.dump(gruas)

    def post(self):
            nueva_grua = Grua(
                nombre = request.json['nombre'],
                estado = request.json['estado'],
                nombreBarco = request.json['nombreBarco'],
                idIssue = request.json['idIssue']
            )
            db.session.add(nueva_grua)
            db.session.commit()
            return schema_grua.dump(nueva_grua)

class RecursoUnaMercancia(Resource):
    def get(self, id_mercancia):
        mercancia = Mercancia.query.get_or_404(id_mercancia)
        return schema_mercancia.dump(mercancia)
  
    def put(self, id_mercancia):
        mercancia = Mercancia.query.get_or_404(id_mercancia)
        if 'nombre' in request.json:
            mercancia.nombre = request.json['nombre']
        if 'tipo' in request.json:
            mercancia.tipo = request.json['tipo']
        if 'descripcion' in request.json:
            mercancia.descripcion = request.json['descripcion']
        if 'estado' in request.json:
            mercancia.estado = request.json['estado']
        if 'bodega' in request.json:
            mercancia.bodega = request.json['bodega']
        if 'barcoLlegada' in request.json:
            mercancia.barcoLlegada = request.json['barcoLlegada']
        if 'barcoSalida' in request.json:
            mercancia.barcoSalida = request.json['barcoSalida']
        if 'fechaLlegada' in request.json:
            mercancia.fechaLlegada = request.json['fechaLlegada']
        if 'fechaSalida' in request.json:
            mercancia.fechaSalida = request.json['fechaSalida']
        if 'idIssueLlegada' in request.json:
            mercancia.idIssueLlegada = request.json['idIssueLlegada']
        if 'idIssueBodega' in request.json:
            mercancia.idIssueBodega = request.json['idIssueBodega']
        if 'idIssueSalida' in request.json:
            mercancia.idIssueSalida = request.json['idIssueSalida']
        db.session.commit()
        return schema_mercancia.dump(mercancia)

    def delete(self, id_mercancia):
        mercancia = Mercancia.query.get_or_404(id_mercancia)
        db.session.delete(mercancia)
        db.session.commit()
        return '', 204

class RecursoUnaGrua(Resource):
    def get(self, id_grua):
        grua = Grua.query.get_or_404(id_grua)
        return schema_grua.dump(grua)
  
    def put(self, id_grua):
        grua = Grua.query.get_or_404(id_grua)
        if 'nombre' in request.json:
            grua.nombre = request.json['nombre']
        if 'estado' in request.json:
            grua.estado = request.json['estado']
        if 'nombreBarco' in request.json:
            grua.nombreBarco = request.json['nombreBarco']
        if 'idIssue' in request.json:
            grua.idIssue = request.json['idIssue']
        db.session.commit()
        return schema_grua.dump(grua)

    def delete(self, id_grua):
        grua = Grua.query.get_or_404(id_grua)
        db.session.delete(grua)
        db.session.commit()
        return '', 204

@app.route('/api/gruasdisponibles', methods=['GET'])
def gruasDisponibles():
    gruas = Grua.query.filter_by(estado='Disponible')
    if not gruas:
        return jsonify({"msg": "No hay muelles disponibles en este momento"}), 204
    else:
        return jsonify({"msg": schema_gruas.dump(gruas)}), 200

@app.route('/api/gruasasignadas', methods=['GET'])
def gruasAsignadas():
    gruas = Grua.query.filter_by(estado='Asignado')
    if not gruas:
        return jsonify({"msg": "No hay muelles asignados en este momento"}), 204
    else:
        return jsonify({"msg": schema_gruas.dump(gruas)}), 200

@app.route('/api/gruasbarco/<string:nombreDelBarco>', methods=['GET'])
def gruasNombreBarco(nombreDelBarco):
    gruas = Grua.query.filter_by(nombreBarco=nombreDelBarco)
    if not gruas:
        return jsonify({"msg": "No hay muelles asignados en este momento"}), 204
    else:
        return jsonify({"msg": schema_gruas.dump(gruas)}), 200

@app.route('/api/gruasatracadas', methods=['GET'])
def gruasAtracadas():
    gruas = Grua.query.filter_by(estado='Atracado')
    if not gruas:
        return jsonify({"msg": "No hay ningun barcos atracados en los muelles en este momento"}), 204
    else:
        return jsonify({"msg": schema_gruas.dump(gruas)}), 200

@app.route('/api/zarpar/<int:id_grua>', methods=['GET'])
def zarpar(id_grua):
    grua = Grua.query.get_or_404(id_grua)
    mercancias = Mercancia.query.filter((Mercancia.barcoSalida==grua.nombreBarco)&(Mercancia.estado!='En barco'))
    mercanciasdump = schema_mercancias.dump(mercancias)
    if len(mercanciasdump)==0:
        return jsonify({"msg": "No hay ninguna mercancia que no este en el barco en este momento"}), 200
    else:
        return jsonify({"msg": "Hay mercancias que no este en el barco en este momento"}), 201

@app.route('/api/mercanciasenbodega', methods=['GET'])
def mercanciasEnBodega():
    mercancias = Mercancia.query.filter((Mercancia.estado=='En bodega')|(Mercancia.estado=='Descargando')|(Mercancia.estado=='Moviendo a bodega'))
    if not mercancias:
        return jsonify({"msg": "No hay ninguna mercancia en bodega en este momento"}), 204
    else:
        return jsonify({"msg": schema_mercancias.dump(mercancias)}), 200

@app.route('/api/mercanciasparacargarmp', methods=['GET'])
def mercanciasParaCargarMP():
    mercancias = Mercancia.query.filter_by(estado='En bodega').filter_by(tipo='Materias Primas')
    if not mercancias:
        return jsonify({"msg": "No hay ninguna mercancia en bodega en este momento"}), 204
    else:
        return jsonify({"msg": schema_mercancias.dump(mercancias)}), 200

@app.route('/api/mercanciasparacargartec', methods=['GET'])
def mercanciasParaCargarTec():
    mercancias = Mercancia.query.filter_by(estado='En bodega').filter_by(tipo='Tecnologia')
    if not mercancias:
        return jsonify({"msg": "No hay ninguna mercancia en bodega en este momento"}), 204
    else:
        return jsonify({"msg": schema_mercancias.dump(mercancias)}), 200

@app.route('/api/mercanciasparacargartex', methods=['GET'])
def mercanciasParaCargarTex():
    mercancias = Mercancia.query.filter_by(estado='En bodega').filter_by(tipo='Textiles')
    if not mercancias:
        return jsonify({"msg": "No hay ninguna mercancia en bodega en este momento"}), 204
    else:
        return jsonify({"msg": schema_mercancias.dump(mercancias)}), 200

@app.route('/api/mercanciasparacargarmu', methods=['GET'])
def mercanciasParaCargarMu():
    mercancias = Mercancia.query.filter_by(estado='En bodega').filter_by(tipo='Muebles')
    if not mercancias:
        return jsonify({"msg": "No hay ninguna mercancia en bodega en este momento"}), 204
    else:
        return jsonify({"msg": schema_mercancias.dump(mercancias)}), 200

@app.route('/api/mercanciasparacargarcon', methods=['GET'])
def mercanciasParaCargarCon():
    mercancias = Mercancia.query.filter_by(estado='En bodega').filter_by(tipo='Consumibles')
    if not mercancias:
        return jsonify({"msg": "No hay ninguna mercancia en bodega en este momento"}), 204
    else:
        return jsonify({"msg": schema_mercancias.dump(mercancias)}), 200
    
@app.route('/api/mercanciasparacargaro', methods=['GET'])
def mercanciasParaCargarO():
    mercancias = Mercancia.query.filter_by(estado='En bodega').filter_by(tipo='Otro')
    if not mercancias:
        return jsonify({"msg": "No hay ninguna mercancia en bodega en este momento"}), 204
    else:
        return jsonify({"msg": schema_mercancias.dump(mercancias)}), 200

@app.route('/api/mercanciasdescargadas', methods=['GET'])
def mercanciasDescargadas():
    mercancias = Mercancia.query.filter_by(estado='Descargando')
    if not mercancias:
        return jsonify({"msg": "No hay ninguna mercancia descargando en este momento"}), 204
    else:
        return jsonify({"msg": schema_mercancias.dump(mercancias)}), 200

@app.route('/api/mercanciascargando', methods=['GET'])
def mercanciasCargarando():
    mercancias = Mercancia.query.filter_by(estado='Cargando')
    if not mercancias:
        return jsonify({"msg": "No hay ninguna mercancia para cargar en este momento"}), 204
    else:
        return jsonify({"msg": schema_mercancias.dump(mercancias)}), 200

@app.route('/api/mercanciasmoverbodega', methods=['GET'])
def mercanciasMoverBodega():
    mercancias = Mercancia.query.filter_by(estado='Moviendo a bodega')
    if not mercancias:
        return jsonify({"msg": "No hay ninguna mercancia en movimiento a bodega en este momento"}), 204
    else:
        return jsonify({"msg": schema_mercancias.dump(mercancias)}), 200

@app.route('/api/mercanciasmoverbarco', methods=['GET'])
def mercanciasMoverBarco():
    mercancias = Mercancia.query.filter_by(estado='Moviendo a barco')
    if not mercancias:
        return jsonify({"msg": "No hay ninguna mercancia en movimiento a barco en este momento"}), 204
    else:
        return jsonify({"msg": schema_mercancias.dump(mercancias)}), 200

@app.route('/api/mercanciamoverbarco/<int:id_mercancia>', methods=['PUT'])
def mercanciaMoverBarco(id_mercancia):
    mercancia = Mercancia.query.get_or_404(id_mercancia)
    if 'estado' in request.json:
        mercancia.estado = request.json['estado']
    mercancia.fechaSalida = datetime.now()
    db.session.commit()
    return schema_mercancia.dump(mercancia)


api.add_resource(RecursoListarMercancias, '/mercancias')
api.add_resource(RecursoUnaMercancia,'/mercancias/<int:id_mercancia>')

api.add_resource(RecursoListarGruas, '/gruas')
api.add_resource(RecursoUnaGrua,'/gruas/<int:id_grua>')

if __name__ == '_main_':
    app.run(debug=True)