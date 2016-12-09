partidaJSON = partida.value; //sacamos de hidden la partida
partida.value = ""; //limpiamos el hidden
partidaJSON = JSON.parse(partidaJSON);

var json = {
	portaaviones: partidaJSON.partida.tablero1.portaaviones,
	acorazado: partidaJSON.partida.tablero1.acorazado,
	fragata: partidaJSON.partida.tablero1.fragata,
	submarino: partidaJSON.partida.tablero1.submarino,
	buque: partidaJSON.partida.tablero1.buque
}

construirTableroFromJSON(json, document.getElementsByClassName("casilla-view"));
actualizarTablaVida(2, partidaJSON);

var socket = io();
socket.emit('exportar-socket');
socket.emit("esperando-partida", {
	partida: partidaJSON.partida.id,
	usuario1: partidaJSON.partida.usuario1,
	usuario2: partidaJSON.partida.usuario2
})
socket.on("esperando-partida-error", function(data){
	alert(data.message);
});
socket.on("partida-aceptada", function(data){
	turno.innerHTML = "Tu turno";
	Array.from(document.getElementsByClassName("casilla")).forEach(function(item){
		item.dataset.clickable = true;
	});
	actualizarTablaVida(2, data);
	construirTableroFromJSON({
		portaaviones: data.tablero1.portaaviones,
		acorazado: data.tablero1.acorazado,
		fragata: data.tablero1.fragata,
		submarino: data.tablero1.submarino,
		buque: data.tablero1.buque,
		tiros: data.tiros1
	},
	document.getElementsByClassName("casilla-view"));

	partidaJSON = data;
});

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
// se agregan escuchas a las imagenes
Array.from(document.getElementsByClassName("casilla")).forEach(function(item){
	item.addEventListener("click", clickCasilla);
});

socket.on("lanzar-tiro-error", function(data){
	alert(data.message);
	console.log(data);
})
socket.on("actualizar-partida", function(data){
	partidaJSON = data;
	//construyo mis barcos
	construirTableroFromJSON(data.tablero1, document.getElementsByClassName("casilla-view"));
	construirTirosFromJSON(2, data, document.getElementsByClassName("casilla-view"));
	construirTirosFromJSON(1, data, document.getElementsByClassName("casilla"));
	actualizarTablaVida(2, data);
	if(data.turno == data.usuario1){
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
socket.on("Tiro-acertado", function(){
	alert("Acertaste el tiro, vuelve a tirar");
})

socket.on("partida-terminada", function(data){
	if(data.ganador.toString() == data.usuario1.toString()){
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

