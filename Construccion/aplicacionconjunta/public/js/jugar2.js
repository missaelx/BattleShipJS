var json = {
	portaaviones: partidaJSON.partida.tablero2.portaaviones,
	acorazado: partidaJSON.partida.tablero2.acorazado,
	fragata: partidaJSON.partida.tablero2.fragata,
	submarino: partidaJSON.partida.tablero2.submarino,
	buque: partidaJSON.partida.tablero2.buque
}

construirTableroFromJSON(json, document.getElementsByClassName("casilla-view"));
actualizarTablaVida(1, partidaJSON.partida);

var socket = io();
socket.emit('exportar-socket');

Array.from(document.getElementsByClassName("casilla")).forEach(function(item){
	item.addEventListener("click", function(){
		if(this.dataset.clickable === "true"){
			socket.emit("lanzar-tiro", {
				posicion: this.dataset.position,
				idPartida: partidaJSON._id
			});
		} else {
			alert("Espera tu turno");
		}
	});
});

