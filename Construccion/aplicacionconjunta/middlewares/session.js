/**
* Contiene una referencia al modelo User
*/
var User = require("../models/user").User;

/**
* Exporta la lógica para insertar las cookies del usuario y guardar en memoria RAM
*/
module.exports = function(req,res,next){
	if(!req.session.user_id){
		res.redirect("/login");
	} else {
		User.findById(req.session.user_id, function(err, user){
			if(err){
				console.log(err);
				res.redirect("/login");
			} else {
				res.locals = {user: user};
				next();
			}
		});
	}
}