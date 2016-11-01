var mysql = require("mysql");

var con = mysql.createConnection({
	host: "localhost",
	user: "batallanaval",
	password: "batallanaval",
	database: "batallanaval"
});


function verificarUsuario(username,password){
	var sql = "SELECT * FROM usuarios WHERE username = ? and password = ?";
	var inserts = [username,password];
	sql = mysql.format(sql, inserts);

	return con.query(sql, function(err,rows){
		if(err) throw err;
		//console.log(rows[0].username);
		if(rows.length>0){
			return true;
		} else {
			return false;
		}
		
	});
}





module.exports.verificarUsuario = verificarUsuario;






/*con.connect(function(err){
	if(err){
		console.log('Error connecting to Db');
		return;
	}
	
});*/




//con.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
//});