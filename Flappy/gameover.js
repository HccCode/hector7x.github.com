var Game_Over = {
    
    preload: function(){
        juego.stage.backgroundColor = '#FFF';
        juego.load.image('boton', 'img/btn.png');
    }, 
    
    create: function(){
        var boton = this.add.button(juego.width/2, juego.height/2, 'boton', this.irAMenu, this);
        boton.anchor.setTo(0.5);
        
        var txtPuntosEtiqueta = juego.add.text(juego.width/2 -50, juego.height/2 -85, "Puntos: ", {font: "bold 20px sans-serif", fill:"black", align:"center"});
        txtPuntosEtiqueta.anchor.setTo(0.5);
        if(puntos == -1)
            puntos = 0;
        var txtPuntosNumero = juego.add.text(juego.width/2 +50, juego.height/2 -85, puntos.toString(), {font: "bold 20px sans-serif", fill:"black", align:"center"});
        txtPuntosNumero.anchor.setTo(0.5);

        // Mostrar récords
        var recordPuntos = localStorage.getItem('recordPuntos') || 0;
        var recordEstrellas = localStorage.getItem('recordEstrellas') || 0;
        var txtRecord = juego.add.text(juego.width/2, juego.height/2 + 100, "Record: " + recordPuntos + " puntos, " + recordEstrellas + " estrellas", {font: "bold 18px sans-serif", fill:"black", align:"center"});
        txtRecord.anchor.setTo(0.5);

        // Mostrar mensaje de victoria si corresponde
        var mensaje = (juego.ganaste) ? "¡Ganaste!" : "Juego terminado";
        var txtTitulo = juego.add.text(juego.width/2, juego.height/2 -125, mensaje, {font: "bold 30px sans-serif", fill:"black", align:"center"});
        txtTitulo.anchor.setTo(0.5);

        // Reiniciar bandera de victoria para la próxima partida
        juego.ganaste = false;
    }, 
    
    irAMenu: function(){
        this.state.start('Menu');
    }
    
};