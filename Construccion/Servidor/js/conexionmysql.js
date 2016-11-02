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

function crearPartida(username1, username2, tablero1, tablero2, callback){
	var sql = "INSERT INTO partidas SET ?";
	var inserts = {
		idUsuario1: username1,
		idUsuario2: username2,
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


function recuperarPartida(idPartida){
	return;
}

module.exports.verificarUsuario = verificarUsuario;
