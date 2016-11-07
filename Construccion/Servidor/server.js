var conexion = require("./js/conexionmysql");
var io = require('socket.io')(8080);

var Map = require("collections/map");

var sockets = new Map();



io.on('connection', function(socket){
	socket.on("ingresar", function(jsonUsuario){
		var datos = JSON.parse(jsonUsuario);
		
		conexion.verificarUsuario(datos.username, datos.password, function(err, result){
		    console.log(result);
		    if(result){
		    	console.log("Ha entrado a la sala: " + datos.username);
		    	sockets.set(datos.username, socket);
		    	//TODO-mandar el ID de usuario al loguear
		    	socket.emit('bienvenido', "hola");
		    } else {
		    	
		    	socket.emit('no-bienvenido', "Fuera sangre sucia");
		    }
		});	
			
	});

	socket.on("crearNuevaPartida", function(jsonPartida){
		var partida = JSON.parse(jsonPartida);
		conexion.crearPartida(partida.usuario1, partida.usuario2, partida.tablero1,partida.tablero2, function(err, result){
			if(err) console.log(err);
			socket.emit("resultadoCreacionPartida", result);
		});
	});


	
	socket.on('mensajePersonal', function(mensaje){
		var datos = JSON.parse(mensaje);
		sockets.get(datos.destinatario).emit('recibirMensajePersonal', datos.mensaje);
	});

	socket.on('salir', function(usuario){
		console.log("El usuario " + usuario + " ha salido");
		sockets.delete(usuario);
		console.log(sockets);
	});
});

io.on("disconnect", function () {
	console.log("usuario desconectado");
});

//console.log(conexion.verificarUsuario("missaelxp", "missaelxp"));

// Implementation
console.log("escuchando");



//conexion.verificarUsuario("missaelxp", "missaelxp");