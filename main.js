import { ParkingLot } from './ParkingLot.js';
import { useTemplate } from './utils.js';
const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const svgCanvas = document.querySelector('#svg-canvas')
const vehicleList = document.querySelector('#vehicle-list')

const parkCarButton = document.querySelector('#park-car-button')
const parkBusButton = document.querySelector('#park-bus-button')

const parkingLot = new ParkingLot(10, 10)

// parkingLot.park({ licensePlateNumber: '394jr9', size: 3, type: 'bus' })


// console.warn('parkingLot', parkingLot)
let workerMan = new window.Worker('workerman.js');

let isPaused = false
let bgString = ''

// workerMan.onmessage = (e) => {
//   if (isPaused) return;
//   bgString = `${e.data.bgString.trim()}`;
//   app.style.background = bgString
//   app.style.filter = e.data.invert
// }


const buildList = (listEl, items) => {
  items.forEach((item, i) => {
    // const itemEl = useTemplate('vehicle-list-item') //.firstElementChild;
    
    const itemEl = document.createElement('li');
    itemEl.classList.add('vehicle-list-item')
    Object.assign(itemEl.dataset, item)
    
    itemEl.innerHTML = `
      <div class="vehicle-type">${item.type}</div> 
      <div class="vehicle-id">${item.licensePlateNumber}</div>`
    // console.warn('itemEl', itemEl)
    // const idEl = itemEl.querySelector('.vehicle-id')
    // const typeEl = itemEl.querySelector('.vehicle-type')
    
    // idEl.textContent = item.licensePlateNumber
    // typeEl.textContent = item.type
    
    listEl.append(itemEl)
  });
};

const buildParkingLot = (svg, grid = []) => {
  const scene = svg.querySelector('#scene');
  
  vehicleList.innerHTML = '';
  scene.innerHTML = '';
  
  
  const listMap = new Map()
  
  
  grid.forEach((row, y) => {
    row.forEach((space, x) => {
      if (space) {
        listMap.set(space.licensePlateNumber, space)
      }

      const spaceEl = useTemplate('parking-space', {
        dataset: {
          licensePlateNumber: space?.licensePlateNumber ?? '',
          y,
          x,
          occupiedBy: space?.licensePlateNumber ?? '',
          occupied: space ? true : false
        }
      }, true);
      
      const textEl = spaceEl.querySelector('text');
      textEl.textContent = space?.licensePlateNumber ? space.licensePlateNumber.slice(-3) : `${x},${y}`;
      
      spaceEl.setAttribute('transform', `translate(${x},${y}) scale(0.5) rotate(0)`);
      scene.append(spaceEl);
    });
  });
  
  buildList(vehicleList, [...listMap.values()])
};

buildParkingLot(svgCanvas, parkingLot.parkingSpaces)

parkCarButton.addEventListener('click', e => {
  parkingLot.park({ licensePlateNumber: '394jr9' + Math.round((Math.random() * 394)), size: 1, type: 'car' })
  buildParkingLot(svgCanvas, parkingLot.parkingSpaces)
  vehicleList.lastElementChild.scrollIntoView({ behavior: 'smooth' })
});



parkBusButton.addEventListener('click', e => {
  parkingLot.park({ licensePlateNumber: '394jr9' + Math.round((Math.random() * 284)), size: 3, type: 'bus' })
  buildParkingLot(svgCanvas, parkingLot.parkingSpaces)
  vehicleList.lastElementChild.scrollIntoView({ behavior: 'smooth' })
  
});

vehicleList.addEventListener('click', e => {
  const target = e.target.closest('.vehicle-list-item');
  
  if (target) {
    const id = target.dataset.licensePlateNumber;
    const unparkedCar = parkingLot.retrieve(id);
    
    buildParkingLot(svgCanvas, parkingLot.parkingSpaces)
    vehicleList.firstElementChild.scrollIntoView({ behavior: 'smooth' })
  }
  
  
});