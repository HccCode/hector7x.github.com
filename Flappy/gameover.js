const Game_Over = {
    
    preload() {
        juego.load.image('bg', 'img/bg2.jpeg');
        juego.load.image('boton', 'img/btn.png');
        juego.load.image('shenron', 'img/shenron.png');
        juego.load.image('4star', 'img/4star.png');
    }, 
    
    create() {
        this.bgGameOver = juego.add.tileSprite(0, 0, 370, 550, 'bg');

        const bmdKi = juego.add.bitmapData(6, 6);
        bmdKi.ctx.fillStyle = '#FFD700';
        bmdKi.ctx.beginPath();
        bmdKi.ctx.arc(3, 3, 3, 0, Math.PI * 2);
        bmdKi.ctx.fill();
        juego.cache.addImage('particulaKi', null, bmdKi.canvas);

        const emitterKi = juego.add.emitter(juego.width / 2, juego.height, 30);
        emitterKi.width = juego.width;
        emitterKi.makeParticles('particulaKi');
        emitterKi.setXSpeed(-20, 20);
        emitterKi.setYSpeed(-60, -30); 
        emitterKi.setAlpha(0.1, 0.5, 2000);
        emitterKi.setScale(0.5, 1.5, 0.5, 1.5, 2000);
        emitterKi.start(false, 3000, 100);

        const shenron = juego.add.sprite(juego.width / 2, juego.height / 2 - 25, 'shenron');
        shenron.anchor.setTo(0.5);
        shenron.alpha = 0.7;
        juego.add.tween(shenron).to({ y: shenron.y - 15 }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

        const estiloTitulo = { font: "42px Impact", fill: "#FF4500", stroke: "#FFF", strokeThickness: 6, align: "center" };
        const estiloVictoria = { font: "46px Impact", fill: "#FFD700", stroke: "#000", strokeThickness: 7, align: "center" };
        const estiloEtiqueta = { font: "18px Impact", fill: "#AAAAAA", stroke: "#000", strokeThickness: 3, align: "center" };
        const estiloNumero = { font: "32px Impact", fill: "#FFF", stroke: "#000", strokeThickness: 5, align: "center" };
        const estiloRecords = { font: "18px Impact", fill: "#FFD700", stroke: "#000", strokeThickness: 4, align: "center" };

        const mensaje = juego.ganaste ? "¡GANASTE!" : "FIN DEL JUEGO";
        const estiloElegido = juego.ganaste ? estiloVictoria : estiloTitulo;
        const txtTitulo = juego.add.text(juego.width / 2, 60, mensaje, estiloElegido);
        txtTitulo.anchor.setTo(0.5);
        if (juego.ganaste) {
            txtTitulo.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 2);
        }

        if (puntos === -1) puntos = 0;

        const txtPuntosEtiqueta = juego.add.text(juego.width / 2 - 75, 120, "PUNTOS", estiloEtiqueta);
        txtPuntosEtiqueta.anchor.setTo(0.5);
        const txtPuntosNumero = juego.add.text(juego.width / 2 - 75, 155, puntos, estiloNumero);
        txtPuntosNumero.anchor.setTo(0.5);

        const txtEstrellasEtiqueta = juego.add.text(juego.width / 2 + 75, 120, "ESFERAS", estiloEtiqueta);
        txtEstrellasEtiqueta.anchor.setTo(0.5);
        
        const imgEstrellaMini = juego.add.sprite(juego.width / 2 + 50, 155, '4star');
        imgEstrellaMini.width = 24; imgEstrellaMini.height = 24;
        imgEstrellaMini.anchor.setTo(0.5);
        const txtEstrellasNumero = juego.add.text(juego.width / 2 + 85, 155, estrellasObtenidas, estiloNumero);
        txtEstrellasNumero.anchor.setTo(0.5);

        let rangoGuerrero = "HUMANO";
        let colorRango = "#FFFFFF";

        if (puntos >= 50) {
            rangoGuerrero = "SUPER SAIYAJIN DIOS";
            colorRango = "#FF007F"; 
        } else if (puntos >= 30) {
            rangoGuerrero = "SUPER SAIYAJIN";
            colorRango = "#FFD700"; 
        } else if (puntos >= 12) {
            rangoGuerrero = "GUERRERO Z";
            colorRango = "#00FF00"; 
        }

        const txtRangoEtiqueta = juego.add.text(juego.width / 2, 210, "RANGO ALCANZADO", estiloEtiqueta);
        txtRangoEtiqueta.anchor.setTo(0.5);
        const txtRangoTexto = juego.add.text(juego.width / 2, 245, rangoGuerrero, { font: "26px Impact", fill: colorRango, stroke: "#000", strokeThickness: 5, align: "center" });
        txtRangoTexto.anchor.setTo(0.5);
        juego.add.tween(txtRangoTexto.scale).from({ x: 0.5, y: 0.5 }, 400, Phaser.Easing.Back.Out, true);

        // SELLO DE NUEVO RÉCORD
        if (juego.nuevoRecord) {
            const txtNuevoRecord = juego.add.text(juego.width/2, 290, "¡NUEVO RÉCORD MUNDIAL!", {font: "22px Impact", fill: "#FF0000", stroke: "#FFF", strokeThickness: 4, align: "center"});
            txtNuevoRecord.anchor.setTo(0.5);
            juego.add.tween(txtNuevoRecord).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true, 0, -1, true); // Animación de parpadeo constante
        }

        const recordPuntos = Number(localStorage.getItem('recordPuntos')) || 0;
        const recordEstrellas = Number(localStorage.getItem('recordEstrellas')) || 0;
        
        const txtRecord = juego.add.text(
            juego.width / 2, 
            350, 
            `MEJORES RÉCORDS HISTÓRICOS\n🏆 PUNTOS: ${recordPuntos}   |   ⭐ ESFERAS: ${recordEstrellas}`, 
            estiloRecords
        );
        txtRecord.anchor.setTo(0.5);

        const boton = this.add.button(juego.width / 2, 450, 'boton', this.irAMenu, this);
        boton.anchor.setTo(0.5);

        const txtBoton = juego.add.text(juego.width / 2, 450, "VOLVER AL MENÚ", { font: "22px Impact", fill: "#FFF", stroke: "#000", strokeThickness: 4 });
        txtBoton.anchor.setTo(0.5);

        juego.add.tween(boton.scale).to({ x: 1.05, y: 1.05 }, 600, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
        juego.add.tween(txtBoton.scale).to({ x: 1.05, y: 1.05 }, 600, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

        juego.ganaste = false;
    }, 
    
    update() {
        this.bgGameOver.tilePosition.x -= 0.5;
    },
    
    irAMenu() {
        this.state.start('Menu');
    }
};