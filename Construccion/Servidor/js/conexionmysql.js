var mysql = require("mysql");

var con = mysql.createConnection({
	host: "localhost",
	user: "batallanaval",
	password: "batallanaval",
	database: "batallanaval"
});


function verificarUsuario (username, password, callback) {
	var sql = "SELECT * FROM usuarios WHERE username = ? and password = ?";
	var inserts = [username,password];
	sql = mysql.format(sql, inserts);

    con.query(sql, function(err, rows, fields){
    	if (err)
    		callback(err, null);
    	if(rows.length>0){
    		callback(null, true);
    	}
    	else{
    		callback(null, false);
    	}
    });
};

function crearPartida(usernameId1, usernameId2, tablero1, tablero2, callback){
	var sql = "INSERT INTO partidas SET ?";
	var inserts = {
		idUsuario1: usernameId1,
		idUsuario2: usernameId2,
		estructuraTablero1: tablero1,
		estructuraTablero2: tablero2
	};
	con.query(sql, inserts, function(err, result){
		if(err){
			callback(err, null);
		}
		if(result.affectedRows > 0){
			callback(null, true);
		} else {
			callback(null, false);
		}
	});
}

function getIdFromUsername(username, callback){
	var sql = "SELECT idusuarios FROM usuarios WHERE username = ?";
	var inserts = [username];
	sql = mysql.format(sql, inserts);
	con.query(sql, function(err, rows, fieldss){
		if(err){
			callback(err, null);
		} else {
			callback(null, rows[0].idusuarios);
		}
	});
}

//function recuperarPartida(idPartida){
//	return;
//}

module.exports.verificarUsuario = verificarUsuario;
module.exports.crearPartida = crearPartida;
//module.exports.getIdFromUsername = getIdFromUsername;
