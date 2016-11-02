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
		    	socket.emit('bienvenido', "hola");
		    } else {
		    	//console.log("no-entro " + datos.username + "@" + datos.password );
		    	socket.emit('no-bienvenido', "Fuera sangre sucia");
		    }
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