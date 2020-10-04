import * as C from './constants';
import ElectronShell from "./shell";

export default class Player extends Phaser.GameObjects.Container {

    sprite: Phaser.GameObjects.Sprite;
    shell: ElectronShell;
    disabled: boolean;
    onCollision: () => void;

    constructor(scene: Phaser.Scene, shell: ElectronShell, onCollision: () => void) {
        super(scene);
        this.sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'proton');
        this.sprite.displayWidth = this.sprite.displayHeight = C.PLAYER_SIZE;
        this.add(this.sprite);
        this.depth = 100;
        this.reset(shell);
        this.onCollision = onCollision;
    }

    update(time: number, delta: number) {
        if (!this.disabled) {
            for (let electron of this.shell.electrons) {
                if (electron.checkCollision(this)) {
                    this.disabled = true;
                    this.scene.tweens.add({
                        targets: this.sprite,
                        scale: this.sprite.scale * 0.2,
                        duration: 50,
                        onComplete: () => {
                            this.onCollision();
                        },
                    })
                    this.scene.sound.play('zapp');
                };
            }
        }
    }

    jumpToShell(newShell: ElectronShell): boolean {
        if (this.disabled || newShell === this.shell) {
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
                this.scene.sound.play('click');
            },
        });
        return true;
    }

    jumpToKernel(nextLevel: () => void) {
        if (this.disabled) {
            return;
        }
        this.disabled = true;
        this.scene.tweens.add({
            targets: this.sprite,
            x: 0,
            duration: C.PLAYER_JUMP_DURATION,
            ease: 'Linear',
            onComplete: () => {
                this.shell.remove(this);
                this.shell = null;
                this.disabled = false;
                this.scene.sound.play('ding');
                nextLevel();
            },
        });
    }

    reset(outerShell: ElectronShell) {
        this.sprite.displayWidth = this.sprite.displayHeight = C.PLAYER_SIZE;
        this.sprite.x = outerShell.radius + 200;
        this.angle = 90;
        if (this.shell != null) {
            this.shell.remove(this);
        }
        this.shell = outerShell;
        this.shell.add(this);
        this.disabled = true;
        this.scene.tweens.add({
            targets: this.sprite,
            x: this.shell.radius,
            duration: 700,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.disabled = false;
            },
        });
    }

}
