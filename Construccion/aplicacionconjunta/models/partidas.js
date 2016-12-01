var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/fotos");

var partidasSchema = new Schema({
	usuario1: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: "Se necesita registrar el jugador 1"
	},
	usuario2: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: "Se necesita registrar el jugador 2"
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
		type: Object,
		required: "Se necesita el tablero del jugador 2 para crear la partida"
	},
	tiros1: {
		type: Object,
		required: "Se necesitan asignar los tiros del jugador 1"
	},
	tiros2: {
		type: Object,
		required: "Se necesitan asignar los tiros del jugador 2"	
	}
});

var Partida = mongoose.model("Partida", user_schema);

module.exports.Partida = Partida;