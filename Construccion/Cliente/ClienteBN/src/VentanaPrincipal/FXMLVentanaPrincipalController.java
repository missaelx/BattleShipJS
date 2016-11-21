/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package VentanaPrincipal;

import java.net.URL;
import java.util.ResourceBundle;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.ListView;
import javafx.scene.control.TableView;
import javafx.scene.control.TextArea;

/**
 * FXML Controller class
 *
 * @author AndrésRoberto
 */
public class FXMLVentanaPrincipalController implements Initializable {
    
    @FXML private TextArea tASalaJuegoDescripcion;
    @FXML private Button bIniciarJuego;
    @FXML private Label lNumeroJugadores;
    @FXML private Label lPartidasGuardadas;
    //@FXML ListView <Partidas> = new ListView<Partidas>;
    @FXML TableView tablaPuntuaciones = new TableView();
    
    @FXML
    private void accionIniciarJuego(ActionEvent event) {
        
        
    }

    /**
     * Initializes the controller class.
     */
    @Override
    public void initialize(URL url, ResourceBundle rb) {
        // TODO
    }    
    
}
