var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var User       = require("./models/user").User;
var Partida    = require("./models/partidas").Partida;

var session = require("express-session")({ //session en memoria
	secret: "12kdfmdkfmedkem",
	resave: true,
	saveUninitialized: true
}); 

//var cookieSession = require("cookie-session");

var sharedsession      = require("express-socket.io-session"); //para compartir sesiones con socket.io
var router_game        = require("./routes_game");
var session_middleware = require("./middlewares/session");
var Map                = require("collections/map");
var server             = require("http").createServer(app);
var io                 = require("socket.io")(server);


var sesiones_iniciadas = new Map();



app.set("view engine", "jade"); //asignamos a jade como motor de vistas

app.use(express.static("public")); //montamos un servidor de archivos estaticos
app.use(bodyParser.json()); //montamos un middleware para peticiones application/json
app.use(bodyParser.urlencoded({extended:true})); //para leer parametros de peticiones POST

//para express-session
app.use(session);

//para compartir sesion con socket.io
io.use(sharedsession(session, {
    autoSave:true
})); 

/*app.use(cookieSession({
	name: "session",
	keys: ["llave-1", "llave-3"]
}));
*/



//----------------------funcionalidades inicio de sesion


app.get("/", function(req, res) { //AL INICIO carga el index
	res.render("index");
})

app.get("/login", function(req, res){ //pagina de logueo
	res.render("login");
})
app.get("/login/:id", function(req,res){ //para el inicio de sesion despues de crear cuenta
	res.render("login", {cuentacreada: true});
});
app.get("/singup", function(req,res){ // inicio de sesion
	res.render("singup");
});
app.get("/logout", function(req,res){
	if(req.session){
		sesiones_iniciadas.delete(req.session.user_id.toString());
		io.emit('actualizar-numero-jugadores', sesiones_iniciadas.length);
	}
	req.session = null;	
	res.redirect("/");
});
// ** funcionalidades inicio de sesion


app.use("/game", session_middleware);
//app.use("/game", router_game); se descontinua el uso de un router por el acceso a la variable de los sockets

app.get("/game/", function(req,res){
	res.render("game/home", {usuariosconectados: sesiones_iniciadas.length});
});

app.get("/game/puntajes", function(req, res){
	res.render("game/puntajes", {
		puntajes: [
			{
				nombre: "Missael",
				puntaje: 3
			}
		]
	});
});
app.get("/game/partidasguardadas", function(req, res){
	res.render("game/partidasguardadas");
});

app.get("/game/seleccionaroponente", function(req,res){
	res.render("game/seleccionaroponente", {
		usuariodisponibles: sesiones_iniciadas.toArray()
	});
});



app.get("/game/armartablero2/:idPartida", function(req, res){
	//buscamos el id partida
	var idPartida = req.params.idPartida;
	Partida.findOne({_id: idPartida}, function(err, partida){
		if(err){
			console.log("error en linea 109 misa :(");
			console.log(err);
			res.send("Error en la busqueda de la partida");
		} else {
			if(partida){
				if(req.session.user_id == partida.usuario1 || req.session.user_id == partida.usuario2){
					res.render("game/armartablero2", {
						idPartida: req.params.idPartida
					}); 
				} else {
					res.send("Esta partida no te pertenece");
				}
			} else {
				res.send("No existe la partida que estas buscando");
			}
		}
	})
});











//peticiones post
app.post("/iniciarsesion", function(req, res) { //recibimos el formulario cuando se intenta iniciar sesion
	User.findOne({
		username: req.body.username,
		password: req.body.password
	}, function(err, user){
		if(err){
			console.log(err);
		} else if(user){ //preguntamos si se encontro un usuario con las credenciales definidas
			console.log("INICIO SESION: " + req.body.username);
			if(!sesiones_iniciadas.has(user._id.toString())){
				sesiones_iniciadas.set(user._id.toString(), {username: user.username, id: user._id.toString()});
				req.session.user_id = user._id;
				res.redirect("/game");
			} else {
				res.render("login", {error: "El usuario ya inicio sesion en otro dispositivo"});	
			}
		} else { // sino se encontro se regresa al login
			res.render("login", {error: "No se encontró el usuario"});
		}
		
	});
})

app.post("/crearusuario", function(req, res){
	var nombre = req.body.name; 
	var user = new User({
		nombre: req.body.name,
		apellidos: req.body.apellidos,
		username: req.body.username,
		password_confirmation: req.body.passwordrepeat,
		password: req.body.password
	});
	user.save(function(err){
		if(err){
			res.render("singup", {error: String(err)});
		} else {
			res.redirect("/login/" + nombre);
		}
	});
})

