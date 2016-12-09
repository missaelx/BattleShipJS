//funcion que construye el tablero desde un json a las casillas
//el json debe tener los siguientes elementos
//portaaviones acorazado fragata submarino buque
// esta funcion se limita unicamente a los barcos, para mostrar los tiros se usará la funcion contruirTirosFromJSON
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
}
//sobrescribe la imagenes del tablero (parametro casillas) con los tiros del oponente
function construirTirosFromJSON(oponente, json, casillas){
	var tablero; //tablero huesped
	var tiros2; // tiros oponente
	if(oponente == 1){
		tablero = json.tablero2;
		tiros2 = json.tiros1;
	} else if (oponente == 2){
		tablero = json.tablero1;
		tiros2 = json.tiros2;
	} else {
		return false;
	}
	//se marcan todos los tiros como fallidos para posterior revisar los correctos
	for(var i = 0; i < tiros2.length; i++){
		casillas[tiros2[i]].src = "/img_barcos/mar explotado.jpg";
	}
	
	//se recorren los tiros preguntando si impactaron con algun barco
	for(var i = 0; i < tiros2.length; i++){
		//se pregunta si el tiro coincide con algun barco
		if(tablero.portaaviones.posiciones.indexOf(tiros2[i]) != -1  ||
			tablero.acorazado.posiciones.indexOf(tiros2[i]) != -1 ||
			tablero.fragata.posiciones.indexOf(tiros2[i]) != -1 ||
			tablero.submarino.posiciones.indexOf(tiros2[i]) != -1 ||
			tablero.buque.posiciones.indexOf(tiros2[i]) != -1   ){
			casillas[tiros2[i]].src = "/img_barcos/mar explosion.jpg";
		}
	}
	
}

// funcion que actualiza las vidas de las naves en la tabla
function actualizarTablaVida(oponente, jsonPartida){
	if(!jsonPartida.tiros1 || !jsonPartida.tiros2)
		return true;

	//se ajustan las vidas al maximo
	puntajePortaaviones.innerHTML = "5/5";
	puntajeAcorazado.innerHTML = "3/3";
	puntajeFragata.innerHTML = "3/3";
	puntajeSubmarino.innerHTML = "3/3";
	puntajeBuque.innerHTML = "2/2";
	puntajePortaaviones2.innerHTML = "5/5";
	puntajeAcorazado2.innerHTML = "3/3";
	puntajeFragata2.innerHTML = "3/3";
	puntajeSubmarino2.innerHTML = "3/3";
	puntajeBuque2.innerHTML = "2/2";


	var vidas = {
		portaaviones: 5,
		acorazado: 3,
		fragata: 3,
		submarino: 3,
		buque: 2
	}
	var tablero1; //tablero del huesped
	var tiros1;
	var tablero2; //tablero oponente
	var tiros2;
	if(oponente == 1){
		tablero1 = jsonPartida.tablero2;
		tablero2 = jsonPartida.tablero1;
		tiros1 = jsonPartida.tiros2;
		tiros2 = jsonPartida.tiros1;
	} else if (oponente == 2){
		tablero1 = jsonPartida.tablero1;
		tablero2 = jsonPartida.tablero2;
		tiros1 = jsonPartida.tiros1;
		tiros2 = jsonPartida.tiros2
	} else {
		return false;
	}
	for(var i = 0; i < tiros2.length; i++){ //verificando vidas del huesped
		var posicionTirada = parseInt(tiros2[i]);
		var posicionEnPortaavion = tablero1.portaaviones.posiciones.indexOf(posicionTirada);
		var posicionEnAcorazado = tablero1.acorazado.posiciones.indexOf(posicionTirada);
		var posicionEnFragata = tablero1.fragata.posiciones.indexOf(posicionTirada);
		var posicionEnSubmarino = tablero1.submarino.posiciones.indexOf(posicionTirada);
		var posicionEnBuque = tablero1.buque.posiciones.indexOf(posicionTirada);

		if(posicionEnPortaavion != -1){
			vidas.portaaviones--;
			puntajePortaaviones.innerHTML = vidas.portaaviones + "/" + 5;
			tablero1.portaaviones.posiciones.splice(posicionEnPortaavion, 1);
		}
		if(posicionEnAcorazado != -1){
			vidas.acorazado--;
			puntajeAcorazado.innerHTML = vidas.acorazado + "/" + 3;
			tablero1.acorazado.posiciones.splice(posicionEnAcorazado, 1);
		}
		if(posicionEnFragata != -1){
			vidas.fragata--;
			puntajeFragata.innerHTML = vidas.fragata + "/" + 3;
			tablero1.fragata.posiciones.splice(posicionEnFragata, 1);
		}
		if(posicionEnSubmarino != -1){
			vidas.submarino--;
			puntajeSubmarino.innerHTML = vidas.fragata + "/" + 3;
			tablero1.submarino.posiciones.splice(posicionEnSubmarino, 1);
		}
		if(posicionEnBuque != -1) {
			vidas.buque--;
			puntajeBuque.innerHTML = vidas.buque + "/" + 2;
			tablero1.buque.posiciones.splice(posicionEnBuque, 1);
		}
	}
	vidas = {
		portaaviones: 5,
		acorazado: 3,
		fragata: 3,
		submarino: 3,
		buque: 2
	}
	for(var i = 0; i < tiros1.length; i++){ //verificando vidas del oponente
		var posicionTirada = parseInt(tiros1[i]);
		var posicionEnPortaavion = tablero2.portaaviones.posiciones.indexOf(posicionTirada);
		var posicionEnAcorazado = tablero2.acorazado.posiciones.indexOf(posicionTirada);
		var posicionEnFragata = tablero2.fragata.posiciones.indexOf(posicionTirada);
		var posicionEnSubmarino = tablero2.submarino.posiciones.indexOf(posicionTirada);
		var posicionEnBuque = tablero2.buque.posiciones.indexOf(posicionTirada);

		if(posicionEnPortaavion != -1){
			vidas.portaaviones--;
			puntajePortaaviones2.innerHTML = vidas.portaaviones + "/" + 5;
			tablero2.portaaviones.posiciones.splice(posicionEnPortaavion, 1);
		}
		if(posicionEnAcorazado != -1){
			vidas.acorazado--;
			puntajeAcorazado2.innerHTML = vidas.acorazado + "/" + 3;
			tablero2.acorazado.posiciones.splice(posicionEnAcorazado, 1);
		}
		if(posicionEnFragata != -1){
			vidas.fragata--;
			puntajeFragata2.innerHTML = vidas.fragata + "/" + 3;
			tablero2.fragata.posiciones.splice(posicionEnFragata, 1);
		}
		if(posicionEnSubmarino != -1){
			vidas.submarino--;
			puntajeSubmarino2.innerHTML = vidas.fragata + "/" + 3;
			tablero2.submarino.posiciones.splice(posicionEnSubmarino, 1);
		}
		if(posicionEnBuque != -1) {
			vidas.buque--;
			puntajeBuque2.innerHTML = vidas.buque + "/" + 2;
			tablero2.buque.posiciones.splice(posicionEnBuque, 1);
		}
	}

}


