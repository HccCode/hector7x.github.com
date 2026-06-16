let bg;
let suelo; 
let grupoNubes;        
let tubos;
let flappy;
let salto;
let timer;
let puntos;
let txtPuntos;
let txtPreparate;      
let indicadorTap;      // NUEVO: Indicador visual de toque
let estrellas;
let estrellasObtenidas;
let txtEstrellas;
let imgEstrella;
let emitterEstrellas; 
let emitterAura; 
let emitterChoque;     
let grupoLineas;       
let grupoEstrellasNoche; 
let sonidoSalto;      
let sonidoEstrella;  
let sonidoFondo;      

let personajeSeleccionado = 'personaje1'; 
let juegoIniciado = false; 

const coloresAura = {
    'personaje1': 0xFFFF00, 
    'personaje2': 0xFFFFFF, 
    'personaje3': 0xAA00FF, 
    'personaje4': 0x0088FF  
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
        juegoIniciado = false; 
        juego.nuevoRecord = false; // Resetear la variable de récord
        juego.paused = false; // Asegurarnos de que el juego no inicie pausado

        juego.camera.flash(0x000000, 600);

		bg = juego.add.tileSprite(0, 0, 370, 550, 'bg');
        bg.tint = 0xFFFFFF; 

        grupoEstrellasNoche = juego.add.group();

        const bmdNube = juego.add.bitmapData(60, 30);
        bmdNube.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        bmdNube.ctx.beginPath();
        bmdNube.ctx.arc(20, 15, 15, 0, Math.PI * 2);
        bmdNube.ctx.arc(40, 15, 15, 0, Math.PI * 2);
        bmdNube.ctx.arc(30, 8, 15, 0, Math.PI * 2);
        bmdNube.ctx.fill();
        juego.cache.addImage('imgNube', null, bmdNube.canvas);

        grupoNubes = juego.add.group();
        for (let i = 0; i < 4; i++) {
            let nube = grupoNubes.create(Math.random() * 370, Math.random() * 250, 'imgNube');
            nube.scale.setTo(Math.random() * 0.5 + 0.5);
        }

		const bmdSuelo = juego.add.bitmapData(370, 90);
		bmdSuelo.ctx.fillStyle = '#5A3A22';
		bmdSuelo.ctx.fillRect(0, 0, 370, 90);
		bmdSuelo.ctx.fillStyle = '#4CAF50'; 
		bmdSuelo.ctx.fillRect(0, 0, 370, 15);
		for (let i = 0; i < 60; i++) {
			bmdSuelo.ctx.fillStyle = '#3E2723';
			bmdSuelo.ctx.fillRect(Math.random() * 370, 15 + Math.random() * 75, 4, 4);
		}
		suelo = juego.add.tileSprite(0, 460, 370, 90, bmdSuelo);

		juego.physics.startSystem(Phaser.Physics.ARCADE);
		
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

        const bmdEscombro = juego.add.bitmapData(8, 8);
        bmdEscombro.ctx.fillStyle = '#7CB342'; 
        bmdEscombro.ctx.fillRect(0, 0, 8, 8);
        juego.cache.addImage('imgEscombro', null, bmdEscombro.canvas);

        emitterChoque = juego.add.emitter(0, 0, 30);
        emitterChoque.makeParticles('imgEscombro');
        emitterChoque.gravity = 600;
        emitterChoque.setXSpeed(-200, 200);
        emitterChoque.setYSpeed(-300, 100);
        emitterChoque.setAlpha(1, 0, 1000);
        emitterChoque.bounce.setTo(0.5, 0.5); 

		flappy = juego.add.sprite(100, 245, personajeSeleccionado);
		flappy.frame = 1;
		flappy.anchor.setTo(0.5, 0.5); 
		flappy.animations.add('vuelo', [2,1,0], 10, true);

		juego.physics.arcade.enable(flappy);
        flappy.body.gravity.y = 0;

        this.tweenFlote = juego.add.tween(flappy).to({y: 235}, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

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
		
        // Lógica mejorada para saltos y reanudar pausa
        juego.input.onDown.add(() => {
            if (juego.paused) {
                juego.paused = false;
                if (this.cartelPausa) this.cartelPausa.destroy();
            } else {
                this.saltar();
            }
        }, this);

		puntos = 0; 
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

        txtPreparate = juego.add.text(juego.width/2, juego.height/2 + 30, "TOCA PARA VOLAR", {font: "28px Impact", fill: "#FFD700", stroke: "#000", strokeThickness: 5, align: "center"});
        txtPreparate.anchor.setTo(0.5);
        juego.add.tween(txtPreparate.scale).to({x: 1.1, y: 1.1}, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

        // INDICADOR VISUAL DE TOQUE (Tap Indicator)
        const bmdTap = juego.add.bitmapData(40, 40);
        bmdTap.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        bmdTap.ctx.beginPath();
        bmdTap.ctx.arc(20, 20, 20, 0, Math.PI * 2);
        bmdTap.ctx.fill();
        juego.cache.addImage('imgTap', null, bmdTap.canvas);

        indicadorTap = juego.add.sprite(juego.width/2, juego.height/2 + 80, 'imgTap');
        indicadorTap.anchor.setTo(0.5);
        juego.add.tween(indicadorTap.scale).to({x: 1.5, y: 1.5}, 600, Phaser.Easing.Linear.None, true, 0, -1);
        juego.add.tween(indicadorTap).to({alpha: 0}, 600, Phaser.Easing.Linear.None, true, 0, -1);

        // BOTÓN DE PAUSA
        const bmdPausa = juego.add.bitmapData(40, 40);
        bmdPausa.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; // Fondo semitransparente
        bmdPausa.ctx.fill();
        bmdPausa.ctx.fillStyle = '#FFFFFF'; // Barras blancas
        bmdPausa.ctx.fillRect(12, 10, 6, 20);
        bmdPausa.ctx.fillRect(22, 10, 6, 20);
        
        let btnPausa = juego.add.sprite(juego.width - 120, 17, bmdPausa);
        btnPausa.inputEnabled = true;
        btnPausa.events.onInputDown.add(() => {
            if (!juegoIniciado || !flappy.alive) return;
            juego.paused = true;
            this.cartelPausa = juego.add.text(juego.width/2, juego.height/2, "JUEGO PAUSADO\nToca la pantalla para continuar", {font: "28px Impact", fill: "#FFF", stroke: "#000", strokeThickness: 5, align: "center"});
            this.cartelPausa.anchor.setTo(0.5);
        }, this);
	},

	update() {
        bg.tilePosition.x -= 0.5;   
        suelo.tilePosition.x -= 4;  
        
        grupoNubes.forEachAlive(nube => {
            nube.x -= 1.5; 
            if (nube.x < -60) {
                nube.x = 400;
                nube.y = Math.random() * 250;
            }
        });

        if (!juegoIniciado) {
            flappy.animations.play('vuelo');
            return; 
        }

		emitterAura.x = flappy.x - 20;
		emitterAura.y = flappy.y;

		if (!flappy.inWorld) {
			this.state.start('Game_Over');
		} else if (flappy.position.y > 460) {
			this.tocoTubo(); 
		} else if (flappy.alive) {
            if (Math.random() < 0.15) { 
                let linea = grupoLineas.getFirstDead();
                const yRandom = Math.random() * 450;
                if (!linea) {
                    linea = grupoLineas.create(400, yRandom, 'imgLinea');
                } else {
                    linea.reset(400, yRandom);
                }
                linea.body.velocity.x = -600; 
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
        if (!flappy.alive || juego.paused) return;

        if (!juegoIniciado) {
            juegoIniciado = true;
            this.tweenFlote.stop(); 
            txtPreparate.kill(); 
            indicadorTap.kill(); // Destruimos la animación del Tap
            flappy.body.gravity.y = 1200; 
            timer = juego.time.events.loop(1500, this.crearColumna, this); 
            emitterAura.start(false, 400, 50); 
        }
		
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

        if (puntos > 0) {
            juego.add.tween(txtPuntos.scale).from({x: 1.5, y: 1.5}, 200, Phaser.Easing.Bounce.Out, true);
        }

        if (puntos === 10) {
            juego.add.tween(bg).to({tint: 0xFF8C00}, 3000, Phaser.Easing.Linear.None, true);
        }
        if (puntos === 25) {
            juego.add.tween(bg).to({tint: 0x1A0B2E}, 3000, Phaser.Easing.Linear.None, true); 
            
            for (let i = 0; i < 35; i++) {
                let x = Math.random() * 370;
                let y = Math.random() * 450; 
                let estrellaFondo = juego.add.sprite(x, y, 'imgAura');
                estrellaFondo.tint = 0xFFFFFF;
                estrellaFondo.alpha = 0; 
                estrellaFondo.scale.setTo(Math.random() * 0.4 + 0.1); 
                grupoEstrellasNoche.add(estrellaFondo);
                
                juego.add.tween(estrellaFondo).to(
                    {alpha: Math.random() * 0.8 + 0.2}, 
                    2000 + Math.random() * 2000, 
                    Phaser.Easing.Sinusoidal.InOut, 
                    true, 
                    3000, 
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
            estrella.anchor.setTo(0.5, 0.5); 
			estrella.body.velocity.x = -180; 
            estrella.body.angularVelocity = 120; 
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
            grupoLineas.setAll('body.velocity.x', 0); 
            juego.time.events.remove(timer);
            tubos.forEachAlive(t => t.body.velocity.x = 0);
            estrellas.forEachAlive(e => e.body.velocity.x = 0);
            
            flappy.body.gravity.y = 0; 
            flappy.body.velocity.y = -50; 
            flappy.tint = 0xFFD700; 
            flappy.angle = 0; 

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
        grupoLineas.setAll('body.velocity.x', 0); 
		juego.time.events.remove(timer);
		
		tubos.forEachAlive(t => t.body.velocity.x = 0);
		estrellas.forEachAlive(e => e.body.velocity.x = 0);
        estrellas.forEachAlive(e => e.body.angularVelocity = 0); 

		flappy.body.gravity.y = 99999;    
        
        flappy.body.angularVelocity = 800; 
        flappy.tint = 0xFF0000; 

        emitterChoque.x = flappy.x + 10;
        emitterChoque.y = flappy.y;
        emitterChoque.start(true, 1000, null, 15);

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
		if (puntos > recordPuntos) {
            localStorage.setItem('recordPuntos', puntos);
            juego.nuevoRecord = true; // Avisamos que hay un récord nuevo
        }
		
		const recordEstrellas = Number(localStorage.getItem('recordEstrellas')) || 0;
		if (estrellasObtenidas > recordEstrellas) {
            localStorage.setItem('recordEstrellas', estrellasObtenidas);
        }
	}
};