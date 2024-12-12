
import * as THREE from 'three';

class Forces {
  calgravity(mass , g) {
    var F_gravity = mass * g;
    return new THREE.Vector3(0, -F_gravity, 0);
  }
  calbuoyant(mass, water_density , g) {
    var water_volume = mass / water_density;
    var F_buoyancy = water_density * g * water_volume;
    return new THREE.Vector3(0, F_buoyancy, 0);
  }

  caldrag(v, water_density) {
    const a = 1.275;
    const c_d = 0.4;
    var F_drag = (1 / 2) * a * c_d * water_density * v.length() * v.length();
    var dragForceDirection = v.clone().normalize().negate(); 
    var dragForce = dragForceDirection.multiplyScalar(F_drag);
    return dragForce;
  }

  calairResistance(v, air_density) {
    const a = 2;
    const c_d = 0.3;
    var F_AirResistance = (1 / 2) * a * c_d * air_density * v.length() * v.length();
    var airResistanceDirection = v.clone().normalize().negate(); 
    var airResistanceforce = airResistanceDirection.multiplyScalar(F_AirResistance);
    return airResistanceforce;
  }

  calthrust(engineForce, breakeForce , throttle , InputThrottle , InputBrake) {
    var brake = InputBrake * breakeForce;
    throttle = InputThrottle * engineForce;
    var F_Thrust = throttle - brake;
    var thrustVector = new THREE.Vector3(0, 0, -F_Thrust);
    return thrustVector;
  }

  calwind(air_density, direction, v, wind_speed) {
    let windVector;

    if(direction == "west")
      windVector = new THREE.Vector3(0, 0, 1);

    else if(direction == "east")
      windVector = new THREE.Vector3(0, 0, -1);

    else if(direction == "south")
      windVector = new THREE.Vector3(1, 0, 0);

    else if(direction == "north")
      windVector = new THREE.Vector3(-1, 0, 0);
    
    
    var angle = Math.acos(v.dot(windVector) / (v.length() * windVector.length()));
    if (angle <= Math.PI / 4) {
      var a = 2;
      var c_d = 0.3;
    } else if (angle > (3 * Math.PI) / 4) {
      var a = 1.7;
      var c_d = 0.2;
    } else {
      var a = 3.2;
      var c_d = 0.5;
    }

    var F_wind = (1 / 2) * a * c_d * air_density * wind_speed * wind_speed;
    return windVector.multiplyScalar(F_wind);
  }
}

class Boat {
  constructor() {
    this.position = new THREE.Vector3(-26.5,36,0);
    this.velocity = new THREE.Vector3();
    this.linearVelocity = new THREE.Vector3();
    this.totalVelocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.wind_acceleration = new THREE.Vector3();
    this.wind_speedVector = new THREE.Vector3();
    this.rotation_vector = new THREE.Vector3();
    this.boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

    this.gravityVector = new THREE.Vector3(0,0,0);
    this.buoyantVector = new THREE.Vector3(0,0,0);
    this.windVector = new THREE.Vector3(0,0,0);
    this.airResistanceVector = new THREE.Vector3(0,0,0);
    this.dragVector = new THREE.Vector3(0,0,0);
    this.thrustVector = new THREE.Vector3(0,0,0);

    this.yaw_angle = Math.PI;
    this.rotate_velocity = 0;
    this.rotate_acceleration = 0;
    this.rotation = 0;

    this.mass = 2500;
    this.g = 9.81;
    this.air_density = 1.2;
    this.water_density = 1025;
    this.windDirection = "west";
    this.wind_speed = 0;
    this.first = this.mass / 80;
    this.second = this.first - 31;
    
    this.assestNumber = 0;
    this.state = true;

    this.engineForce = 1000000;
    this.breakeForce = 10000;
    this.throttle = 0;
    this.InputThrottle = 0;
    this.InputBrake = 0;    
  }

  totalForce() {
    var f = new Forces();
    var forces = new THREE.Vector3();
    forces.add(f.calgravity(this.mass, this.g));
    forces.add(f.calbuoyant(this.mass, this.water_density, this.g));
    forces.add(f.calthrust(this.engineForce, this.breakeForce, this.throttle, this.InputThrottle, this.InputBrake));
    forces.add(f.caldrag(this.velocity, this.water_density));
    forces.add(f.calairResistance(this.velocity, this.air_density));
  
    return forces;
  }
  

