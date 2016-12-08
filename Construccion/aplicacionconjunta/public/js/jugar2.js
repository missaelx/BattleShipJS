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
socket.on("lanzar-tiro-error", function(data){
	alert(data.message);
	console.log(data);
});


socket.on("actualizar-partida", function(data){
	partidaJSON = data;
	//construyo mis barcos
	construirTableroFromJSON(data.tablero2, document.getElementsByClassName("casilla-view"));
	construirTirosFromJSON(1, data, document.getElementsByClassName("casilla-view"));
	construirTirosFromJSON(2, data, document.getElementsByClassName("casilla"));
	actualizarTablaVida(1, data);
	if(data.turno == data.usuario2){
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
