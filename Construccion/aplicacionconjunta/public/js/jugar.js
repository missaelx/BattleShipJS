//funcion que construye el tablero desde un json a las casillas
//el json debe tener los siguientes elementos
//portaaviones acorazado fragata submarino buque y tiros
function construirTableroFromJSON(json, casillas){

	for (var i = casillas.length - 1; i >= 0; i--) {
		casillas[i].src = "/img_barcos/mar azul.jpg";
	}
	if(json.portaaviones){
		for (var i = json.portaaviones.posiciones.length - 1; i >= 0; i--) {
			casillas[json.portaaviones.posiciones[i]].src = "/img_barcos/portaaviones " + (i+1) + " " + json.portaaviones.orientacion + " normal.jpg";
		}
	}
	if(json.acorazado){
		for (var i = json.acorazado.posiciones.length - 1; i >= 0; i--) {
			casillas[json.acorazado.posiciones[i]].src = "/img_barcos/acorazado " + (i+1) + " " + json.acorazado.orientacion + " normal.jpg";
		}
	}
	if(json.fragata){
		for (var i = json.fragata.posiciones.length - 1; i >= 0; i--) {
			casillas[json.fragata.posiciones[i]].src = "/img_barcos/fragata " + (i+1) + " " + json.fragata.orientacion + " normal.jpg";
		}
	}
	if(json.submarino){
		for (var i = json.submarino.posiciones.length - 1; i >= 0; i--) {
			casillas[json.submarino.posiciones[i]].src = "/img_barcos/submarino " + (i+1) + " " + json.submarino.orientacion + " normal.jpg";
		}
	}
	if(json.buque){
		for (var i = json.buque.posiciones.length - 1; i >= 0; i--) {
			casillas[json.buque.posiciones[i]].src = "/img_barcos/buque " + (i+1) + " " + json.buque.orientacion + " normal.jpg";
		}	
	}

	for (var i = json.tiros.length - 1; i >= 0; i--) {
		casillas[json.tiros[i]].src = "img_barcos/mar explosion.jpg";
	}
}


partidaJSON = partida.value;
//partidaJSON = partidaJSON.replace('_', '');
partidaJSON = JSON.parse(partidaJSON);
partida.value = "";

var json = {
	portaaviones: partidaJSON.partida.tablero1.portaaviones,
	acorazado: partidaJSON.partida.tablero1.acorazado,
	fragata: partidaJSON.partida.tablero1.fragata,
	submarino: partidaJSON.partida.tablero1.submarino,
	buque: partidaJSON.partida.tablero1.buque,
	tiros: []
}

construirTableroFromJSON(json, document.getElementsByClassName("casilla-view"));

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
	construirTableroFromJSON({
		portaaviones: data.tablero1.portaaviones,
		acorazado: data.tablero1.acorazado,
		fragata: data.tablero1.fragata,
		submarino: data.tablero1.submarino,
		buque: data.tablero1.buque,
		tiros: data.tiros1
	},
	document.getElementsByClassName("casilla-view"));

	construirTableroFromJSON({
		portaaviones: data.tablero2.portaaviones,
		acorazado: data.tablero2.acorazado,
		fragata: data.tablero2.fragata,
		submarino: data.tablero2.submarino,
		buque: data.tablero2.buque,
		tiros: data.tiros2
	},
	document.getElementsByClassName("casilla"));
});
