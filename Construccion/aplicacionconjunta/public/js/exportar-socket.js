var socket = io();
socket.emit('exportar-socket');

socket.on("mostrar-datos", function(data){
	console.log(data);
})