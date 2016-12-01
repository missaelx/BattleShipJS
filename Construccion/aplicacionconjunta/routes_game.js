var express = require("express");
var router = express.Router();

router.get("/", function(req,res){
	res.render("game/home");
});

router.get("/puntajes", function(req, res){
	res.render("game/puntajes", {
		puntajes: [
			{
				nombre: "Missael",
				puntaje: 3
			}
		]
	});
});
router.get("/partidasguardadas", function(req, res){
	res.render("game/partidasguardadas");
});

router.get("/seleccionaroponente", function(req,res){
	res.render("game/seleccionaroponente");
});


module.exports = router;