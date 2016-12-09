

var mongoose = require("./conexion").getConexion();
/**
* Contiene una referencia al constructor de Schema de Mongoose
*/
var Schema = mongoose.Schema;
/**
* Verifica que las contraseñas enviadas desde el cliente coincidad
*/
var passwordvalidation = {
	validator: function(p){
		return this.password_confirmation == p;
	},
	message: "Las contraseñas no son iguales"
}
/**
* Genera un nuevo Schema
*/
var user_schema = new Schema({
	nombre: {type:String, required: "El nombre es obligatorio"},
	apellidos: {type:String, required: "Los apellidos son obligatorios"},
	username: {type:String, required: "El username es obligatorio", maxlength:[50, "El máximo de carácteres para el username es de 50"]},
	password: {
		type:String,
		required: "Se necesita una contraseña",
		minlength: [8, "La contraseña es muy corta"],
		validate: passwordvalidation
	}
});
/**
* Asigna el virtual para la verificacion de contraseñas
*/
user_schema
	.virtual("password_confirmation")
	.get(function(){
		return this.p_c;
	})
	.set(function(pass){
		this.p_c = pass;
	});
/**
* Guarda el modelo en la base de datos, exportando una referencia a él.
*/
var User = mongoose.model("User", user_schema);
/**
* Exporta la referencia al Schema
*/
module.exports.User = User;
