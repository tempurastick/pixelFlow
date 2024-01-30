function riverFlow(vector) {
    /* perlin noise field start */
    let yOffset = 0;
    for (let y = 0; y < rows; y++) {
        let xOffset = 0;
        for (let x = 0; x < cols; x++) {
            let index = (x + y * cols); // calculates how many array items we need in flowField
            let r = (noise(xOffset, yOffset)) * rModifier; // 2d perlin noise
            let angle = noise(xOffset, yOffset, zOffset) * PI * angleModifier; // 2d perlin noise
            vector = p5.Vector.fromAngle(angle);
            vector.setMag(2);
            flowField[index] = vector;
            xOffset += increment;
        }
        yOffset += increment;
        zOffset += 0.0006; // velocity
    }
}

class Flowfield {
    constructor(length, rModifier, angleModifier, magnitude, scaleModifier) {
        this.length = length;
        this.rModifier = rModifier;
        this.angleModifier = angleModifier;
        this.magnitude = magnitude;
        this.scaleModifier = scaleModifier;
    }

    invokeField() {
        /* perlin noise field start */
        let yOffset = 0;
        for (let y = 0; y < rows; y++) {
            let xOffset = 0;
            for (let x = 0; x < cols; x++) {
                let index = (x + y * cols); // calculates how many array items we need in flowField
                //let r = (noise(xOffset, yOffset)) * rModifier; // 2d perlin noise
                let angle = noise(xOffset, yOffset, zOffset) * PI * angleModifier; // 2d perlin noise
                let vector = p5.Vector.fromAngle(angle);
                vector.setMag(magnitude);
                flowField[index] = vector;
                xOffset += increment;
            }
            yOffset += increment;
            zOffset += 0.0006; // velocity
        }
    }

    invokeWaveField() {
        let yOffset = 0;
        for (let y = 0; y < rows; y++) {
            xOffset = 0;
            for (let x = 0; x < cols; x++) {
                let index = (x + y * cols); // calculates how many array// items we need in flowField
                let angle = noise(xOffset,yOffset)*PI;
                let r = noise(xOffset, yOffset, zOffset) *PI; // 2d perlin noise
                let vector = p5.Vector.fromAngle(r*angle);
                xOffset +- increment;
                vector.setMag(magnitude);
                flowField[index] = vector;
            }
            yOffset += increment;
            zOffset += 0.9; // velocity
        }
    }

    invokespinField() {
        let zOffset = 0;
        for (let y = 0; y < rows; y++) {
            let yOffset = 0;
            for (let x = 0; x < cols; x++) {
                xOffset = 0;
                let index = (x + y * cols); // calculates how many array// items we need in flowField
                let nx = 0.03*x*zOffset;
                let ny = 0.003*y;
                //let vector = createVector(x, -y);
                let vector = p5.Vector.fromAngles(noise(nx), noise(ny));
                xOffset +- increment;
                vector.setMag(0.5);
                flowField[index] = vector;
            }
            yOffset += increment;
            zOffset += 0.9; // velocity
        }
    }

    invokefunkyField() {
        let yOffset = 0;
        let zOffset = 0;
        for (let y = 0; y < rows; y++) {
            xOffset = 0;
            for (let x = 0; x < cols; x++) {
                let index = (x + y * cols); // calculates how many array// items we need in flowField
                //let vector = createVector(x, -y);
                let vector = p5.Vector.fromAngles(x*zOffset, y*noise(zOffset));
                xOffset += increment;
                vector.setMag(0.03);
                flowField[index] = vector;
            }
            yOffset += increment;
            zOffset += 0.009; // velocity
        }
    }
}
