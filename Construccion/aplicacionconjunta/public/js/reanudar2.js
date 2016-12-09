var socket = io();
var partidaJSON;
var usuarioActual = usuario.value;
usuario.value = "";
//funcion para click en casillas
function clickCasilla() {
	if(this.dataset.clickable === "true"){
		socket.emit("lanzar-tiro", {
			posicion: this.dataset.position,
			idPartida: partidaJSON._id
		});
	} else {
		alert("Espera tu turno");
	}
}



socket.emit('exportar-socket');
socket.emit('solicitar-partida', partida.value);
socket.on("solicitar-partida-error", function(err){
	alert("Error en el servidor");
	console.log(err);
});
socket.on('recibir-partida', function(data){
	var oponente, idOponente;
	partidaJSON = data;
	
	if(data.usuario1.toString() == usuarioActual){
		oponente = 2;
		idOponente = data.usuario2.toString();
		//construyo mis barcos
		construirTableroFromJSON(data.tablero1, document.getElementsByClassName("casilla-view"));
	} else if(data.usuario2.toString() == usuarioActual) {
		oponente = 1;
		idOponente = data.usuario1.toString();
		//construyo mis barcos
		construirTableroFromJSON(data.tablero2, document.getElementsByClassName("casilla-view"));
	} else {
		alert("Error al recibir partida");
		console.log(data);
	}
	
	construirTirosFromJSON(oponente, data, document.getElementsByClassName("casilla-view"));
	construirTirosFromJSON((oponente == 2) ? 1 : 2, data, document.getElementsByClassName("casilla"));
	actualizarTablaVida(oponente, data);
	

	if(data.turno == usuarioActual){
		turno.innerHTML = "Tu turno";
		Array.from(document.getElementsByClassName("casilla")).forEach(function(item){
			item.dataset.clickable = "true";
		});
	} else {
		turno.innerHTML = "Esperando el turno de tu oponente";
		Array.from(document.getElementsByClassName("casilla")).forEach(function(item){
			item.dataset.clickable = "false";
		});
	}

	socket.emit("reanudar-aceptado", {
		partida: data,
		usuario1: usuarioActual,
		oponente: idOponente
	})

	//se agregan los escuchas
	Array.from(document.getElementsByClassName("casilla")).forEach(function(item){
		item.addEventListener("click", clickCasilla);
	});

});

socket.on("reanudar-aceptado-error", function(data){
	alert(data.message);
})

//logica del juego
socket.on("Tiro-acertado", function(){
	alert("Acertaste el tiro, vuelve a tirar");
})

socket.on("lanzar-tiro-error", function(data){
	alert(data.message);
	console.log(data);
})

socket.on("partida-terminada", function(data){
	if(data.ganador.toString() == usuarioActual){
		alert("Has ganado el juego");
		turno.innerHTML = "Has ganado el juego " + '<a href="/game">Volver</a>';
	} else {
		alert("Has perdido el juego");
		turno.innerHTML = "Has perdido el juego " + '<a href="/game">Volver</a>';
	}
	Array.from(document.getElementsByClassName("casilla")).forEach(function(item){
		item.dataset.clickable = "false";
		item.removeEventListener("click", clickCasilla);
	});

});


socket.on("actualizar-partida", function(data){
	var oponente, idOponente;
	partidaJSON = data;
	
	if(data.usuario1.toString() == usuarioActual){
		oponente = 2;
		idOponente = data.usuario2.toString();
		//construyo mis barcos
		construirTableroFromJSON(data.tablero1, document.getElementsByClassName("casilla-view"));
	} else if(data.usuario2.toString() == usuarioActual) {
		oponente = 1;
		idOponente = data.usuario1.toString();
		//construyo mis barcos
		construirTableroFromJSON(data.tablero2, document.getElementsByClassName("casilla-view"));
	} else {
		alert("Error al recibir partida");
		console.log(data);
	}
	
	construirTirosFromJSON(oponente, data, document.getElementsByClassName("casilla-view"));
	construirTirosFromJSON((oponente == 2) ? 1 : 2, data, document.getElementsByClassName("casilla"));
	actualizarTablaVida(oponente, data);
	

	if(data.turno == usuarioActual){
		turno.innerHTML = "Tu turno";
		Array.from(document.getElementsByClassName("casilla")).forEach(function(item){
			item.dataset.clickable = "true";
		});
	} else {
		turno.innerHTML = "Esperando el turno de tu oponente";
		Array.from(document.getElementsByClassName("casilla")).forEach(function(item){
			item.dataset.clickable = "false";
		});
	}
});