let bg;
let suelo; 
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
let emitterEstrellas; 
let emitterAura; 
let sonidoSalto;      
let sonidoEstrella;  
let sonidoFondo;      

let personajeSeleccionado = 'personaje1'; 

// Mantenemos la configuración estética y de hitboxes precisas para conservar las mejoras gráficas
const configPersonajes = {
    'personaje1': { auraColor: 0xFFFF00, hitboxW: 24, hitboxH: 20, offsetX: 12, offsetY: 5 }, // Goku: Aura Amarilla
    'personaje2': { auraColor: 0xFFFFFF, hitboxW: 24, hitboxH: 20, offsetX: 12, offsetY: 5 }, // Gohan: Aura Blanca
    'personaje3': { auraColor: 0xAA00FF, hitboxW: 30, hitboxH: 14, offsetX: 16, offsetY: 3 }, // Freezer: Aura Morada
    'personaje4': { auraColor: 0x0088FF, hitboxW: 28, hitboxH: 20, offsetX: 14, offsetY: 3 }  // Vegeta: Aura Azul
};

const Juego = {

	preload() {
		juego.load.image('bg',"img/bg2.jpeg");
		juego.load.spritesheet('personaje1',"img/goku.png",50,30);
		juego.load.spritesheet('personaje2',"img/gohan.png",50,30);
		juego.load.spritesheet('personaje3',"img/GoldenFrieza.png",64,20); 
		juego.load.spritesheet('personaje4',"img/vegeta.png",56,26);
		
		// Usamos el archivo de textura original compatible
		juego.load.image('tubo',"img/pile.png");
		
		juego.load.image('4star', "img/4star.png"); 
		juego.load.audio('salto', 'sound/jump.wav');
		juego.load.audio('estrella', 'sound/star.wav'); 
		juego.load.audio('fondo', 'sound/ambiente.ogg'); 

		juego.forceSingleUpdate = true;
	},

	create() {
		// Evita el parpadeo y temblor visual del sub-renderizado
		juego.renderer.renderSession.roundPixels = true;

		bg = juego.add.tileSprite(0, 0, 370, 550, 'bg');

		const bmd = juego.add.bitmapData(370, 90);
		bmd.ctx.fillStyle = '#5A3A22';
		bmd.ctx.fillRect(0, 0, 370, 90);
		bmd.ctx.fillStyle = '#4CAF50'; 
		bmd.ctx.fillRect(0, 0, 370, 15);
		for (let i = 0; i < 60; i++) {
			bmd.ctx.fillStyle = '#3E2723';
			bmd.ctx.fillRect(Math.random() * 370, 15 + Math.random() * 75, 4, 4);
		}
		suelo = juego.add.tileSprite(0, 460, 370, 90, bmd);

		juego.physics.startSystem(Phaser.Physics.ARCADE);
		
		tubos = juego.add.group();
		tubos.enableBody = true;
		tubos.createMultiple(20, 'tubo'); 

		estrellas = juego.add.group();
		estrellas.enableBody = true;
		estrellas.createMultiple(5, '4star');

		const config = configPersonajes[personajeSeleccionado];

		// Generación de partículas para el Aura de Ki
		const bmdAura = juego.add.bitmapData(12, 12);
		bmdAura.ctx.fillStyle = '#FFFFFF';
		bmdAura.ctx.beginPath();
		bmdAura.ctx.arc(6, 6, 6, 0, Math.PI * 2);
		bmdAura.ctx.fill();
		juego.cache.addImage('imgAura', null, bmdAura.canvas);

		emitterAura = juego.add.emitter(0, 0, 50);
		emitterAura.makeParticles('imgAura'); 
		emitterAura.forEach(p => p.tint = config.auraColor); // Tinte según el personaje seleccionado
		emitterAura.setXSpeed(-100, -50); 
		emitterAura.setYSpeed(-20, 20);
		emitterAura.setAlpha(0.6, 0, 400); 
		emitterAura.setScale(0.8, 0, 0.2, 0, 400); 
		emitterAura.start(false, 400, 50); 

		flappy = juego.add.sprite(100, 245, personajeSeleccionado);
		flappy.frame = 1;
		flappy.anchor.setTo(0, 0.5);
		flappy.animations.add('vuelo', [2,1,0], 10, true);

		juego.physics.arcade.enable(flappy);
		
		// --- REGRESO A LA CONFIGURACIÓN DE GRAVEDAD DEFAULT DEL INICIO ---
		flappy.body.gravity.y = 1200;
		
		// Ajustamos las hitboxes para que las colisiones sigan siendo ultra precisas y justas
		flappy.body.setSize(config.hitboxW, config.hitboxH, config.offsetX, config.offsetY);

		emitterEstrellas = juego.add.emitter(0, 0, 50); 
		emitterEstrellas.makeParticles('4star');
		emitterEstrellas.gravity = 400; 
		emitterEstrellas.setScale(0.3, 0, 0.3, 0, 800); 
		emitterEstrellas.setXSpeed(-150, 150);
		emitterEstrellas.setYSpeed(-150, 150);

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
		const estiloMarcador = {font: "34px Impact", fill: "#FFF", stroke: "#000", strokeThickness: 5};
		txtPuntos = juego.add.text(20, 20, "0", estiloMarcador);

		estrellasObtenidas = 0;
		imgEstrella = juego.add.sprite(juego.width - 70, 20, '4star');
		imgEstrella.width = 32;
		imgEstrella.height = 32;
		imgEstrella.fixedToCamera = true;
		
		txtEstrellas = juego.add.text(juego.width - 30, 20, "0", estiloMarcador);
		txtEstrellas.anchor.setTo(0, 0);
		txtEstrellas.fixedToCamera = true;
	},

	update() {
		emitterAura.x = flappy.x - 10;
		emitterAura.y = flappy.y;

		if (!flappy.inWorld) {
			this.state.start('Game_Over');
		} else if (flappy.position.y > 460) {
			this.tocoTubo(); 
		} else if (flappy.alive) {
			bg.tilePosition.x -= 1;   
			suelo.tilePosition.x -= 4;  
		}

		juego.physics.arcade.overlap(flappy, tubos, this.tocoTubo, null, this);
		juego.physics.arcade.overlap(flappy, estrellas, this.tomarEstrella, null, this);

		if (flappy.alive) {
			flappy.animations.play('vuelo');
			if (flappy.angle < 20) {
				flappy.angle += 1;        
			}
		}
	},
	
	saltar() {
		if (!flappy.alive) return;
		
		// --- REGRESO AL IMPULSO DE SALTO DEFAULT DEL INICIO ---
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
		if (tubo) {
			tubo.reset(x, y);
			tubo.body.velocity.x = -180;
			tubo.checkWorldBounds = true;
			tubo.outOfBoundsKill = true;
		}
	},

	tomarEstrella(flappy, estrella) {
		emitterEstrellas.x = estrella.x + (estrella.width / 2);
		emitterEstrellas.y = estrella.y + (estrella.height / 2);
		emitterEstrellas.start(true, 800, null, 12);

		estrella.kill(); 
		estrellasObtenidas += 1;
		txtEstrellas.text = estrellasObtenidas;
		
		if (sonidoEstrella) sonidoEstrella.play();

		if (estrellasObtenidas >= 7) {
			juego.ganaste = true;
			this.tocoTubo(); 
		}
	},

	tocoTubo() {
		if (!flappy.alive) return;
		
		flappy.alive = false;
		emitterAura.on = false; 
		juego.time.events.remove(timer);
		
		tubos.forEachAlive(t => t.body.velocity.x = 0);
		estrellas.forEachAlive(e => e.body.velocity.x = 0);

		flappy.body.gravity.y = 99999;    

		if (sonidoFondo && sonidoFondo.isPlaying) sonidoFondo.stop();

		juego.camera.flash(0xffffff, 300); 
		juego.camera.shake(0.02, 300);     

		this.guardarRecord();

		juego.time.events.add(500, () => {
			this.state.start('Game_Over');
		}, this);
	},

	guardarRecord() {
		const recordPuntos = Number(localStorage.getItem('recordPuntos')) || 0;
		if (puntos > recordPuntos) localStorage.setItem('recordPuntos', puntos);
		
		const recordEstrellas = Number(localStorage.getItem('recordEstrellas')) || 0;
		if (estrellasObtenidas > recordEstrellas) localStorage.setItem('recordEstrellas', estrellasObtenidas);
	}
};