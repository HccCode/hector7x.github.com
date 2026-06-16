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
let emitterSalto;      // NUEVO: Emisor para el humo al saltar
let grupoLineas;       // NUEVO: Grupo para las líneas de velocidad
let grupoEstrellasNoche; // NUEVO: Grupo para el cielo nocturno
let sonidoSalto;      
let sonidoEstrella;  
let sonidoFondo;      

let personajeSeleccionado = 'personaje1'; 

const coloresAura = {
    'personaje1': 0xFFFF00, // Goku: Amarillo
    'personaje2': 0xFFFFFF, // Gohan: Blanco
    'personaje3': 0xAA00FF, // Freezer: Morado
    'personaje4': 0x0088FF  // Vegeta: Azul
};

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

        juego.camera.flash(0x000000, 600);

		bg = juego.add.tileSprite(0, 0, 370, 550, 'bg');
        bg.tint = 0xFFFFFF; // Día

        // NUEVO: Capa de estrellas nocturnas (Detrás del suelo y los tubos)
        grupoEstrellasNoche = juego.add.group();

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
		
        // NUEVO: Generación de Líneas de Velocidad (Viento anime)
        const bmdLinea = juego.add.bitmapData(80, 2);
        bmdLinea.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        bmdLinea.ctx.fillRect(0, 0, 80, 2);
        juego.cache.addImage('imgLinea', null, bmdLinea.canvas);
        
        grupoLineas = juego.add.group();
        grupoLineas.enableBody = true;

		tubos = juego.add.group();
		tubos.enableBody = true;
		tubos.createMultiple(20, 'tubo'); 

		estrellas = juego.add.group();
		estrellas.enableBody = true;
		estrellas.createMultiple(5, '4star');

		const colorSeleccionado = coloresAura[personajeSeleccionado] || 0xFFFF00;

        // Partículas del Aura de Ki
		const bmdAura = juego.add.bitmapData(12, 12);
		bmdAura.ctx.fillStyle = '#FFFFFF';
		bmdAura.ctx.beginPath();
		bmdAura.ctx.arc(6, 6, 6, 0, Math.PI * 2);
		bmdAura.ctx.fill();
		juego.cache.addImage('imgAura', null, bmdAura.canvas);

		emitterAura = juego.add.emitter(0, 0, 50);
		emitterAura.makeParticles('imgAura'); 
		emitterAura.forEach(p => p.tint = colorSeleccionado); 
		emitterAura.setXSpeed(-100, -50); 
		emitterAura.setYSpeed(-20, 20);
		emitterAura.setAlpha(0.6, 0, 400); 
		emitterAura.setScale(0.8, 0, 0.2, 0, 400); 
		emitterAura.start(false, 400, 50); 

        // NUEVO: Partículas para el Polvo al Saltar
        emitterSalto = juego.add.emitter(0, 0, 30);
        emitterSalto.makeParticles('imgAura'); // Reciclamos la imagen del aura redonda
        emitterSalto.forEach(p => p.tint = 0xDDDDDD); // Color humo gris claro
        emitterSalto.setXSpeed(-120, -50); // Sale empujado hacia atrás
        emitterSalto.setYSpeed(50, 150);   // Cae hacia abajo al saltar
        emitterSalto.setAlpha(0.8, 0, 500); 
        emitterSalto.setScale(0.8, 0, 0.8, 0, 500); 

		flappy = juego.add.sprite(100, 245, personajeSeleccionado);
		flappy.frame = 1;
		flappy.anchor.setTo(0.5, 0.5); 
		flappy.animations.add('vuelo', [2,1,0], 10, true);

		juego.physics.arcade.enable(flappy);
		flappy.body.gravity.y = 1200;

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
        txtPuntos.anchor.setTo(0, 0.5); 

		estrellasObtenidas = 0;
		imgEstrella = juego.add.sprite(juego.width - 70, 20, '4star');
		imgEstrella.width = 32;
		imgEstrella.height = 32;
		imgEstrella.fixedToCamera = true;
		
		txtEstrellas = juego.add.text(juego.width - 30, 37, "0", estiloMarcador);
		txtEstrellas.anchor.setTo(0, 0.5);
		txtEstrellas.fixedToCamera = true;
	},

	update() {
		emitterAura.x = flappy.x - 20;
		emitterAura.y = flappy.y;

		if (!flappy.inWorld) {
			this.state.start('Game_Over');
		} else if (flappy.position.y > 460) {
			this.tocoTubo(); 
		} else if (flappy.alive) {
			bg.tilePosition.x -= 1;   
			suelo.tilePosition.x -= 4;  

            // NUEVO: Spawneo aleatorio de Líneas de Velocidad (Viento Anime)
            if (Math.random() < 0.15) { // 15% de probabilidad por fotograma
                let linea = grupoLineas.getFirstDead();
                const yRandom = Math.random() * 450;
                if (!linea) {
                    linea = grupoLineas.create(400, yRandom, 'imgLinea');
                } else {
                    linea.reset(400, yRandom);
                }
                linea.body.velocity.x = -600; // Pasan extremadamente rápido
                linea.checkWorldBounds = true;
                linea.outOfBoundsKill = true;
            }
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
		
		flappy.body.velocity.y = -350;
		juego.add.tween(flappy).to({angle:-20}, 100).start();

        // NUEVO: Explosión de humo en los pies al saltar
        emitterSalto.x = flappy.x - 10;
        emitterSalto.y = flappy.y + 15;
        emitterSalto.start(true, 500, null, 6); // 6 partículas por salto

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

        if (puntos > 0) {
            juego.add.tween(txtPuntos.scale).from({x: 1.5, y: 1.5}, 200, Phaser.Easing.Bounce.Out, true);
        }

        if (puntos === 10) {
            this.mostrarMensajeEpico("¡IMPARABLE!");
            juego.add.tween(bg).to({tint: 0xFF8C00}, 3000, Phaser.Easing.Linear.None, true);
        }

        // NUEVO: Creación de Estrellas de fondo al hacerse de Noche
        if (puntos === 25) {
            this.mostrarMensajeEpico("¡NIVEL DIOS!");
            juego.add.tween(bg).to({tint: 0x1A0B2E}, 3000, Phaser.Easing.Linear.None, true); // Azul muy oscuro
            
            // Generamos 35 estrellitas que parpadearán infinitamente
            for (let i = 0; i < 35; i++) {
                let x = Math.random() * 370;
                let y = Math.random() * 450; // Para que no aparezcan en el suelo
                let estrellaFondo = juego.add.sprite(x, y, 'imgAura');
                estrellaFondo.tint = 0xFFFFFF;
                estrellaFondo.alpha = 0; // Empiezan invisibles
                estrellaFondo.scale.setTo(Math.random() * 0.4 + 0.1); // Tamaños variados
                grupoEstrellasNoche.add(estrellaFondo);
                
                // Efecto Tween de parpadeo suave asincrónico
                juego.add.tween(estrellaFondo).to(
                    {alpha: Math.random() * 0.8 + 0.2}, 
                    2000 + Math.random() * 2000, 
                    Phaser.Easing.Sinusoidal.InOut, 
                    true, 
                    3000, // Esperan 3 segundos para que termine el atardecer antes de aparecer
                    -1, 
                    true
                );
            }
        }

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
            estrella.anchor.setTo(0.5, 0.5); // Centrar anclaje para rotación correcta
			estrella.body.velocity.x = -180; 
            
            // NUEVO: Rotación constante y brillante para la esfera
            estrella.body.angularVelocity = 120; // Gira sobre sí misma en el aire
            
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

    mostrarMensajeEpico(texto) {
        let txtEpico = juego.add.text(juego.width/2, juego.height/2, texto, {font: "40px Impact", fill: "#FFD700", stroke: "#000", strokeThickness: 6, align: "center"});
        txtEpico.anchor.setTo(0.5);
        txtEpico.alpha = 0;
        
        juego.add.tween(txtEpico.scale).from({x: 0, y: 0}, 500, Phaser.Easing.Bounce.Out, true);
        juego.add.tween(txtEpico).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true, 0, 0, false).onComplete.add(() => {
            juego.add.tween(txtEpico).to({alpha: 0, y: txtEpico.y - 50}, 1000, Phaser.Easing.Linear.None, true, 1000).onComplete.add(() => txtEpico.kill());
        });
    },

	tomarEstrella(flappy, estrella) {
        let txtPlus = juego.add.text(estrella.x, estrella.y - 20, "+1", {font: "24px Impact", fill: "#FFD700", stroke: "#000", strokeThickness: 4});
        juego.add.tween(txtPlus).to({y: txtPlus.y - 50, alpha: 0}, 800, Phaser.Easing.Cubic.Out, true).onComplete.add(() => txtPlus.kill());

		emitterEstrellas.x = estrella.x;
		emitterEstrellas.y = estrella.y;
		emitterEstrellas.start(true, 800, null, 12);

		estrella.kill(); 
		estrellasObtenidas += 1;
		txtEstrellas.text = estrellasObtenidas;
        
        juego.add.tween(txtEstrellas.scale).from({x: 1.5, y: 1.5}, 200, Phaser.Easing.Bounce.Out, true);
		
		if (sonidoEstrella) sonidoEstrella.play();

		if (estrellasObtenidas >= 7) {
			juego.ganaste = true;
            
            flappy.alive = false;
            emitterAura.on = false; 
            grupoLineas.setAll('body.velocity.x', 0); // Detener el viento
            juego.time.events.remove(timer);
            tubos.forEachAlive(t => t.body.velocity.x = 0);
            estrellas.forEachAlive(e => e.body.velocity.x = 0);
            
            flappy.body.gravity.y = 0; 
            flappy.body.velocity.y = -50; 
            flappy.tint = 0xFFD700; 
            flappy.angle = 0; // Enderezar al personaje para su ascensión divina

            if (sonidoFondo && sonidoFondo.isPlaying) sonidoFondo.stop();

            juego.camera.flash(0xFFFFFF, 500); 
            juego.camera.fade(0x000000, 1500); 

            this.guardarRecord();

            juego.time.events.add(1500, () => {
                this.state.start('Game_Over');
            }, this);
		}
	},

	tocoTubo() {
		if (!flappy.alive) return;
		
		flappy.alive = false;
		emitterAura.on = false; 
        grupoLineas.setAll('body.velocity.x', 0); // Detener el viento
		juego.time.events.remove(timer);
		
		tubos.forEachAlive(t => t.body.velocity.x = 0);
		estrellas.forEachAlive(e => e.body.velocity.x = 0);
        estrellas.forEachAlive(e => e.body.angularVelocity = 0); // Detener rotación de las esferas

		flappy.body.gravity.y = 99999;    
        
        flappy.body.angularVelocity = 800; 
        flappy.tint = 0xFF0000; 

		if (sonidoFondo && sonidoFondo.isPlaying) sonidoFondo.stop();

		juego.camera.flash(0xFF0000, 300); 
		juego.camera.shake(0.02, 300);     
        juego.camera.fade(0x000000, 1200); 

		this.guardarRecord();

		juego.time.events.add(1200, () => {
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