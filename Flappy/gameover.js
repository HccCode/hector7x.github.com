const Game_Over = {
    
    preload() {
        juego.load.image('bg', 'img/bg2.jpeg');
        juego.load.image('boton', 'img/btn.png');
        juego.load.image('shenron', 'img/shenron.png'); // Cargamos a Shenlong
    }, 
    
    create() {
        // Fondo en movimiento
        this.bgGameOver = juego.add.tileSprite(0, 0, 370, 550, 'bg');

        // Shenlong flotando en el fondo
        const shenron = juego.add.sprite(juego.width/2, juego.height/2 - 20, 'shenron');
        shenron.anchor.setTo(0.5);
        shenron.alpha = 0.8;
        // Animación suave de sube y baja (Tween)
        juego.add.tween(shenron).to({ y: shenron.y - 15 }, 1500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

        // Estilos de texto
        const estiloTitulo = {font: "40px Impact", fill: "#FFD700", stroke: "#000", strokeThickness: 6, align: "center"};
        const estiloTexto = {font: "24px Impact", fill: "#FFF", stroke: "#000", strokeThickness: 4, align: "center"};

        const mensaje = juego.ganaste ? "¡GANASTE!" : "FIN DEL JUEGO";
        const txtTitulo = juego.add.text(juego.width/2, juego.height/2 - 160, mensaje, estiloTitulo);
        txtTitulo.anchor.setTo(0.5);

        const txtPuntosEtiqueta = juego.add.text(juego.width/2, juego.height/2 - 100, "PUNTUACION ACTUAL", estiloTexto);
        txtPuntosEtiqueta.anchor.setTo(0.5);
        
        if (puntos === -1) puntos = 0;
            
        const txtPuntosNumero = juego.add.text(juego.width/2, juego.height/2 - 60, `${puntos} PTS`, {font: "36px Impact", fill: "#FFF", stroke: "#000", strokeThickness: 5});
        txtPuntosNumero.anchor.setTo(0.5);

        const recordPuntos = Number(localStorage.getItem('recordPuntos')) || 0;
        const recordEstrellas = Number(localStorage.getItem('recordEstrellas')) || 0;
        
        const txtRecord = juego.add.text(
            juego.width/2, 
            juego.height/2 + 60, 
            `RECORDS\n${recordPuntos} PUNTOS | ${recordEstrellas} ESTRELLAS`, 
            estiloTexto
        );
        txtRecord.anchor.setTo(0.5);

        const boton = this.add.button(juego.width/2, juego.height/2 + 160, 'boton', this.irAMenu, this);
        boton.anchor.setTo(0.5);

        const txtBoton = juego.add.text(juego.width/2, juego.height/2 + 160, "VOLVER AL MENU", {font: "20px Impact", fill:"#FFF", stroke:"#000", strokeThickness: 3});
        txtBoton.anchor.setTo(0.5);

        juego.ganaste = false;
    }, 
    
    update() {
        this.bgGameOver.tilePosition.x -= 0.5;
    },
    
    irAMenu() {
        this.state.start('Menu');
    }
};