//game

app.post("/game/armartablero", function(req, res){
	res.render("game/armartablero", {
		oponente: req.body.oponenteseleccionado
	});

});


app.post("/game/jugar/:id", function(req, res){
	var idPartida = req.params.id;
	Partida.findOne({_id: idPartida}, function(err, partida){
		if(err){
			res.send("Error en la busqueda de la partida");
		} else {
			var json = JSON.stringify({
				partida: {
					id: partida._id,
					usuario1: partida.usuario1,
					tablero1: partida.tablero1,
					usuario2: partida.usuario2,
					turno: partida.turno
				}
			});
			res.render("game/jugar",{partida: json});
		}
	})
});

app.post("/game/jugar2/:id", function(req,res){
	var idPartida = req.params.id;
	Partida.findOne({_id: idPartida}, function(err, partida){
		if(err){
			res.send("Error en la busqueda de la partida");
		} else {
			if(!partida)
				res.send("No existe esa partida");
			var json = JSON.stringify({ //se hace string para ponerlo en el hidden
				partida: {
					id: partida._id,
					usuario1: partida.usuario1,
					tablero1: partida.tablero1,
					tablero2: partida.tablero2,
					usuario2: partida.usuario2,
					tiros1: partida.tiros1,
					tiros2: partida.tiros2,
					turno: partida.turno
				}
			});
			res.render("game/jugar2",{partida: json});
		}
	})
});


//socket.io logic

