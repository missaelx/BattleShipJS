/**
* Contiene una referencia al ORM de mongoose
*/
var mongoose = require("mongoose");

/**
* Eliminar los mensaje de advertencias para el uso de Promises de ES6
*/
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/fotos");

/**
* Exporta la conexion al servidor de MongoDB
*/
module.exports.getConexion = function () {
	return mongoose;
}