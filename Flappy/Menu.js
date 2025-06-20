var Menu = {

	preload: function () {
		juego.stage.backgroundColor = "#FFF";
		juego.load.image('boton',"img/btn.png");
		juego.load.spritesheet('personaje1',"img/goku.png",50,30);
		juego.load.spritesheet('personaje2',"img/gohan.png",49,29);
	},

	create: function(){
		var self = this;

		// Botón de Goku
		var btnGoku = juego.add.button(juego.width / 2 - 60, juego.height / 2 - 20, 'personaje1', function(){
			personajeSeleccionado = 'personaje1';
			btnGoku.alpha = 1;
			btnVegeta.alpha = 0.5;
		}, this, 1, 0, 2);
		btnGoku.anchor.setTo(0.5);
		btnGoku.alpha = 1;

		// Botón de Vegeta
		var btnVegeta = juego.add.button(juego.width / 2 + 60, juego.height / 2 - 20, 'personaje2', function(){
			personajeSeleccionado = 'personaje2';
			btnGoku.alpha = 0.5;
			btnVegeta.alpha = 1;
		}, this, 1, 0, 2);
		btnVegeta.anchor.setTo(0.5);
		btnVegeta.alpha = 0.5;

		var txtSelecciona = juego.add.text(juego.width/2, juego.height/2-70, "Selecciona tu personaje", {font: "bold 18px sans-serif", fill:"black", align: "center"});
		txtSelecciona.anchor.setTo(0.5);

		var boton = this.add.button(juego.width/2, juego.height/2+102, 'boton', this.iniciarJuego, this);
		boton.anchor.setTo(0.5);

		var txtIniciar = juego.add.text(juego.width/2, juego.height/2+30, "Iniciar juego", {font: "bold 24px sans-serif", fill:"black", align: "center"});
		txtIniciar.anchor.setTo(0.5);

		var txtTitulo = juego.add.text(juego.width/2, juego.height/2-125, "", {font: "bold 28px sans-serif", fill:"black", align: "center"});
		txtTitulo.anchor.setTo(0.5);
	},

	iniciarJuego: function(){
		this.state.start('Juego');
	}
};