io.on("connection", function (socket) {

	socket.broadcast.emit("actualizar-numero-jugadores", sesiones_iniciadas.length)


	//se guarda el socket con el que se puede comunicar con el usuario conectado
	socket.on("exportar-socket", function(){
		var userid = socket.handshake.session.user_id;
		var usernameFromMap = sesiones_iniciadas.get(userid).username;
		sesiones_iniciadas.set(userid, {
			username: usernameFromMap,
			id: userid,
			socket: socket
		});

	});

  	socket.on('registrar-partida', function (data) {
    	var partida =  new Partida({
    		usuario1: data.usuario,
    		tablero1: data.tablero,
    		usuario2: data.usuario2,
    		turno: data.turno
    	});
    	partida.save(function(err, partida){
    		if(err){
				console.log(err);
				socket.emit("partida-registrada", {error: err})
			} else {
				socket.emit("partida-registrada", partida._id);
			}
    	})
	});


  	socket.on("esperando-partida", function(data){
  		var usuarioOrigen = data.usuario1;
  		var usuarioRetado = data.usuario2;

  		User.findOne({_id: usuarioOrigen}, function(err, user){
  			if(err){
  				socket.emit("esperando-partida-error", err);
  			} else {
  				sesiones_iniciadas.get(usuarioRetado).socket.emit("invitacion-partida", {
  					_id: data.partida,
					jugador2: user.username
  				});
  			}
  		});
  	})

  	socket.on("aceptar-partida", function(data){
  		Partida.findOneAndUpdate(
  			{
  				_id: data.idPartida
  			},
	  		{
	  			tablero2: data.tablero,
	  			tiros1: [],
	  			tiros2: []
	  		}, 
	  		{
	  			new: true
	  		}, function(err, result){
	  			if(err){
					console.log("Error en la linea 279");
	  				console.log(err);
	  				socket.emit("aceptar-partida-error", err);
	  			} else {
	  				if(result){
			  			sesiones_iniciadas.get(result.usuario1.toString()).socket.emit("partida-aceptada", result);
			  			socket.emit("partida-aceptada", result);
	  				} else {
	  					socket.emit("aceptar-partida-error", {message: "No existe la partida"});
	  				}
	  			}
	  	});
  	});

  	socket.on("lanzar-tiro", function(data){
  		var origenTiro = socket.handshake.session.user_id;
  		Partida.findById(data.idPartida, function(err, partida){
  			if(err){
  				socket.emit("lanzar-tiro-error", err);
  			} else {
  				if(!partida){
  					socket.emit("lanzar-tiro-error", {message: "No existe esa partida"});
  				} else {
  					console.log("Partida recuperada:");
  					console.log(partida.tiros1);
  					if(origenTiro == partida.usuario1.toString()){ // entonces los tiros1 son los que buscamos
  						var tiros = partida.tiros1;
  						var tiroCasilla = parseInt(data.posicion);
  						debugger;
  						if(partida.tiros1.indexOf(tiroCasilla) == -1){ //que sea un nuevo tiro
  							tiros.push(tiroCasilla);
  							var acertoElTiro = false;
  							if(partida.tablero2.portaaviones.posiciones.indexOf(tiroCasilla) != -1)
  								acertoElTiro = true;
  							else if (partida.tablero2.acorazado.posiciones.indexOf(tiroCasilla) != -1)
  								acertoElTiro = true;
  							else if (partida.tablero2.fragata.posiciones.indexOf(tiroCasilla) != -1)
  								acertoElTiro = true;
  							else if (partida.tablero2.submarino.posiciones.indexOf(tiroCasilla) != -1)
  								acertoElTiro = true;
  							else if (partida.tablero2.buque.posiciones.indexOf(tiroCasilla) != -1)
  								acertoElTiro = true;
  							
  							//partida.tiros1 = tiros;
  							var turno = partida.turno.toString();
  							if(acertoElTiro){
  								socket.emit("Tiro-acertado");
  							} else {
  								turno = partida.usuario2.toString();
  							}
  
  							Partida.findOneAndUpdate(
  								{_id: partida._id}, //query
  								{tiros1: tiros, turno: turno}, //modificaciones
  								{new: true}, //opciones: new = retorna el nuevo documento
  								function(err, partidaUpdated){
  									console.log("Partida guardada:")
  									console.log(partida.tiros1);
  									
  									sesiones_iniciadas.get(partida.usuario2.toString()).socket.emit("actualizar-partida", partidaUpdated);
  									socket.emit("actualizar-partida", partidaUpdated);
  								}
  							);

  						} else {
  							socket.emit("lanzar-tiro-error", {message: "Ya tiraste esta posicion"});
  						}
  					} else if (origenTiro == partida.usuario2.toString()){
  						var tiros = partida.tiros2;
  						var tiroCasilla = parseInt(data.posicion);
  						if(partida.tiros2.indexOf(tiroCasilla) == -1){ //que sea un nuevo tiro
  							tiros.push(tiroCasilla);
  							var acertoElTiro = false;
  							if(partida.tablero1.portaaviones.posiciones.indexOf(tiroCasilla) != -1)
  								acertoElTiro = true;
  							else if (partida.tablero1.acorazado.posiciones.indexOf(tiroCasilla) != -1)
  								acertoElTiro = true;
  							else if (partida.tablero1.fragata.posiciones.indexOf(tiroCasilla) != -1)
  								acertoElTiro = true;
  							else if (partida.tablero1.submarino.posiciones.indexOf(tiroCasilla) != -1)
  								acertoElTiro = true;
  							else if (partida.tablero1.buque.posiciones.indexOf(tiroCasilla) != -1)
  								acertoElTiro = true;

  							if(acertoElTiro){
  								partida.tiros2 = tiros;
  								socket.emit("Tiro-acertado");
  							} else {
  								partida.tiros2 = tiros;
  								partida.turno = partida.usuario2;
  							}
  							partida.save(function(err, partidaUpdated){
  								if(err){
  									socket.emit("lanzar-tiro-error", err);
  								}
  								sesiones_iniciadas.get(partida.usuario1.toString()).socket.emit("actualizar-partida", partidaUpdated);
  								socket.emit("actualizar-partida", partidaUpdated);
  							});

  						} else {
  							socket.emit("lanzar-tiro-error", {message: "Ya tiraste esta posicion"});
  						}
  					} else {
  						socket.emit("lanzar-tiro-error", {message: "No tienes acceso a esa partida"});
  					}
  				}
  			}
  		});
  	})
});








//para pruebas

app.get("/users", function(req,res){
	User.find(function(err,doc){
		if(err){
			res.send("Hubo un error, ya esta en consola");
			console.log(err);
		} else {
			console.log("Sessiones iniciadas: ")
			console.log(sesiones_iniciadas.toArray());
			res.render("pruebas/users",{usuarios: doc});
		}
	});
});

app.get("/partidas", function(req,res) {
	Partida.find({}).populate("usuario1").exec(function(err, partidas){
		if(err){
			console.log("************** error *********");
			console.log(err);
		} else {
			console.log(partidas);
		}
	});
	res.send("Ver consola servidor");
});

app.get("/game/jugar", function(req,res){ //evitar acceso desde get a jugar
	//res.redirect("/game");
	res.render("game/jugar");
});

app.get("/invitar", function(req,res){
	res.send("Invitacion enviada a todos");
	io.emit("invitacion-partida", {
		_id: "213232e2323",
		jugador2: "missael"
	});
});


server.listen(8080);
console.log("Saludos desde el puerto 8080 :)")