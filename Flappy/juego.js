let bg;
let suelo; // Variable para el suelo con paralaje
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
let emitterEstrellas; // Variable para el sistema de partículas
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
		juego.renderer.renderSession.roundPixels = true;
		// 1. FONDO LEJANO (Se moverá lento)
		bg = juego.add.tileSprite(0, 0, 370, 550, 'bg');

		// 2. CREACIÓN DEL SUELO PARA EFECTO PARALAJE
		// Generamos una textura programática para no tener que añadir imágenes nuevas
		const bmd = juego.add.bitmapData(370, 90);
		bmd.ctx.fillStyle = '#5A3A22'; // Color tierra
		bmd.ctx.fillRect(0, 0, 370, 90);
		bmd.ctx.fillStyle = '#4CAF50'; // Color pasto verde superior
		bmd.ctx.fillRect(0, 0, 370, 15);
		
		// Añadimos textura al suelo para que se note el movimiento
		for (let i = 0; i < 60; i++) {
			bmd.ctx.fillStyle = '#3E2723';
			bmd.ctx.fillRect(Math.random() * 370, 15 + Math.random() * 75, 4, 4);
		}
		
		// Añadimos el suelo en la posición Y=460 (justo donde el jugador pierde si toca)
		suelo = juego.add.tileSprite(0, 460, 370, 90, bmd);

		juego.physics.startSystem(Phaser.Physics.ARCADE);
		
		tubos = juego.add.group();
		tubos.enableBody = true;
		tubos.createMultiple(20, 'tubo');

		estrellas = juego.add.group();
		estrellas.enableBody = true;
		estrellas.createMultiple(5, '4star');

		flappy = juego.add.sprite(100, 245, personajeSeleccionado);
		flappy.frame = 1;
		flappy.anchor.setTo(0, 0.5);
		flappy.animations.add('vuelo', [2,1,0], 10, true);

		juego.physics.arcade.enable(flappy);
		flappy.body.gravity.y = 1200;

		// 3. SISTEMA DE PARTÍCULAS (Explosión de estrellas)
		emitterEstrellas = juego.add.emitter(0, 0, 50); // Pool de 50 partículas
		emitterEstrellas.makeParticles('4star');
		emitterEstrellas.gravity = 400; // Caen hacia abajo
		// Escala de las partículas: Inician al 30% de su tamaño y se encogen al 0% a los 800ms
		emitterEstrellas.setScale(0.3, 0, 0.3, 0, 800); 
		// Velocidad aleatoria en la explosión
		emitterEstrellas.setXSpeed(-150, 150);
		emitterEstrellas.setYSpeed(-150, 150);

		// Sonidos
		sonidoSalto = juego.add.audio('salto');
		sonidoEstrella = juego.add.audio('estrella');
		
		if (!sonidoFondo) {
			sonidoFondo = juego.add.audio('fondo');
		}
		if (!sonidoFondo.isPlaying) {
			sonidoFondo.loopFull(0.1); 
		}

		salto = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		salto.onDown.add(this.saltar, this);
		juego.input.onDown.add(this.saltar, this);

		timer = juego.time.events.loop(1500, this.crearColumna, this);

		puntos = -1;
		txtPuntos = juego.add.text(20, 20, "0", {font: "30px Arial", fill: "#FFF"});

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
			tubos.forEachAlive(t => t.body.velocity.x = 0);
			this.state.start('Game_Over');
		} else {
			// MOVIMIENTO PARALAJE
			// MOVIMIENTO PARALAJE (Sin decimales)
			bg.tilePosition.x -= 1;   // Volvemos a 1 para evitar el temblor de sub-píxeles
			suelo.tilePosition.x -= 4; // Aumentamos la velocidad del suelo para mantener la diferencia visual
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
		// Posicionar el emisor justo donde estaba la estrella que tocamos
		emitterEstrellas.x = estrella.x + (estrella.width / 2);
		emitterEstrellas.y = estrella.y + (estrella.height / 2);
		
		// Iniciar la explosión: true(explota), 800ms de vida, nulo, cantidad de partículas(12)
		emitterEstrellas.start(true, 800, null, 12);

		estrella.kill(); // Desaparece la estrella original
		
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