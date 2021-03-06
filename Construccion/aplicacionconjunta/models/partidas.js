

var mongoose = require("./conexion").getConexion();
/**
* Contiene una referencia al constructor de Schema de Mongoose
*/
var Schema = mongoose.Schema;

/**
* Genera un nuevo Schema
*/
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

/**
* Guarda el modelo en la base de datos, exportando una referencia a él.
*/
var Partida = mongoose.model("Partida", partidasSchema);
/**
* Exporta la referencia al Schema
*/
module.exports.Partida = Partida;