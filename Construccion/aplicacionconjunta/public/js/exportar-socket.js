var socket = io();
socket.emit('exportar-socket');
socket.on('invitacion-partida', function (data) {
	invitaciones.innerHTML +=
	'<div class="alert alert-info alert-dismissible">El jugador <span id="jugador2">' +
	data.jugador2 + 
	'</span> te ha invitado a una partida.<a id="linkInvitacion" href="' +
	"/game/empezarpartida/" + data._id +
	'" class="alert-link"> Jugar</a></div></div>';
});