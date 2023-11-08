function perlinNoiseDemo() {
    loadPixels();
    // two-dimensional perlin noise
    for (let x = 0; x < width; x++) {
        let yOffset = 0; // we need to set the yOffset inside the x-axis loop

        for (let y = 0; y < height; y++) {
            let index = (x + y * width) * 4; // what happens here?
            let r = (noise(xOffset, yOffset)) *255;
            pixels[index] = r;
            pixels[index+1] = r;
            pixels[index+2] = r;
            pixels[index+3] = 255;

            yOffset += increment;
        }
        xOffset += increment;
    }
    updatePixels();
}

function staticNoise() {
    /* TODO look-up loadPixels and how to use pixels in p5.js */
    loadPixels();
    // basically static noise
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let index = (x + y * width) * 4; // what happens here?
            let r = random(255);
            pixels[index] = r;
            pixels[index+1] = r;
            pixels[index+2] = r;
            pixels[index+3] = 255;
        }
    }
    updatePixels();
}

// one-dimensional perlin noise
function noiseGraph() {
    let xOffset = 0; // default xOffset value we pick
    let xOffset2 = 200; // different start value
    let increment = 0.01; // modifies noise x-graph increment
    let start = 0;

    background(255);
    strokeWeight(1);
    noFill();
    beginShape();
    xOffset = start; // ties xOffset to our start value
    for (let x = 0; x < width; x++) {
        //vertex(random(160), random(144)); // pure randomness
        //vertex(x, random(144)); // random graph on y-axis
        let y = noise(xOffset) * height; // xOffset value is the "start" point of the perlin noise
        vertex(x, y); // random graph on y-axis

        xOffset += increment; // refresh seed
    }
    endShape();

    start += increment; // by incrementing the start value we're moving along the x-axis of the perlin noise
}

function noiseExplanation() {
    //map(value, start1, stop1, start2, stop2, [withinBounds])
    let randomX = map(noise(xOffset), 0, 1, 0, width);
    let randomY = map(noise(xOffset2), 0, 1, 0, height);
    square(randomX, randomY, pixelSize, pixelSize);
    xOffset += 0.01; // refreshes the noise seed, also changes the speed
    xOffset2 += 0.01; // refreshes the noise seed
}
