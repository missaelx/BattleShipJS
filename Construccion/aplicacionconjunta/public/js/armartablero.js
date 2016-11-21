function getBarcoSeleccionado(){
	var barcos = document.getElementsByName("barco");
	for (var i = barcos.length - 1; i >= 0; i--) {
		if(barcos[i].checked){
			return barcos[i].value;
		}
	}
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
		
	});
}