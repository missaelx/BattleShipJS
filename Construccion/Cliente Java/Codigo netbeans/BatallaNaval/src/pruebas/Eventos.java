package pruebas;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;
import java.net.URISyntaxException;

/**
 *
 * @author Missael Hernández Rosado
 */
public class Eventos {
    private static io.socket.client.Socket socket = null;
    
    public static void main(String[] args){
        try {
            socket = IO.socket("http://localhost:8080");
        } catch (URISyntaxException ex) {
            System.out.println(ex.getMessage());
        }
        socket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {

            @Override
            public void call(Object... args) {
                String jsonString = "{\"usuario1\": 1,\"usuario2\": 2,\"tablero1\": \"tablero 1 papi\",\"tablero2\": \"tablero 2 mami\"}";
                
                socket.emit("crearNuevaPartida", jsonString);
              //socket.disconnect();
            }

          }).on("bienvenido", new Emitter.Listener() {

            @Override
            public void call(Object... args) {
                System.out.println("Recibi saludito: " + args[0]);
            }

          }).on("resultadoCreacionPartida", new Emitter.Listener() {

            @Override
            public void call(Object... args) {
                System.out.println(args[0]);
            }

          });
          socket.connect();
          socket.emit("foo", "hola :)");
    }
}
