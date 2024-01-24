class Rectangle {
    constructor(x, y, w, h) {
        this.x = x; // x-coordinate of the top-left corner
        this.y = y; // y-coordinate of the top-left corner
        this.w = w; // Width of the rectangle
        this.h = h; // Height of the rectangle
    }

    contains(point) {
        return (
            point.x >= this.x &&
            point.x < this.x + this.w &&
            point.y >= this.y &&
            point.y < this.y + this.h
        );
    }

    intersects(other) {
        return !(
            other.x > this.x + this.w ||
            other.x + other.w < this.x ||
            other.y > this.y + this.h ||
            other.y + other.h < this.y
        );
    }
}


function Particle(rW = width, rH = height, size = pixelSize, startingSide = 0) {
    this.pos = createVector(rW, rH);
    this.vel = createVector(0,0); // randomly moving around
    this.acc = createVector(0,0);
    this.maxspeed = .5;
    this.size = size;

    if ( startingSide === 0) {
       /* instead of starting on one side of the screen
       * I'll change it so that it starts as a sin wave or something more interesting
       * also the ones with no background are more interesting if they do start
       * spaghetti-ish. Probably best to turn these into random parameters too
       * */
        this.pos = createVector(random(0, rW), random(0,rH));
    } else if (startingSide === 1){
        // right half
        //this.pos = createVector(random(width / 2, width), random(0, height));
        this.pos = createVector(random((rH/2), TWO_PI*(rH/2)), random((rH/2), TWO_PI*(rH/2)));
    } else if (startingSide === 2) {
        // left half
        //this.pos = createVector(random(0, width / 2), random(0, height));
        this.pos = createVector(random(0, TWO_PI*(rW/2)), random(0, TWO_PI*(rH/2)));
    }

    this.prevPos = this.pos.copy();

    this.update = function() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxspeed);

        let stepSize = scale / 2;

        this.pos.add(p5.Vector.mult(this.vel, stepSize));
        this.acc.mult(0);
    }

    this.follow = function(vectors) {
        const x = floor(this.pos.x / scale);
        const y = floor(this.pos.y / scale);
        const index = x + y * cols; // Constrain index to prevent array out-of-bounds;
        const force = vectors[index];
        if (force) {
            force.mult(0.5); // strength of the force multiplier aka how strict the particles follow the field
            this.applyForce(force);
        }
    }

    this.applyForce = function(force) {
        this.acc.add(force);
    }

    this.show = function(colour) {
        noStroke();
        fill(colour);
        // pixelSize is not dependent on var right now
        square(this.pos.x, this.pos.y, this.size);
        //square(this.pos.x, this.pos.y, pixelSize);
        this.updatePrev();
    }

    /*
        version with random confetti
        this.show = function(paletteOne, paletteTwo, paletteThree, paletteFour) {
        let rng = [paletteOne, paletteTwo, paletteThree, paletteFour]
        noStroke();
        fill(random(rng));
        //point(this.pos.x, this.pos.y);
        //line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
        rect(this.pos.x, this.pos.y, pixelSize, pixelSize);
        this.updatePrev();
    }*/

    this.updatePrev = function() {
        this.prevPos.x = this.pos.x;
        this.prevPos.y = this.pos.y;
    }

    this.edges = function() {
        /* wraps around the screen */
        if (this.pos.x > width) {
            this.pos.x = 0;
            this.updatePrev();
        };

        if (this.pos.x < 0) {
            this.pos.x = width;
            this.updatePrev();
        };

        if (this.pos.y > height) {
            this.pos.y = 0;
            this.updatePrev();
        };

        if (this.pos.y < 0) {
            this.pos.y = height;
            this.updatePrev();
        };
    }
}

function SecondParticle(rW, rH, size = pixelSize, startingSide) {
    Particle.call(this, rW, rH, size, startingSide);
}

SecondParticle.prototype = Object.create(Particle.prototype);
SecondParticle.prototype.constructor = SecondParticle;

SecondParticle.prototype.follow = function(vectors) {
    // Implement a different follow behavior for SecondParticle
    const x = floor(this.pos.x / (scale/.5));
    const y = floor(this.pos.y / (scale/2));
    const index = x + y * cols;
    const force = vectors[index];
    if (force) {
        force.mult(5); // strength of the force multiplier aka how strict the particles follow the field
        this.applyForce(force);
    }

}

/* maybe I need a second force field but I think that'd be overkill */