  update() {
    
    console.log('x',this.position)
    console.log('y',this.gravityVector)
    var vectors = new Forces();
    this.gravityVector = vectors.calgravity(this.mass, this.g);
    this.buoyantVector = vectors.calbuoyant(this.mass, this.water_density, this.g);
    this.dragVector = vectors.caldrag(this.velocity, this.water_density);
    this.airResistanceVector = vectors.calairResistance(this.velocity, this.air_density)
    this.windVector = vectors.calwind(this.air_density,this.windDirection,this.rotation_vector,this.wind_speed);
    this.thrustVector = vectors.calthrust(this.engineForce, this.breakeForce, this.throttle, this.InputThrottle, this.InputBrake);

    this.sink();

  if(this.velocity.length() < 3){
    this.velocity.set(0,0,0);
  }

  this.rotation_vector.x = Math.sin(this.yaw_angle);
  this.rotation_vector.z = Math.cos(this.yaw_angle);

  document.addEventListener("keydown", (event) => {
    if (event.key === "W" || event.key === "w") {
      if (this.InputThrottle <= 1) {
        this.InputThrottle += 0.1;
      }
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "W" || event.key === "w") {
      this.InputThrottle = 0;
    }
  });

    var totalForce = this.totalForce();
    this.acceleration = totalForce.divideScalar(this.mass);
    this.velocity.add(this.acceleration.clone().multiplyScalar(0.02));

    var windForce = this.finalWind();
    this.wind_acceleration = windForce.divideScalar(this.mass);
    this.wind_speedVector.add(this.wind_acceleration.clone().multiplyScalar(0.02));


    this.linearVelocity.x = -(this.velocity.z * Math.sin(this.yaw_angle));
    this.linearVelocity.z = -(this.velocity.z * Math.cos(this.yaw_angle));
    this.linearVelocity.y = this.velocity.y;

    this.totalVelocity.x = this.linearVelocity.x + this.wind_speedVector.x;
    this.totalVelocity.z = this.linearVelocity.z + this.wind_speedVector.z;

    this.position.add(this.totalVelocity.clone().multiplyScalar(0.02));
    
    //rotation
    var totalTorque = this.totalTorque() * this.rotation;

    document.addEventListener("keydown", (event)=> {
      if (event.key === "A" || event.key === "a") {
        if (this.rotation < 1){
        this.rotation = this.rotation + 0.005;
        }
      }
    });
    document.addEventListener("keyup", (event)=> {
      if (event.key === "A" || event.key === "a") {
        this.rotation = 0
        this.rotate_velocity = 0 ;
      }
    });

    document.addEventListener("keydown", (event)=> {
      if (event.key === "D" || event.key === "d") {
        if (this.rotation > -1){
        this.rotation = this.rotation - 0.005;
        }
      }
    });
    document.addEventListener("keyup", (event)=> {
      if (event.key === "D" || event.key === "d") {
        this.rotation = 0
        this.rotate_velocity = 0 ;
      }
    });

    this.rotate_acceleration = totalTorque/(this.mass * 91 * 91);
    this.rotate_velocity = this.rotate_velocity + (this.rotate_acceleration*0.02) ;
    this.yaw_angle = (this.yaw_angle + (this.rotate_velocity*0.02));
    this.updateBoundingBox();
  }

  updateBoundingBox() {
    const shipSize = new THREE.Vector3(15, 50, 800);
    this.boundingBox.setFromCenterAndSize(
      new THREE.Vector3(
        this.position.x + 15,
        this.position.y,
        this.position.z + 390
      ),
      shipSize
    );
  }

  totalTorque(){
    var force = new Forces();
    var thrust = force.calthrust(this.engineForce, this.breakeForce , this.throttle , this.InputThrottle , this.InputBrake).length()*91;
    var drag = force.caldrag(this.velocity, this.water_density).length()*60;
    var airResistance = force.calairResistance(this.velocity, this.air_density).length()*91;

    var torque = thrust - drag - airResistance;
    return torque;
  }

  finalWind(){
    var fe = new Forces();
    var force2 = new THREE.Vector3();
    force2.add(fe.calwind(
        this.air_density,
        this.windDirection,
        this.rotation_vector,
        this.wind_speed
      ));
    force2.add(fe.caldrag(this.wind_speedVector, this.water_density));
    force2.add(fe.calairResistance(this.wind_speedVector, this.air_density));
    
    return force2;
  }

  sink(){
    // if(this.second > 0){
    //   this.second = this.second - 0.1;
    //   this.position.y = this.position.y - 0.1;
    //     }    
    //     if(this.position.y < 25.1){
    //     this.position.y = this.position.y - 0.1;
    //   }

      if(this.mass < 2501){
        if(this.state == true){
        this.position.y = this.position.y - 5;
        this.state = false;
        }
      }

    else if(this.assestNumber > 0){
      this.assestNumber -= 1;
      this.position.y = this.position.y - 0.02;
    }
    if(this.position.y < 26){
      this.position.y = this.position.y - 0.1;
    }
  }

  crash(){
    this.throttle = 0;
    this.velocity.negate();  
  }
}

export default Boat;

