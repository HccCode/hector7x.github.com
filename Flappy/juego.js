let bg;
let tubos;
let flappy;
let salto;
let timer;
let puntos;
let txtPuntos;
let estrellas;
let estrellasObtenidas;
let txtEstrellas;
let imgEstrella;
let sonidoSalto;      
let sonidoEstrella;  
let sonidoFondo;      

let personajeSeleccionado = 'personaje1'; 

const Juego = {

	preload() {
		juego.load.image('bg',"img/bg2.jpeg");
		juego.load.spritesheet('personaje1',"img/goku.png",50,30);
		juego.load.spritesheet('personaje2',"img/gohan.png",50,30);
		juego.load.spritesheet('personaje3',"img/GoldenFrieza.png",64,20); 
		juego.load.spritesheet('personaje4',"img/vegeta.png",56,26);
		juego.load.image('tubo',"img/pile.png");
		juego.load.image('4star', "img/4star.png"); 
		juego.load.audio('salto', 'sound/jump.wav');
		juego.load.audio('estrella', 'sound/star.wav'); 
		juego.load.audio('fondo', 'sound/ambiente.ogg'); 

		juego.forceSingleUpdate = true;
	},

	create() {
		bg = juego.add.tileSprite(0,0,370,550,'bg');
		juego.physics.startSystem(Phaser.Physics.ARCADE);
		
		tubos = juego.add.group();
		tubos.enableBody = true;
		tubos.createMultiple(20,'tubo');

		estrellas = juego.add.group();
		estrellas.enableBody = true;
		estrellas.createMultiple(5, '4star'); // Pool de estrellas optimizado

		flappy = juego.add.sprite(100, 245, personajeSeleccionado);
		flappy.frame = 1;
		flappy.anchor.setTo(0, 0.5);
		flappy.animations.add('vuelo',[2,1,0],10,true);

		juego.physics.arcade.enable(flappy);
		flappy.body.gravity.y = 1200;

		// Sonidos
		sonidoSalto = juego.add.audio('salto');
		sonidoEstrella = juego.add.audio('estrella');
		
		// Manejo seguro del sonido de fondo
		if (!sonidoFondo) {
			sonidoFondo = juego.add.audio('fondo');
		}
		if (!sonidoFondo.isPlaying) {
			sonidoFondo.loopFull(0.1); 
		}

		// Controles
		salto = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		salto.onDown.add(this.saltar, this);
		juego.input.onDown.add(this.saltar, this);

		timer = juego.time.events.loop(1500, this.crearColumna, this);

		puntos = -1;
		txtPuntos = juego.add.text(20, 20, "0", {font: "30px Arial", fill: "#FFF"});

		// UI Estrellas
		estrellasObtenidas = 0;
		imgEstrella = juego.add.sprite(juego.width - 70, 20, '4star');
		imgEstrella.width = 32;
		imgEstrella.height = 32;
		imgEstrella.fixedToCamera = true;
		
		txtEstrellas = juego.add.text(juego.width - 30, 25, "0", {font: "30px Arial", fill: "#FFF"});
		txtEstrellas.anchor.setTo(0, 0);
		txtEstrellas.fixedToCamera = true;
	},

	update() {
		if (!flappy.inWorld) {
			this.state.start('Game_Over');
		} else if (flappy.position.y > 460) {
			flappy.alive = false;
			tubos.forEachAlive(t => t.body.velocity.x = 0); // Función flecha
			this.state.start('Game_Over');
		} else {
			bg.tilePosition.x -= 1; 
		}

		juego.physics.arcade.overlap(flappy, tubos, this.tocoTubo, null, this);
		juego.physics.arcade.overlap(flappy, estrellas, this.tomarEstrella, null, this);

		flappy.animations.play('vuelo');
		if (flappy.angle < 20) {
			flappy.angle += 1;        
		}
	},
	
	saltar() {
		flappy.body.velocity.y = -350;
		juego.add.tween(flappy).to({angle:-20}, 100).start();
		if (sonidoSalto) sonidoSalto.play();
	},
	
	crearColumna() {
		const hueco = Math.floor(Math.random()*5)+1;
		for(let i = 0; i < 8; i++) {
			if(i !== hueco && i !== hueco+1) {
				this.crearUnTubo(371, i*57.5);
			}
		}
		
		puntos += 1;
		txtPuntos.text = puntos;

		// Creación optimizada de estrellas (Reciclaje)
		if (puntos > 0 && puntos % 22 === 0) {
			const yEstrella = (hueco + 0.5) * 57.5;
			let estrella = estrellas.getFirstDead();
			
			if (!estrella) {
				estrella = estrellas.create(371, yEstrella, '4star');
			} else {
				estrella.reset(371, yEstrella);
			}
			
			estrella.width = 32;
			estrella.height = 32;
			estrella.body.velocity.x = -180;
			estrella.checkWorldBounds = true;
			estrella.outOfBoundsKill = true;
		}
	}, 
	
	crearUnTubo(x, y) {
		const tubo = tubos.getFirstDead();
		tubo.reset(x, y);
		tubo.body.velocity.x = -180;
		tubo.checkWorldBounds = true;
		tubo.outOfBoundsKill = true;
	},

	tomarEstrella(flappy, estrella) {
		estrella.kill();
		estrellasObtenidas += 1;
		txtEstrellas.text = estrellasObtenidas;
		if (sonidoEstrella) sonidoEstrella.play();

		if (estrellasObtenidas >= 7) {
			flappy.alive = false;
			juego.time.events.remove(timer);

			tubos.forEachAlive(t => t.body.velocity.x = 0);

			flappy.body.gravity.y = 99999;

			if (sonidoFondo && sonidoFondo.isPlaying) sonidoFondo.stop();

			juego.ganaste = true;
			this.guardarRecord();
			this.state.start('Game_Over');
		}
	},

	tocoTubo() {
		if (!flappy.alive) return;
		
		flappy.alive = false;
		juego.time.events.remove(timer);
		
		tubos.forEachAlive(t => t.body.velocity.x = 0);

		flappy.body.gravity.y = 99999;    

		if (sonidoFondo && sonidoFondo.isPlaying) sonidoFondo.stop();

		this.guardarRecord();
	},

	guardarRecord() {
		const recordPuntos = Number(localStorage.getItem('recordPuntos')) || 0;
		if (puntos > recordPuntos) {
			localStorage.setItem('recordPuntos', puntos);
		}
		
		const recordEstrellas = Number(localStorage.getItem('recordEstrellas')) || 0;
		if (estrellasObtenidas > recordEstrellas) {
			localStorage.setItem('recordEstrellas', estrellasObtenidas);
		}
	}
};