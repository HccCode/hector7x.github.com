const Game_Over = {
    
    preload() {
        juego.stage.backgroundColor = '#FFF';
        juego.load.image('boton', 'img/btn.png');
    }, 
    
    create() {
        const boton = this.add.button(juego.width/2, juego.height/2, 'boton', this.irAMenu, this);
        boton.anchor.setTo(0.5);

        // Nuevo: Texto sobre el botón para dar feedback visual
        const txtBoton = juego.add.text(juego.width/2, juego.height/2, "Volver al Menú", {font: "bold 16px sans-serif", fill:"white", align:"center"});
        txtBoton.anchor.setTo(0.5);
        
        const txtPuntosEtiqueta = juego.add.text(juego.width/2 -50, juego.height/2 -85, "Puntos: ", {font: "bold 20px sans-serif", fill:"black", align:"center"});
        txtPuntosEtiqueta.anchor.setTo(0.5);
        
        if (puntos === -1) puntos = 0;
            
        const txtPuntosNumero = juego.add.text(juego.width/2 +50, juego.height/2 -85, puntos.toString(), {font: "bold 20px sans-serif", fill:"black", align:"center"});
        txtPuntosNumero.anchor.setTo(0.5);

        // Se aseguran de que sean números
        const recordPuntos = Number(localStorage.getItem('recordPuntos')) || 0;
        const recordEstrellas = Number(localStorage.getItem('recordEstrellas')) || 0;
        
        // Uso de Template Literals (comillas invertidas)
        const txtRecord = juego.add.text(
            juego.width/2, 
            juego.height/2 + 100, 
            `Record: ${recordPuntos} puntos, ${recordEstrellas} estrellas`, 
            {font: "bold 18px sans-serif", fill:"black", align:"center"}
        );
        txtRecord.anchor.setTo(0.5);

        const mensaje = juego.ganaste ? "¡Ganaste!" : "Juego terminado";
        const txtTitulo = juego.add.text(juego.width/2, juego.height/2 -125, mensaje, {font: "bold 30px sans-serif", fill:"black", align:"center"});
        txtTitulo.anchor.setTo(0.5);

        juego.ganaste = false;
    }, 
    
    irAMenu() {
        this.state.start('Menu');
    }
    
};