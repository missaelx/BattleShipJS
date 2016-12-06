var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/fotos");

module.exports.getConexion = function () {
	return mongoose;
}