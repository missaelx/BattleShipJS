var barcosSize = {
	portaaviones: 5,
	acorazado: 3,
	fragata: 3,
	submarino: 3,
	buque: 2
}
function getBarcoSeleccionado(){
	var barcos = document.getElementsByName("barco");
	for (var i = barcos.length - 1; i >= 0; i--) {
		if(barcos[i].checked){
			return barcos[i].value;
		}
	}
}
function existenValoresRepetidosArrays(array1, array2){

	for (var i = array1.length - 1; i >= 0; i--) {
		for (var j = array2.length - 1; j >= 0; j--) {
			if(array2[j] == array1[i]){
				return true;
			}
		}
	}

	return false;
}
function calcularPosiciones(numeroCasillasOcupadas, orientacion, inicio, tablero,barco){
	inicio = parseInt(inicio);
	numeroCasillasOcupadas = parseInt(numeroCasillasOcupadas);
	var esBarcoVerticalNormal = inicio < 100 - (numeroCasillasOcupadas-1)*10;
	var esBarcoHorizontalNormal = inicio % 10 < 10 - (numeroCasillasOcupadas -1);
	var posiciones;
	switch(orientacion){
		case "h":
			switch(numeroCasillasOcupadas){
				case 2:
					if(esBarcoHorizontalNormal)
						posiciones =  [inicio, inicio+1];
					else
						posiciones =  [inicio-1, inicio];
				break;
				case 3:
					if(esBarcoHorizontalNormal)
						posiciones =  [inicio, inicio+1, inicio+2];
					else
						posiciones =  [inicio-2, inicio-1, inicio];
				break;
				case 5:
					if(esBarcoHorizontalNormal)
						posiciones =  [inicio, inicio+1, inicio+2, inicio+3, inicio+4];
					else
						posiciones =  [inicio-4, inicio-3, inicio-2, inicio-1, inicio];
				break;
			}
		break;
		case "v":
			switch(numeroCasillasOcupadas){
				case 2:
					if(esBarcoVerticalNormal)
						posiciones =  [inicio, inicio+10];
					else
						posiciones =  [inicio-10, inicio];
				break;
				case 3:
					if(esBarcoVerticalNormal)
						posiciones = [inicio, inicio+10, inicio+20];
					else
						posiciones = [inicio-20, inicio-10, inicio];
				break;
				case 5:
					if(esBarcoVerticalNormal)
						posiciones = [inicio, inicio+10, inicio+20, inicio+30, inicio+40];
					else
						posiciones = [inicio-40, inicio-30, inicio-20, inicio-10, inicio];
				break;
			}
	}
	if(tablero.portaaviones && barco!="portaaviones"){
		if(existenValoresRepetidosArrays(tablero.portaaviones.posiciones, posiciones)){
			posiciones = false;
		}
	}
	if (tablero.acorazado && posiciones && barco!="acorazado"){
		if(existenValoresRepetidosArrays(tablero.acorazado.posiciones, posiciones)){
			posiciones = false;
		}
	}
	if (tablero.fragata && posiciones && barco!="fragata"){
		if(existenValoresRepetidosArrays(tablero.fragata.posiciones, posiciones)){
			posiciones = false;
		}
	}
	if(tablero.submarino && posiciones && barco != "submarino"){
		if(existenValoresRepetidosArrays(tablero.submarino.posiciones, posiciones)){
			posiciones = false;
		}
	}
	if (tablero.buque && posiciones && barco != "buque"){
		if(existenValoresRepetidosArrays(tablero.buque.posiciones, posiciones)){
			posiciones = false;
		}	
	}
	return posiciones;
}

var imgCuadros = document.getElementsByClassName('barcocuadrado');
for (var i = imgCuadros.length - 1; i >= 0; i--) {
	imgCuadros[i].addEventListener("dblclick", function(){
		if(this.dataset.orientacion == "v"){
			this.dataset.orientacion = "h"
			this.style.transform = "rotate(0deg)";
		}
		else{
			this.dataset.orientacion = "v"
			this.style.transform = "rotate(90deg)";
		}
	});
}

var seleccionado; //barco seleccionado
var JSONTablero= {};


var casillas = document.getElementsByClassName('casilla');
for (var i = casillas.length - 1; i >= 0; i--) {
	casillas[i].addEventListener("click", function(){
		var barcoSeleccionado = getBarcoSeleccionado();
		var orientacion = document.getElementById(barcoSeleccionado).dataset.orientacion;
		var posicion = this.dataset.position;
		var posiciones = calcularPosiciones(barcosSize[barcoSeleccionado], orientacion, posicion, JSONTablero, barcoSeleccionado); 
		if(posiciones){
			JSONTablero[barcoSeleccionado]={
				orientacion: orientacion,
				posiciones: posiciones
			}	
		}
		
		console.log(JSONTablero);
		construirTableroFromJSON(JSONTablero);
	});
}

function construirTableroFromJSON(json){
	var casillas = document.getElementsByClassName('casilla');
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