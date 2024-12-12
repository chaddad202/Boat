// هون منحدث كل شي قيم دخلا اليوزر
export function updateboatSettings(boat, settings) {
  if (settings.wind_speed !== undefined)
    boat.wind_speed = settings.wind_speed;
  if (settings.windDirection !== undefined) {
    boat.windDirection = settings.windDirection;
  }
  if (settings.air_density !== undefined)
    boat.air_density = settings.air_density;
  if (settings.water_density !== undefined)
    boat.water_density = settings.water_density;
  if (settings.engineForce !== undefined)
    boat.engineForce = settings.engineForce;
  if (settings.mass !== undefined) boat.mass = settings.mass;
  
}

//تابع تحديث المخدلات
export function updateVariablesListeners(boat) {
  const inputs = {
    wind_speed: document.querySelector('input[name="Speed"]'),
    windDirection: document.querySelector('input[name="Wind Direction"]'),
    air_density: document.querySelector('input[name="Air Density"]'),
    water_density: document.querySelector('input[name="Water Density"]'),
    engineForce: document.querySelector('input[name="Engine Torque"]'),
    mass: document.querySelector('input[name="Mass"]'),
    
  };

  // لكل حقل حسب الدخل تحديثة
  if (inputs.wind_speed) inputs.wind_speed.value = boat.wind_speed;
  if (inputs.windDirection) inputs.windDirection.value = boat.windDirection;
  if (inputs.air_density) inputs.air_density.value = boat.air_density;
  if (inputs.water_density) inputs.water_density.value = boat.water_density;
  if (inputs.engineForce) inputs.engineForce.value = boat.engineForce;
  if (inputs.mass) inputs.mass.value = boat.mass;
  
}

// معالجة للمدخلات الي عم تتغير
export function handleInputChange(event, boat) {
  const name = event.target.name.toLowerCase().replace(" ", "");
  const value = parseFloat(event.target.value);

  if (!isNaN(value)) {
    boat[name] = value;
  }
  camera.lookAt(shipPosition);
  controls.target.copy(shipPosition);
  controls.update();
  renderer.render(scene, camera);
}

export function addVariablesListeners(boat) {
  const inputFields = document.querySelectorAll("input");
  inputFields.forEach((input) => {
    input.addEventListener("input", (event) => handleInputChange(event, boat));
  });
}
