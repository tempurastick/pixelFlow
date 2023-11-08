function Particle() {
    /* TODO randomize starting position every time particle is invoked, so different streams start happening
    *   https://p5js.org/examples/simulate-multiple-particle-systems.html
    *  */
    this.pos = createVector(random(width), random(height)); // starting position gets messed up when scaled up
    this.vel = createVector(0,0); // randomly moving around
    this.acc = createVector(0,0);
    this.maxspeed = 2;

    this.prevPos = this.pos.copy();

    this.update = function() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxspeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    this.follow = function(vectors) {
        const x = floor(this.pos.x / scale);
        const y = floor(this.pos.y / scale);
        const index = x + y * cols;
        const force = vectors[index];
        this.applyForce(force);
    }

    this.applyForce = function(force) {
        this.acc.add(force);
    }

    this.show = function(colour) {
        noStroke();
        fill(colour);
        //point(this.pos.x, this.pos.y);
        //line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
        rect(this.pos.x, this.pos.y, pixelSize, pixelSize);
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
