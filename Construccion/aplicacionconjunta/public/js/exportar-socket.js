var socket = io();
socket.emit('exportar-socket');
socket.on('invitacion-partida', function (data) {
	invitaciones.innerHTML +=
	'<div class="alert alert-info alert-dismissible">El jugador <span id="jugador2">' +
	data.jugador2 + 
	'</span> te ha invitado a una partida.<a id="linkInvitacion" href="' +
	"/game/armartablero2/" + data._id +
	'" class="alert-link"> Jugar</a></div></div>';
});
socket.on("invitacion-reanudar", function(data){
	invitaciones.innerHTML +=
	'<div class="alert alert-success alert-dismissible">El jugador <span id="jugador2">' +
	data.jugador2 + 
	'</span> te ha invitado a reanudar una partida.<a id="linkInvitacion" href="' +
	"/game/reanudar2/" + data._id +
	'" class="alert-link"> Jugar</a></div></div>';
});