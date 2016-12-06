//var mongoose = require("mongoose");

//mongoose.Promise = global.Promise;
//mongoose.connect("mongodb://localhost/fotos");

var mongoose = require("./conexion").getConexion();
var Schema = mongoose.Schema;

var partidasSchema = new Schema({
	usuario1: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: "Se necesita registrar el jugador 1"
	},
	usuario2: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	ganador: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	tablero1: {
		type: Object,
		required: "Se necesita el tablero del jugador 1 para crear la partida"
	},
	tablero2: {
		type: Object
	},
	tiros1: {
		type: Object
	},
	tiros2: {
		type: Object
	},
	turno: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: "Se necesita registrar un turno"
	}
});

var Partida = mongoose.model("Partida", partidasSchema);

module.exports.Partida = Partida;