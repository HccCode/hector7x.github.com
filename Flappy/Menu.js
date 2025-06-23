var Menu = {

	preload: function () {
		juego.stage.backgroundColor = "#FFF";
		juego.load.image('boton',"img/btn.png");
		juego.load.spritesheet('personaje1',"img/goku.png",50,30);
		juego.load.spritesheet('personaje2', "img/gohan.png",50,30);
		juego.load.spritesheet('personaje3', "img/GoldenFrieza.png",64,20);
		juego.load.spritesheet('personaje4', "img/vegeta.png",56,26); // Nuevo personaje
	},

	create: function(){
		var self = this;

		// Botón de Goku
		var btnGoku = juego.add.button(juego.width / 2 - 135, juego.height / 2 - 20, 'personaje1', function(){
			personajeSeleccionado = 'personaje1';
			btnGoku.alpha = 1;
			btnGohan.alpha = 0.5;
			btnFrieza.alpha = 0.5;
			btnvegeta.alpha = 0.5;
		}, this, 1, 0, 2);
		btnGoku.anchor.setTo(0.5);
		btnGoku.alpha = 1;

		// Botón de Gohan
		var btnGohan = juego.add.button(juego.width / 2 - 45, juego.height / 2 - 20, 'personaje2', function(){
			personajeSeleccionado = 'personaje2';
			btnGoku.alpha = 0.5;
			btnGohan.alpha = 1;
			btnFrieza.alpha = 0.5;
			btnvegeta.alpha = 0.5;
		}, this, 1, 0, 2);
		btnGohan.anchor.setTo(0.5);
		btnGohan.alpha = 0.5;

		// Botón de Frieza 
		var btnFrieza = juego.add.button(juego.width / 2 + 45, juego.height / 2 - 20, 'personaje3', function(){
			personajeSeleccionado = 'personaje3';
			btnGoku.alpha = 0.5;
			btnGohan.alpha = 0.5;
			btnFrieza.alpha = 1;
			btnvegeta.alpha = 0.5;
		}, this, 1, 0, 2);
		btnFrieza.anchor.setTo(0.5);
		btnFrieza.alpha = 0.5;

		// Botón de vegeta
		var btnvegeta = juego.add.button(juego.width / 2 + 135, juego.height / 2 - 20, 'personaje4', function(){
			personajeSeleccionado = 'personaje4';
			btnGoku.alpha = 0.5;
			btnGohan.alpha = 0.5;
			btnFrieza.alpha = 0.5;
			btnvegeta.alpha = 1;
		}, this, 1, 0, 2);
		btnvegeta.anchor.setTo(0.5);
		btnvegeta.alpha = 0.5;

		var txtSelecciona = juego.add.text(juego.width/2, juego.height/2-120, "Selecciona tu personaje", {font: "bold 18px sans-serif", fill:"black", align: "center"});
		txtSelecciona.anchor.setTo(0.5);

		var boton = this.add.button(juego.width/2, juego.height/2+122, 'boton', this.iniciarJuego, this);
		boton.anchor.setTo(0.5);

		var txtIniciar = juego.add.text(juego.width/2, juego.height/2+50, "Iniciar juego", {font: "bold 24px sans-serif", fill:"black", align: "center"});
		txtIniciar.anchor.setTo(0.5);

		var txtTitulo = juego.add.text(juego.width/2, juego.height/2-125, "", {font: "bold 28px sans-serif", fill:"black", align: "center"});
		txtTitulo.anchor.setTo(0.5);
	},

	iniciarJuego: function(){
		this.state.start('Juego');
	}
};