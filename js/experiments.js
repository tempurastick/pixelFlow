// Perlin Noise Circles based on Daniel Shiffman's tutorial
let canvasWidth = 160;
let canvasHeight = 144;
let backgroundColour = 255;
let pixelSize = 1;
let xOffset = 1; // default xOffset value we pick
let xOffset2 = 200; // different start value
let increment = 0.1; // modifies noise x-graph increment
let start = 0;
let scale = 4; // scale of one flow  point
let cols, rows;
let fr;
let zOffset = 0.1;
let paletteOne = "#ff7777";
let paletteTwo = "#ffce96";
let paletteThree = "#00303b";
let paletteFour = "#f1f2da";

let palette = [paletteOne, paletteTwo, paletteThree, paletteFour];

let flowField;
let zoff = 0;
let noiseMax = 0.3;
let a = 0;

function setup() {
    createCanvas(500, 500);
    cols = floor(width/scale);
    rows = floor(height/scale);
    fr = createP('');

    flowField = new Array(cols * rows);


}

function draw() {

    background(255);
    scale = 15;
    riverFlow(paletteOne, xOffset = 1, yOffset = 5, 1, increment = 0.9);
}

function riverFlow(colour, xOffset, yOffset, zOffset, increment) {
    /* perlin noise field start */
    //let yOffset = 0;

    for (let y = 0; y < rows; y++) {
        yoff = 0;
        for (let x = 0; x < cols; x++) {
            xoff = 0;
            let index = (x + y * cols)*4; // calculates how many array items we need in flowField
            var angle = noise(xoff,yoff)*PI;
            let r = noise(xOffset, yOffset, zOffset) * PI; // 2d perlin noise
            //let vector = p5.Vector.fromAngle(angle);
            let v = createVector(r, -angle);
            xoff +- increment;
            v.setMag(1);
            flowField[index] = v;
            xOffset += increment;
            let showFlowField = function () {
                push();
                /* shows the flowfield that is happening in the background */
                stroke(122);
                translate(x * scale, y * scale);
                rotate(v.heading());
                line(0, 0, scale, 0);
                pop();
            }

            showFlowField();
        }
        yoff += increment;
        zOffset += 0.0005;
    }
}

function capsulatedCircle() {
    background(0);
    stroke(255);
    strokeWeight(3);
    noFill();
    //translate(0, height / 2);

    let nbY = 6; // nb of lines
    for(let y = 1; y<=nbY; y++)
    {
        translate(0, height / (nbY+1));
        //create a line of circles
        let nbX = 9; //nb or raw
        for (let x = 1; x<=nbX; x++)
        {
            translate(width / (nbX+1), 0);
            drawPerlinCircle(5);
        }
        translate(-nbX * width / (nbX+1), 0);
    }
}

function drawPerlinCircle(n)
{
    for(let i = 0; i<n; i++)
    {
        beginShape();
        for (let a = 0; a < TWO_PI; a += radians(2)) {
            let xoff = map(cos(a), -1, 1, 0, noiseMax);
            let yoff = map(sin(a), -1, 1, 0, noiseMax);
            let r = map(noise(xoff, yoff, zoff), 0, 1, 10, 60);
            let x = r * cos(a);
            let y = r * sin(a);
            vertex(x, y);
        }
        endShape(CLOSE);
        zoff += 0.10;
    }
}

/*
ring
let angle = random(0, 360);
let radius = innerRadius + random() * (outerRadius - innerRadius);
let x = rW / 2 + cos(radians(angle)) * radius;
let y = rH / 2 + sin(radians(angle)) * radius;*/

/*
*
*
*         // TEST
        for (let i = 0; i < 100; i++) {
            let angle = random(0, 360);
            let xoff = map(cos(angle), -1, 1, 0, noiseMax);
            let yoff = map(sin(angle), -1, 1, 0, noiseMax);
            // makes circle imperfect
            let radius = map(noise(xoff, yoff, zoff), 0, 1, outerRadius, innerRadius);
            let x = rW / 2 + cos(radians(angle)) * radius;
            let y = rH / 2 + sin(radians(angle)) * radius;
            //particles.push(createVector(x, y));
            this.pos = createVector(x, y);
        }
        // TEST END
* */
