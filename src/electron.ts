import * as C from "./constants";
import ElectronShell from "./shell";
import Player from "./player";


export default abstract class Electron extends Phaser.GameObjects.Container {

    sprite: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, distance: number) {
        super(scene);
        this.sprite = new Phaser.GameObjects.Sprite(scene, distance, 0, 'electron');
        this.sprite.displayWidth = this.sprite.displayHeight = C.ELECTRON_SIZE;
        this.add(this.sprite);
    }

    abstract checkCollision(player: Player): boolean;

}


export class BasicElectron extends Electron {

    shell: ElectronShell;

    constructor(scene: Phaser.Scene, shell: ElectronShell) {
        super(scene, shell.radius);
        this.shell = shell;
    }

    update(time: number, delta: number) {

    }

    checkCollision(player: Player): boolean {
        if (player.shell !== this.shell) {
            return false;
        }
        let angularWidth = C.ELECTRON_SIZE / this.shell.getCircumference() * 360;
        let playerAngularWidth = C.PLAYER_SIZE / this.shell.getCircumference() * 360
        let angularDistance = Math.abs(this.angle - player.angle);
        while (angularDistance > 180) {
            angularDistance = Math.abs(angularDistance - 360);
        }
        return angularDistance < angularWidth / 2 + playerAngularWidth / 2;
    }

}


export class DrunkElectron extends Electron {

    shell: ElectronShell;
    initialAngle: number;
    velocity: number;

    constructor(scene: Phaser.Scene, shell: ElectronShell, angle: number) {
        super(scene, shell.radius);
        this.shell = shell;
        this.angle = this.initialAngle = angle;
        this.velocity = 0.02;
    }

    update(time: number, delta: number) {
        if (this.velocity > 0 && this.angle - this.initialAngle > 20) {
            this.velocity = -this.velocity;
        } else if (this.velocity < 0 && this.angle - this.initialAngle < -20) {
            this.velocity = -this.velocity;
        }
        this.angle += this.velocity * delta;
    }

    checkCollision(player: Player): boolean {
        if (player.shell !== this.shell) {
            return false;
        }
        let angularWidth = C.ELECTRON_SIZE / this.shell.getCircumference() * 360;
        let playerAngularWidth = C.PLAYER_SIZE / this.shell.getCircumference() * 360
        let angularDistance = Math.abs(this.angle - player.angle);
        while (angularDistance > 180) {
            angularDistance = Math.abs(angularDistance - 360);
        }
        return angularDistance < angularWidth / 2 + playerAngularWidth / 2;
    }

}


export class JumpingElectron extends Electron {

    shell: ElectronShell;
    alternateShell: ElectronShell;
    disabled: boolean;

    constructor(scene: Phaser.Scene, shell: ElectronShell, alternateShell: ElectronShell, angle: number) {
        super(scene, shell.radius);
        this.shell = shell;
        this.alternateShell = alternateShell;
        this.angle = angle;
    }

    update(time: number, delta: number) {

    }

    checkCollision(player: Player): boolean {
        if (player.shell !== this.shell) {
            return false;
        }
        let angularWidth = C.ELECTRON_SIZE / this.shell.getCircumference() * 360;
        let playerAngularWidth = C.PLAYER_SIZE / this.shell.getCircumference() * 360
        let angularDistance = Math.abs(this.angle - player.angle);
        while (angularDistance > 180) {
            angularDistance = Math.abs(angularDistance - 360);
        }
        return angularDistance < angularWidth / 2 + playerAngularWidth / 2;
    }

    jumpToShell(newShell: ElectronShell) {
        if (this.disabled) {
            return false;
        }
        this.disabled = true;
        this.scene.tweens.add({
            targets: this.sprite,
            x: newShell.radius,
            duration: C.PLAYER_JUMP_DURATION,
            ease: 'Quad.easeOut',
            onComplete: () => {
                let angleOffset = newShell.angle - this.shell.angle;
                this.shell.remove(this);
                this.shell = newShell;
                this.shell.add(this);
                this.angle -= angleOffset;
                this.disabled = false;
            },
        });
        return true;
    }


}
