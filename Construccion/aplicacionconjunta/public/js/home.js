seleccionaroponente.addEventListener("click", function(e){
	if(parseInt(usuariosconectados.innerHTML)<2){
		e.preventDefault();
		alert("No hay otro jugador que retar :(");
	}
});

//socket.io

socket.on("actualizar-numero-jugadores", function(data){
	usuariosconectados.innerHTML = data;
});