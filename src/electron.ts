import * as C from "./constants";
import ElectronShell from "./shell";
import Player from "./player";


export default abstract class Electron extends Phaser.GameObjects.Container {

    sprite: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, distance: number, texture: string) {
        super(scene);
        this.sprite = new Phaser.GameObjects.Sprite(scene, distance, 0, texture);
        this.sprite.displayWidth = this.sprite.displayHeight = C.ELECTRON_SIZE;
        let oldScale = this.sprite.scale;
        this.sprite.scale = oldScale * 1.5;
        this.scene.tweens.add({
            targets: this.sprite,
            scale: oldScale,
            duration: 200,
        })
        this.scene.tweens.add({
            targets: this.sprite,
            angle: Math.sign(Math.random() - 0.5) * 360,
            duration: Math.random() * 5000 + 5000,
            repeat: -1,
        });
        this.add(this.sprite);
    }

    abstract checkCollision(player: Player): boolean;

}


export class BasicElectron extends Electron {

    shell: ElectronShell;

    constructor(scene: Phaser.Scene, shell: ElectronShell) {
        super(scene, shell.radius, 'electron');
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


export class FastElectron extends Electron {

    shell: ElectronShell;
    initialAngle: number;
    velocity: number;

    constructor(scene: Phaser.Scene, shell: ElectronShell) {
        super(scene, shell.radius, 'electron_orange');
        this.shell = shell;
        this.velocity = 0.02 * Math.sign(this.shell.velocity);
    }

    update(time: number, delta: number) {
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
    mainShell: ElectronShell;
    alternateShell: ElectronShell;
    jumpTime: number;
    disabled: boolean;

    constructor(scene: Phaser.Scene, mainShell: ElectronShell, alternateShell: ElectronShell) {
        super(scene, mainShell.radius, 'electron_purple');
        this.mainShell = this.shell = mainShell;
        this.alternateShell = alternateShell;
        this.jumpTime = 2000;
        this.disabled = false;
    }

    update(time: number, delta: number) {
        this.jumpTime -= delta;
        if (this.jumpTime < 0) {
            if (this.shell === this.mainShell) {
                this.jumpToShell(this.alternateShell);
                this.jumpTime += 500;
            } else {
                this.jumpToShell(this.mainShell);
                this.jumpTime += 2000;
            }
        }
    }

    checkCollision(player: Player): boolean {
        if (this.disabled || player.shell !== this.shell) {
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
            duration: C.ELECTRON_JUMP_DURATION,
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
