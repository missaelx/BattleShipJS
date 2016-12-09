Array.from(document.getElementsByClassName("no-disponible"), function(item){
	item.addEventListener("click", function(){
		alert("El usuario no esta disponible para reponder la partida");
	});
})