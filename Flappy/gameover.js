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
        var txtTitulo = juego.add.text(juego.width/2, juego.height/2 -125, "Juego terminado", {font: "bold 30px sans-serif", fill:"black", align:"center"});
        txtTitulo.anchor.setTo(0.5);
    }, 
    
    irAMenu: function(){
        this.state.start('Menu');
    }
    
};