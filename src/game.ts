import 'phaser';
import {Atom} from "./atom";
import * as C from './constants';


export default class Game extends Phaser.Scene {

    atom: Atom;
    lives: number;
    lifeDisplay: Phaser.GameObjects.Container;
    elementDisplay: Phaser.GameObjects.Container;

    constructor() {
        super('game');
    }

    preload() {
        this.loadImage('titlescreen');
        this.loadImage('background');
        this.loadImage('electron');
        this.loadImage('electron_orange');
        this.loadImage('electron_purple');
        this.loadImage('proton');
        this.loadImage('ring');
        this.loadImage('life');
        this.loadImage('element_frame');

        this.loadAudio('click');
        this.loadAudio('ding');
        this.loadAudio('zapp');
    }

    loadImage(name: string) {
        this.load.image(name, `assets/${name}.png`);
    }

    loadAudio(name: string) {
        this.load.audio(name, `assets/${name}.ogg`);
    }

    create() {
        let titleScreen = this.add.image(C.GAME_WIDTH / 2, C.GAME_HEIGHT / 2, 'titlescreen');
        titleScreen.displayWidth = C.GAME_WIDTH;
        titleScreen.displayHeight = C.GAME_HEIGHT;
        titleScreen.setInteractive();

        this.input.keyboard.on('keydown', () => {
            this.input.keyboard.off('keydown');
            titleScreen.off('pointerdown');
            titleScreen.destroy();
            this.start();
        });
        titleScreen.on('pointerdown', () => {
            this.input.keyboard.off('keydown');
            titleScreen.off('pointerdown');
            titleScreen.destroy();
            this.start();
        });
    }

    update(time: number, delta: number) {
        if (this.atom !== undefined) {
            this.atom.update(time, delta);
        }
    }

    start() {
        let background = this.add.image(C.GAME_WIDTH / 2, C.GAME_HEIGHT / 2, 'background');
        background.displayWidth = C.GAME_WIDTH;
        background.displayHeight = C.GAME_HEIGHT;

        this.lifeDisplay = new Phaser.GameObjects.Container(this, 70, 70);
        this.lifeDisplay.scale = C.GUI_SCALE;
        this.lives = C.INITIAL_LIVES + 1;
        this.removeLife();

        this.elementDisplay = new Phaser.GameObjects.Container(this, C.GAME_WIDTH - 70, 70);
        this.elementDisplay.scale = C.GUI_SCALE;

        this.atom = new Atom(this);

        this.add.existing(this.atom);
        this.add.existing(this.lifeDisplay);
        this.add.existing(this.elementDisplay);
    }

    removeLife() {
        this.lives--;
        this.lifeDisplay.removeAll();
        for (let i = 0; i < this.lives; i++) {
            let life = new Phaser.GameObjects.Image(this, i * 350, 0, 'life');
            this.lifeDisplay.add(life);
        }
        if (this.lives <= 0) {
            this.scene.start('gameover', {elementNumber: this.atom.elementNumber});
        }
    }

    updateElementDisplay(elementNumber:  number) {
        this.elementDisplay.removeAll();
        this.elementDisplay.add(new Phaser.GameObjects.Image(this, 0, 0, 'element_frame'))
        this.elementDisplay.add(new Phaser.GameObjects.Text(this, -140, -150, C.ELEMENT_NAMES[elementNumber], {
            fontFamily: 'sans-serif',
            fontSize: '180px',
            color: '#000000',
        }));
        this.elementDisplay.add(new Phaser.GameObjects.Text(this, 0, 40, elementNumber.toString(), {
            fontFamily: 'sans-serif',
            fontSize: '70px',
            color: '#000000',
            fontStyle: 'bold',
            fixedWidth: 130,
            align: 'right',
        }));
    }

}


class GameOverScreen extends Phaser.Scene {

    constructor() {
        super('gameover');
    }

    preload() {
        this.load.image('gameover', 'assets/gameover.png');
    }

    create(data: {elementNumber: number}) {
        let gameOver = this.add.image(C.GAME_WIDTH / 2, C.GAME_HEIGHT / 2, 'gameover');
        gameOver.displayWidth = C.GAME_WIDTH;
        gameOver.displayHeight = C.GAME_HEIGHT;

        let elementDisplay = new Phaser.GameObjects.Container(this, C.GAME_WIDTH - 70, 70);
        elementDisplay.scale = C.GUI_SCALE;
        elementDisplay.add(new Phaser.GameObjects.Image(this, 0, 0, 'element_frame'))
        elementDisplay.add(new Phaser.GameObjects.Text(this, -140, -150, C.ELEMENT_NAMES[data.elementNumber], {
            fontFamily: 'sans-serif',
            fontSize: '180px',
            color: '#000000',
        }));
        elementDisplay.add(new Phaser.GameObjects.Text(this, 0, 40, data.elementNumber.toString(), {
            fontFamily: 'sans-serif',
            fontSize: '70px',
            color: '#000000',
            fontStyle: 'bold',
            fixedWidth: 130,
            align: 'right',
        }));
        this.add.existing(elementDisplay);
    }

}


const config = {
    type: Phaser.AUTO,
    width: C.GAME_WIDTH,
    height: C.GAME_HEIGHT,
    scene: [Game, GameOverScreen],
    scale: {
        mode: Phaser.Scale.FIT,
    },
};

window.onload = () => {
    const game = new Phaser.Game(config);
}
