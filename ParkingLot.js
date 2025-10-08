import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, DOM, utils } = ham;

const VehicleType = {
  Car: 'car',
  Bus: 'bus',
  Motorcycle: 'motorcycle',
}

const generateLPN = (type = VehicleType.Car) => (type.slice(0, 1).toLowerCase() || 'o') + utils.uuid();

const vehicleTypeMap = {
  [VehicleType.Car]: { size: 1, licensePlateNumber: generateLPN(VehicleType.Car) },
  [VehicleType.Motorcycle]: { size: 1, licensePlateNumber: generateLPN(VehicleType.Motorcycle) },
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
  #x;
  #y;
  #value;
  
  constructor() {}
  
  // get size() { return this.#size };
}

// 2D Collection of ParkingSpaces
export class Range {
  #coords = [];
  #selectorFn = [];
  
  constructor(coords = [], options) {
    this.#coords = coords;
  }
  
  get coords() { return this.#coords };
}

export class ParkingLot extends EventTarget {
  #length = null;
  #width = null;
  #parkingSpaces = null;
  #parkedCars = new Map();
  
  constructor(length = 10, width = 10) {
    super();
    
    this.#length = length;
    this.#width = width;
    
    this.#parkingSpaces = new Array(length)
      .fill(null)
      .map(() => new Array(width).fill(null));
  }
  
  get parkingSpaces() { return this.#parkingSpaces }
  
  hasSpaceFor(vehicle) {}
  
  findFirstPlacement(vehicleSize) {
    const lot = this.#parkingSpaces
    const rows = lot.length;
    const cols = lot[0].length;
    // Horizontal search
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c <= cols - vehicleSize; c++) {
        let canFit = true;
        for (let k = 0; k < vehicleSize; k++) {
          if (lot[r][c + k] !== null) {
            canFit = false;
            break;
          }
        }
        if (canFit) return { orientation: 'H', row: r, col: c };
      }
    }
    
    // Vertical search
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r <= rows - vehicleSize; r++) {
        let canFit = true;
        for (let k = 0; k < vehicleSize; k++) {
          if (lot[r + k][c] !== null) {
            canFit = false;
            break;
          }
        }
        if (canFit) return { orientation: 'V', row: r, col: c };
      }
    }
    
    return null; // No placement available
  }
  
  
  park(vehicle) {
    const placement = this.findFirstPlacement(vehicle.size)
    
    if (!placement) return null
    
    const { orientation, row, col } = placement
    const firstSpace = this.#getParkingSpace(row, col)
    
    const parkingSpaceCoords = []
    
    for (let i = 0; i < vehicle.size; i++) {
      const coords = orientation === 'V' ? [row + i, col] : [row, col + i]
      parkingSpaceCoords.push(coords)
      
      this.#parkingSpaces[coords[0]][coords[1]] = {
        ...vehicle
      }
      
      this.#parkedCars.set(vehicle.licensePlateNumber, new Range(parkingSpaceCoords))
    }
  }
  
  #getParkingSpace(row, col) {
    return this.#parkingSpaces[row][col]
  }
  
  #setParkingSpace(row, col, value) {
    this.#parkingSpaces[row][col] = value;
  }
  
  retrieve(licensePlateNumber) {
    const vehicleRange = this.#parkedCars.get(licensePlateNumber)
    let vehicle = null
    
    if (!vehicleRange) {
      console.error(`VEHICLE NOT FOUND IN RETRIEVE. License: ${licensePlateNumber}`)
      return;
    }
    
    
    vehicleRange.coords.forEach(([r, c], i) => {
      if (!vehicle) {
        vehicle = this.#getParkingSpace(r, c)
      }
      
      this.#setParkingSpace(r, c, null)
    });
    
    this.#parkedCars.delete(licensePlateNumber)
    
    return vehicle;
  }
  
  
  bfsShortestPath(start, size = 1) {
    const queue = [
      [start]
    ]; // queue of paths
    const visited = new Set(); // to avoid revisiting nodes
    
    while (queue.length > 0) {
      const path = queue.shift(); // FIFO
      const node = path[path.length - 1];
      
      let unvisitedNeighbors
      
      if (node === goal) {
        return path; // return full path when goal is found
      }
      
      if (!visited.has(node)) {
        visited.add(node);
        
        unvisitedNeighbors = this.getUnvisitedNeighbors(node);
        
        for (const [direction, neighbor] of unvisitedNeighbors || []) {
          queue.push([...path, neighbor]); // enqueue a new path
        }
      }
    }
    
    return null; // no path found
  }
  
  on(eventType, immediate = true) {}
}