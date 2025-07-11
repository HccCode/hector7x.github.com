var bg;
var tubos;
var flappy;
var salto;
var timer;
var puntos;
var txtPuntos;
var estrellas;
var estrellasObtenidas;
var txtEstrellas;
var imgEstrella;

var personajeSeleccionado = 'personaje1'; // Valor por defecto

var Juego = {

	preload: function () {
		juego.load.image('bg',"img/bg2.jpeg");
		juego.load.spritesheet('personaje1',"img/goku.png",50,30);
		juego.load.spritesheet('personaje2',"img/gohan.png",50,30);
		juego.load.spritesheet('personaje3',"img/GoldenFrieza.png",64,20); 
		juego.load.spritesheet('personaje4',"img/vegeta.png",56,26); // Nuevo personaje
		juego.load.image('tubo',"img/pile.png");
		juego.load.image('4star', "img/4star.png"); 

		juego.forceSingleUpdate = true;
	},

	create: function(){
		bg = juego.add.tileSprite(0,0,370,550,'bg');
		juego.physics.startSystem(Phaser.Physics.ARCADE);
		tubos = juego.add.group();
		tubos.enableBody = true;
		tubos.createMultiple(20,'tubo');

		estrellas = juego.add.group();
		estrellas.enableBody = true;

		flappy = juego.add.sprite(100, 245, personajeSeleccionado);
		flappy.frame = 1;
		flappy.anchor.setTo(0, 0.5);
		flappy.animations.add('vuelo',[2,1,0],10,true);

		juego.physics.arcade.enable(flappy);
		flappy.body.gravity.y = 1200;

		// Soporte teclado
		salto = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		salto.onDown.add(this.saltar, this);

		// Soporte t�ctil (m�viles y tablets)
		juego.input.onDown.add(this.saltar, this);

		timer = juego.time.events.loop(1500, this.crearColumna, this);

		puntos = -1;
		txtPuntos = juego.add.text(20, 20, "0", {font: "30px Arial", fill: "#FFF"});

		// Contador de estrellas en la esquina superior derecha
		estrellasObtenidas = 0;
		imgEstrella = juego.add.sprite(juego.width - 70, 20, '4star');
		imgEstrella.width = 32;
		imgEstrella.height = 32;
		imgEstrella.fixedToCamera = true;
		txtEstrellas = juego.add.text(juego.width - 30, 25, "0", {font: "30px Arial", fill: "#FFF"});
		txtEstrellas.anchor.setTo(0, 0);
		txtEstrellas.fixedToCamera = true;
	},

	update: function(){

		if(flappy.inWorld == false)
		{
			this.state.start('Game_Over');
		}
		else if(flappy.position.y >460)
		{
			flappy.alive = false;
			tubos.forEachAlive(function(t){
				t.body.velocity.x = 0;
			}, this);

			this.state.start('Game_Over');
		}
		else
		{
			bg.tilePosition.x -= 1; 
		}

		juego.physics.arcade.overlap(flappy, tubos, this.tocoTubo, null, this);
		juego.physics.arcade.overlap(flappy, estrellas, this.tomarEstrella, null, this);

		flappy.animations.play('vuelo');
		if(flappy.angle <20)
		{
			flappy.angle += 1;        
		}
	},
	
	saltar: function(){
		flappy.body.velocity.y = -350;
		juego.add.tween(flappy).to({angle:-20}, 100).start();
	},
	
	crearColumna: function(){
		var hueco = Math.floor(Math.random()*5)+1;
		for( var i = 0; i < 8; i++)
		{
			if(i != hueco && i != hueco+1)
			{
				this.crearUnTubo(371, i*57.5+0);
			}
		}
		
		puntos +=1;
		txtPuntos.text = puntos;

		// Cada 22 tubos, crea una estrella en el centro del hueco
		if (puntos > 0 && puntos % 22 === 0) {
			var yEstrella = (hueco + 0.5) * 57.5;
			var estrella = estrellas.create(371, yEstrella, '4star');
			estrella.width = 32;
			estrella.height = 32;
			estrella.body.velocity.x = -180;
			estrella.checkWorldBounds = true;
			estrella.outOfBoundsKill = true;
		}
	}, 
	
	crearUnTubo: function(x, y){
		var tubo = tubos.getFirstDead();
		
		tubo.reset(x, y);
		tubo.body.velocity.x = -180;
		tubo.checkWorldBounds = true;
		tubo.outOfBoundsKill = true;
	},

	tomarEstrella: function(flappy, estrella) {
		estrella.kill();
		estrellasObtenidas += 1;
		txtEstrellas.text = estrellasObtenidas;

		if (estrellasObtenidas >= 7) {
			flappy.alive = false;
			juego.time.events.remove(timer);

			tubos.forEachAlive(function(t){
				t.body.velocity.x = 0;
			}, this);

			flappy.body.gravity.y = 99999;

			// Guardar bandera de victoria
			juego.ganaste = true;

			// Guardar r�cords
			this.guardarRecord();

			this.state.start('Game_Over');
		}
	},
	
	tocoTubo: function(){
		if(flappy.alive == false)
			return;
		flappy.alive = false;
		juego.time.events.remove(timer);
		
		tubos.forEachAlive(function(t){
			t.body.velocity.x = 0;
		}, this);

		flappy.body.gravity.y = 99999;    

		// Guardar r�cords
		this.guardarRecord();
	},

	guardarRecord: function() {
		// Guardar r�cord de puntos
		var recordPuntos = localStorage.getItem('recordPuntos');
		if (recordPuntos === null || puntos > parseInt(recordPuntos)) {
			localStorage.setItem('recordPuntos', puntos);
		}
		// Guardar r�cord de estrellas
		var recordEstrellas = localStorage.getItem('recordEstrellas');
		if (recordEstrellas === null || estrellasObtenidas > parseInt(recordEstrellas)) {
			localStorage.setItem('recordEstrellas', estrellasObtenidas);
		}
	},
};