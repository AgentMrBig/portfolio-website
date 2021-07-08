/*
function load() {
    var c = document.getElementById("c").getContext("2d");
    c.fillStyle = "rgba(255, 200, 200, 1)";
    c.fillRect(0, 0, c.canvas.width, c.canvas.height);
}
*/
let ship;
let asteroids = [];
let lasers = [];

// BEGIN setup
function setup(){
  //createCanvas(windowWidth - 20, windowHeight -20);
  createCanvas(windowWidth - 20, 300);
  canvas.parent('sketch-holder');

 
  ship = new Ship();
  for(var i = 0; i < 10; i++){
    asteroids.push(new Asteroid());
  }
  
}
// END Setup


// BEGIN Draw
function draw(){
  background(0);

  for(var i = 0; i < asteroids.length; i++){
      if(ship.hits(asteroids[i])){
          // ship hit asteroid
          console.log("boom");
      }
    asteroids[i].render();
    asteroids[i].update();
    asteroids[i].edges();
  }
  
  for(var i = lasers.length - 1; i >= 0; i--){
    lasers[i].render();
    lasers[i].update();
    if(lasers[i].offscreen()){
        lasers.splice(i,1);
    }else{
        for(var j = asteroids.length - 1; j >= 0; j--){
            if(lasers[i].hits(asteroids[j])){
                if(asteroids[j].r > 10){
                  var newAsteroids = asteroids[j].breakup();
                  asteroids = asteroids.concat(newAsteroids);
              
                }
              
              //asteroids.push(newAsteroids);
              asteroids.splice(j,1);
              lasers.splice(i,1);
              break;
            }
        }
    }
    
  }
  
  ship.render();
  ship.turn();
  ship.update();
  ship.edges();
}
// END Draw 

// BEGIN Laser
function Laser(spos, angle){
  this.pos = createVector(spos.x, spos.y);
  this.vel = p5.Vector.fromAngle(angle);
  this.vel.mult(5);
  
  this.update = function(){
    this.pos.add(this.vel);
  }

  // laser render
  this.render = function(){
    push();
    stroke(255);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
    pop();
  }
  
  // laser hits
  this.hits = function(asteroid){
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if(d < asteroid.r){
      return true;
    }else{
      return false;
    }
  }

  this.offscreen = function(){
    if(this.pos.x > width || this.pos.x < 0){
      return true;
    }
    if(this.pos.y > height || this.pos.y < 0){
        return true;
    }
    return false;
  }
}
// END Laser

// BEGIN Asteroid
function Asteroid(pos, r){
  if(pos){
    this.pos = pos.copy();
  }else{
    this.pos = createVector(random(width), random(height));
  }
  if(r){
      this.r = r * 0.5;
  }else{
      this.r = random(this.r * 0.5, this.r);
  }

  //this.pos = createVector(random(width), random(height));
  this.vel = p5.Vector.random2D();
  this.r = random(15, 50);
  this.total = floor(random(5,15));
  this.offset = [];

  for(var i = 0; i < this.total; i++){
    this.offset[i] = random(-this.r * 0.5, this.r * 0.5);
  }
  
  //Asteroid update
  this.update = function(){
    this.pos.add(this.vel);
  }
  
  //Asteroid render
  this.render = function(){
    push();
    stroke(255);
    noFill();
    translate(this.pos.x, this.pos.y);
    //ellipse(0,0, this.r * 2);
    beginShape();
    for(var i = 0; i < this.total; i++){
      var angle = map(i, 0, this.total, 0, TWO_PI);
      var r = this.r + this.offset[i];
      var x = r * cos(angle);
      var y = r * sin(angle);
      vertex(x, y);
    }
    
    this.breakup = function(){
      var newA = [];
      newA[0] = new Asteroid(this.pos, this.r * 0.5);
      newA[1] = new Asteroid(this.pos, this.r * 0.5);
      return newA;
    }
    
    endShape(CLOSE);
    pop();
  }

  this.checkCol = function(asteroid){
      if(this.pos.x == asteroid.pos.x || this.pos.y == asteroid.pos.y){
          console.log("Fuck I hit " );
          //change vel
      }
  }
  
  //Asteroid edges check
  this.edges = function(){
    if(this.pos.x > width + this.r){
      this.pos.x = -this.r;
    }else if(this.pos.x < -this.r){
      this.pos.x = width + this.r;
    }
    if(this.pos.y > height + this.r){
      this.pos.y = -this.r;
    }else if(this.pos.y < -this.r){
      this.pos.y = height + this.r;
    }
  }
}
// END Asteroid


// BEGIN Controls 
function keyReleased(){
  ship.setRotation(0);
  ship.boosting(false);
}

function keyPressed(){
  if(key == ' '){
    lasers.push(new Laser(ship.pos, ship.heading));
    console.log(this.astroids);
  }
  if(keyCode == RIGHT_ARROW){
    ship.setRotation(0.1)
  }else if(keyCode == LEFT_ARROW){
    ship.setRotation(-0.1);
  }else if(keyCode == UP_ARROW){
    ship.boost();
    ship.boosting(true);
  }
}
// END Controls

// BEGIN Ship
function Ship(){
  this.pos = createVector(width/2, height/2);
  this.r = 20;
  this.heading = 0;
  this.rotation = 0;
  this.vel = createVector(0,0);
  this.isBoosting = false;
  
  this.boosting = function(b){
    this.isBoosting = b;
  }
  
  //ships update
  this.update = function(){
    if(this.isBoosting){
      this.boost();
    }
    
    this.pos.add(this.vel);
    this.vel.mult(0.94);
  }

  //ships boost
  this.boost = function(){
    let force = p5.Vector.fromAngle(this.heading);
    force.mult(0.2);
    this.vel.add(force);
  }

  this.hits = function(asteroid){
      var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
      if(d < this.r + asteroid.r){
          return true;
      }else{
          return false;
      }
  }
  
  //ships render
  this.render = function(){
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI/2);
    fill(0);
    stroke(255);
    triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
    pop();
  }
  
  //ships edges check
  this.edges = function(){
    if(this.pos.x > width + this.r){
      this.pos.x = -this.r;
    }else if(this.pos.x < -this.r){
      this.pos.x = width + this.r;
    }
    if(this.pos.y > height + this.r){
      this.pos.y = -this.r;
    }else if(this.pos.y < -this.r){
      this.pos.y = height + this.r;
    }
  }
  
  this.setRotation = function(a){
    this.rotation = a;
  }

  this.turn = function(angle){
    this.heading += this.rotation;
  }
}
// END Ship