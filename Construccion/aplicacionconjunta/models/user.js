//var mongoose = require("mongoose");

//mongoose.Promise = global.Promise;
//mongoose.connect("mongodb://localhost/fotos");

var mongoose = require("./conexion").getConexion();
var Schema = mongoose.Schema;

var passwordvalidation = {
	validator: function(p){
		return this.password_confirmation == p;
	},
	message: "Las contraseñas no son iguales"
}

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

user_schema
	.virtual("password_confirmation")
	.get(function(){
		return this.p_c;
	})
	.set(function(pass){
		this.p_c = pass;
	});

var User = mongoose.model("User", user_schema);

module.exports.User = User;
