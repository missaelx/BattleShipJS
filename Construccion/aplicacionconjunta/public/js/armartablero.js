

//funcionalidad para el boton Empezar partida
empezarpartida.addEventListener("click", function(e){
	e.preventDefault();
	if(!JSONTablero.portaaviones ||
		!JSONTablero.acorazado ||
		!JSONTablero.fragata ||
		!JSONTablero.submarino ||
		!JSONTablero.buque){
		alert("El tablero está incompleto");
	} else {
		socket.emit('registrar-partida', {
			usuario: usuarioActual.value,
			tablero: JSONTablero,
			usuario2: oponenteSeleccionado.value,
			turno: usuarioActual.value
		});
	}

})

//se manejan eventos para registrar la partida y recibir su identificador
socket.on("partida-registrada", function(data){
	if(data.error){
		alert("Hubo un error en la creacion de la partida");
		console.log(data.error);
	}
	else {
		empezarJuego.action = "/game/jugar/" + data;
		empezarJuego.submit();
	}
});