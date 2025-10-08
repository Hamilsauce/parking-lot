import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, DOM, utils } = ham;

const VehicleType = {
  Car: 'car',
  Bus: 'bus',
  Motorcycle: 'motorcycle',
}

const generateLPN = (type = VehicleType.Car) => (type.slice(0, 1).toLowerCase() || 'o') + utils.uuid();

const vehicleTypeMap = {
  [VehicleType.Car]: { size: 1, licensePlateNumber: generateLPN([VehicleType.Car]) },
  [VehicleType.Motorcycle]: { size: 1, licensePlateNumber: generateLPN([VehicleType.Motorcycle]) },
  [VehicleType.Bus]: { size: 3, licensePlateNumber: generateLPN(VehicleType.Bus) },
}

export class Vehicle {
  #licensePlateNumber = -1;
  #type = '';
  #size = 0;
  
  constructor(type = VehicleType.Car, options) {
    const { licensePlateNumber, size } = vehicleTypeMap(type);
    this.#type = type;
    this.#size = size;
    this.#licensePlateNumber = licensePlateNumber;
  }
  
  get type() { return this.#type };
  
  get licensePlateNumber() { return this.#licensePlateNumber };
  
  get size() { return this.#size };
}

export class ParkingSpace {
  
  constructor() {}
  
  // get licensePlateNumber() { return this.#licensePlateNumber };
  
  // get size() { return this.#size };
}

// 2D Collection of ParkingSpaces
export class Range {
  #licensePlateNumber = -1;
  #type = '';
  #size = 0;
  
  constructor(type = VehicleType.Car, options) {
    const { licensePlateNumber, size } = vehicleTypeMap(type)
    this.#type = type;
    this.#size = size;
    this.#licensePlateNumber = licensePlateNumber;
  }
  
  get type() { return this.#type };
  
  get licensePlateNumber() { return this.#licensePlateNumber };
  
  get size() { return this.#size };
}

export class ParkingLot {
  #type = '';
  #size = 0;
  
  constructor(type = VehicleType.Car, options) {
    const { licensePlateNumber, size } = vehicleTypeMap(type)
    this.#type = type;
    this.#size = size;
    this.#licensePlateNumber = licensePlateNumber;
  }
  
  get licensePlateNumber() { return this.#licensePlateNumber };
  get size() { return this.#size };
}