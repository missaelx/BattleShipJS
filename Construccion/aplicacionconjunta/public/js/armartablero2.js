

//para responder solicitud de partida
confirmarInvitacion.addEventListener("click", function(e){
	e.preventDefault();
	socket.emit("aceptar-partida", {
		tablero: JSONTablero,
		idPartida: idPartida.value
	});
})

socket.on("aceptar-partida-error", function(data){
	alert(data.message);
	console.log(data);
})

socket.on("partida-aceptada", function(data){
	contenedorPartidaFinal.value = data;
	empezarJuego.submit();
});