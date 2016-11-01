var conexion = require("./js/conexionmysql");

try{
	if(conexion.verificarUsuario("missaelxp", "missaelxp")){
		console.log("hola");
	} else {
		console.log("none");
	}
} catch(err){
	console.log(err);
}


//conexion.verificarUsuario("missaelxp", "missaelxp");