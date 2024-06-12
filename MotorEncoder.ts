let encA: DigitalPin;
let encB: DigitalPin;
let position = 0;

/**
* Użyj tego pliku, aby zdefiniować niestandardowe funkcje i bloki.
* Czytaj więcej na https://makecode.microbit.org/blocks/custom
*/

enum MyEnum {
    //% block="one"
    One,
    //% block="two"
    Two
}

/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon=""
namespace MotorEncoder {
    /**
     * TODO: describe your function here
     * @param n describe parameter here, eg: 5
     * @param s describe parameter here, eg: "Hello"
     * @param e describe parameter here
     */
    //% block
    export function foo(n: number, s: string, e: MyEnum): void {
        // Add code here
    }

    /**
     * TODO: describe your function here
     * @param value describe value here, eg: 5
     */
    //% block
    export function fib(value: number): number {
        return value <= 1 ? value : fib(value - 1) + fib(value - 2);
    }

    /**
     * rotary encoder was rotated.
     */
    //% blockId=rotary_ky_rotated_left_event
    //% block="on rotated |%dir"
    export function onRotateEvent(dir: RotationDirection, body: () => void): void {
        serial.setBaudRate(115200);
        if (dir == RotationDirection.Left) control.onEvent(rotatedLeftID, dir, body);
        if (dir == RotationDirection.Right) control.onEvent(rotatedRightID, dir, body);
        control.inBackground(() => {
            while (true) {
                const riValue = pins.digitalReadPin(encA);
                const dvValue = pins.digitalReadPin(encB);
                if (riValue == 1 && dvValue == 1) rotateReady = true;
                else if (rotateReady) {
                    if (riValue == 1 && dvValue == 0) {
                        serial.writeLine("Right!");
                        position += 1;
                        rotateReady = false;
                        control.raiseEvent(rotatedRightID, RotationDirection.Right);
                    }
                    else if (riValue == 0 && dvValue == 1) {
                        serial.writeLine("Left!")
                        position -= 1;
                        rotateReady = false;
                        control.raiseEvent(rotatedLeftID, RotationDirection.Left);
                    }
                }
                basic.pause(5);
            }
        })
    }

    /**
     * initialises local variables and enables the rotary encoder.
     */
    //% block="Connect Encoder Pin A %pinA|Pin B %pinB"
    //% icon="\uf1ec"
    export function init(pinA: DigitalPin, pinB: DigitalPin,): void {
        encA = pinA;
        encB = pinB;
    }
}
