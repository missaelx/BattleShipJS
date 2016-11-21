/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package VentanaIngreso;

import java.net.URL;
import java.util.ResourceBundle;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;

/**
 *
 * @author AndrésRoberto
 */
public class FXMLDocumentController implements Initializable {
    
    
    @FXML private TextField tFUsuario;
    @FXML private TextField tFContraseña;
    @FXML private Label lUsuario;
    @FXML private Label lContraseña;
    @FXML private Label lTitulo;
    @FXML private Button bIngresar;
    
    @FXML
    private void accionIngresar(ActionEvent event) {
        tFUsuario.setText("yes!");
        
    }
    
    @Override
    public void initialize(URL url, ResourceBundle rb) {
        tFUsuario.setText("Ej. Missandros");
    }    
    
}
