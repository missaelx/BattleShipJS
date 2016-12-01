var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var User = require("./models/user").User;
var session = require("express-session")({
	secret: "12kdfmdkfmedkem",
	resave: true,
	saveUninitialized: true
}); //session en memoria
//var cookieSession = require("cookie-session");
var sharedsession = require("express-socket.io-session"); //para compartir sesiones con socket.io
var router_game = require("./routes_game");
var session_middleware = require("./middlewares/session");
var Map = require("collections/map");
var server = require("http").createServer(app);
var io = require("socket.io")(server);


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
	if(req.session)
		sesiones_iniciadas.delete(req.session.user_id.toString());
	req.session = null;	
	res.redirect("/");
});


app.get("/users", function(req,res){
	User.find(function(err,doc){
		if(err){
			res.send("Hubo un error, ya esta en consola");
			console.log(err);
		} else {
			console.log(sesiones_iniciadas.toArray());
			res.render("users",{usuarios: doc});
		}
	});
});

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












//peticiones post
app.post("/iniciarsesion", function(req, res) { //recibimos el formulario cuando se intenta iniciar sesion
	User.findOne({
		username: req.body.username,
		password: req.body.password
	}, function(err, user){
		if(err){
			console.log(err);
		} else if(user){ //preguntamos si se encontro un usuario con las credenciales definidas
			console.log("---------------------------------------");
			if(!sesiones_iniciadas.has(user._id.toString())){
				sesiones_iniciadas.set(user._id.toString(), {username: user.username});
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
app.post("/game/empezarpartida", function(req, res){
	

	res.render("game/armartablero");

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
			socket: socket
		});
	});

  	socket.on('hola', function (data) {
    	console.log(sesiones_iniciadas);
    	socket.emit("mostrar-datos", sesiones_iniciadas.toArray().toString());
	});
});

server.listen(8080);