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

module.exports.verificarUsuario = verificarUsuario;
