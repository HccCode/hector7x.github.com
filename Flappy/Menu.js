const Menu = {

    init() {
        // Detectamos si el usuario está en un celular o tablet
        if (!juego.device.desktop) {
            // Configuración EXCLUSIVA para móviles: Escalar al máximo tamaño posible
            juego.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            juego.scale.forceOrientation(false, true);
        } else {
            // Configuración para PC: Mantener el tamaño original (370x550)
            juego.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
        }
        
        // Sin importar si es PC o móvil, centramos el lienzo en la pantalla
        juego.scale.pageAlignHorizontally = true;
        juego.scale.pageAlignVertically = true;
    },

	preload() {
		juego.stage.backgroundColor = "#FFF";
		juego.load.image('bg', "img/bg2.jpeg"); 
		juego.load.image('boton', "img/btn.png");
		juego.load.spritesheet('personaje1', "img/goku.png", 50, 30);
		juego.load.spritesheet('personaje2', "img/gohan.png", 50, 30);
		juego.load.spritesheet('personaje3', "img/GoldenFrieza.png", 64, 20);
		juego.load.spritesheet('personaje4', "img/vegeta.png", 56, 26); 
	},

	create() {
		this.bgMenu = juego.add.tileSprite(0, 0, 370, 550, 'bg');

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

        const recordActual = Number(localStorage.getItem('recordPuntos')) || 0;
        const txtMejorPuntuacion = juego.add.text(juego.width/2, 25, `MEJOR PUNTUACION: ${recordActual}`, {font: "16px Impact", fill: "#FFF", stroke: "#000", strokeThickness: 3, align: "center"});
        txtMejorPuntuacion.anchor.setTo(0.5);

		const txtTitulo1 = juego.add.text(juego.width/2, 80, "FLAPPY", {font: "45px Impact", fill: "#FF4500", stroke: "#FFF", strokeThickness: 6, align: "center"});
		txtTitulo1.anchor.setTo(0.5);
		txtTitulo1.setShadow(3, 3, 'rgba(0,0,0,1)', 0);

		const txtTitulo2 = juego.add.text(juego.width/2, 125, "BALL Z", {font: "55px Impact", fill: "#FFD700", stroke: "#000", strokeThickness: 8, align: "center"});
		txtTitulo2.anchor.setTo(0.5);

		const txtSelecciona = juego.add.text(juego.width/2, 220, "SELECCIONA TU GUERRERO", {font: "22px Impact", fill: "#FFF", stroke: "#000", strokeThickness: 4, align: "center"});
		txtSelecciona.anchor.setTo(0.5);

		this.txtNombrePersonaje = juego.add.text(juego.width/2, 335, "", {font: "28px Impact", fill: "#00FF00", stroke: "#000", strokeThickness: 5, align: "center"});
		this.txtNombrePersonaje.anchor.setTo(0.5);

		const actualizarSeleccion = (btnActivo, nombre) => {
			[btnGoku, btnGohan, btnFrieza, btnVegeta].forEach(btn => {
				btn.alpha = 0.4; 
				btn.scale.setTo(1); 
			});
			btnActivo.alpha = 1; 
			btnActivo.scale.setTo(1.4); 
			this.txtNombrePersonaje.text = nombre; 
			juego.add.tween(btnActivo.scale).from({x: 1, y: 1}, 200, Phaser.Easing.Bounce.Out, true);
		};

		const btnY = 280;

		const btnGoku = juego.add.button(juego.width / 2 - 105, btnY, 'personaje1', () => {
			personajeSeleccionado = 'personaje1';
			actualizarSeleccion(btnGoku, "GOKU");
		}, this, 1, 0, 2);
		btnGoku.anchor.setTo(0.5);

		const btnGohan = juego.add.button(juego.width / 2 - 35, btnY, 'personaje2', () => {
			personajeSeleccionado = 'personaje2';
			actualizarSeleccion(btnGohan, "GOHAN");
		}, this, 1, 0, 2);
		btnGohan.anchor.setTo(0.5);

		const btnFrieza = juego.add.button(juego.width / 2 + 35, btnY, 'personaje3', () => {
			personajeSeleccionado = 'personaje3';
			actualizarSeleccion(btnFrieza, "FREEZER");
		}, this, 1, 0, 2);
		btnFrieza.anchor.setTo(0.5);

		const btnVegeta = juego.add.button(juego.width / 2 + 105, btnY, 'personaje4', () => {
			personajeSeleccionado = 'personaje4';
			actualizarSeleccion(btnVegeta, "VEGETA");
		}, this, 1, 0, 2);
		btnVegeta.anchor.setTo(0.5);

		const btnInicial = personajeSeleccionado === 'personaje2' ? btnGohan :
						   personajeSeleccionado === 'personaje3' ? btnFrieza :
						   personajeSeleccionado === 'personaje4' ? btnVegeta : btnGoku;
		const nombreInicial = personajeSeleccionado === 'personaje2' ? "GOHAN" :
							  personajeSeleccionado === 'personaje3' ? "FREEZER" :
							  personajeSeleccionado === 'personaje4' ? "VEGETA" : "GOKU";
		actualizarSeleccion(btnInicial, nombreInicial);

		const boton = this.add.button(juego.width/2, 440, 'boton', this.iniciarJuego, this);
		boton.anchor.setTo(0.5);

		const txtBoton = juego.add.text(juego.width/2, 440, "INICIAR JUEGO", {font: "22px Impact", fill:"#FFF", stroke:"#000", strokeThickness:4});
		txtBoton.anchor.setTo(0.5);

		juego.add.tween(boton.scale).to({ x: 1.05, y: 1.05 }, 600, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
		juego.add.tween(txtBoton.scale).to({ x: 1.05, y: 1.05 }, 600, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
	},

	update() {
		this.bgMenu.tilePosition.x -= 0.5;
	},

	iniciarJuego() {
		this.state.start('Juego');
	}
};