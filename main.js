import { ParkingLot } from './ParkingLot.js';
import { useTemplate } from './utils.js';
const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const svgCanvas = document.querySelector('#svg-canvas')
const vehicleList = document.querySelector('#vehicle-list')

const parkCarButton = document.querySelector('#park-car-button')
const parkBusButton = document.querySelector('#park-bus-button')

const parkingLot = new ParkingLot(10, 10)

let workerMan = new window.Worker('workerman.js');

let isPaused = false
let bgString = ''

window.parkingLot = parkingLot
// workerMan.onmessage = (e) => {
//   if (isPaused) return;
//   bgString = `${e.data.bgString.trim()}`;
//   app.style.background = bgString
//   app.style.filter = e.data.invert
// }


const buildList = (listEl, items) => {
  items.forEach((item, i) => {
    const id = item?.licensePlateNumber;
    
    
    const itemEl = document.createElement('li');
    itemEl.classList.add('vehicle-list-item');
    Object.assign(itemEl.dataset, item);
    
    itemEl.innerHTML = `
      <div class="vehicle-type">${item?.type}</div> 
      <div class="vehicle-id">${item?.licensePlateNumber}</div>`
    
    listEl.append(itemEl);
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
        listMap.set(space?.licensePlateNumber, space)
      }
      console.warn('space', space)
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
      textEl.textContent = space?.licensePlateNumber ? space?.licensePlateNumber.slice(-3) : `${x},${y}`;
      
      spaceEl.setAttribute('transform', `translate(${x},${y}) scale(0.5) rotate(0)`);
      scene.append(spaceEl);
    });
  });
  
  buildList(vehicleList, [...listMap.values()])
};

buildParkingLot(svgCanvas, parkingLot.parkingSpaces)

let isBusy = false;
const parkCartTimes = [];

parkCarButton.addEventListener('click', e => {
  let rando = Math.round((Math.random() * 394))
  rando = rando < 100 ? `0${rando}` : `${rando}`
  
  parkingLot.park({ licensePlateNumber: 'C00' + rando, size: 1, type: 'car' })
  buildParkingLot(svgCanvas, parkingLot.parkingSpaces)
});

// appBody.addEventListener('contextmenu', async (e) => {
//   await navigator.clipboard.writeText(JSON.stringify(parkCartTimes, null, 2))
// });

parkBusButton.addEventListener('click', e => {
  let rando = Math.round((Math.random() * 394));
  
  rando = rando < 100 ? `0${rando}` : `${rando}`;
  
  parkingLot.park({ licensePlateNumber: 'B00' + rando, size: 3, type: 'bus' });
  buildParkingLot(svgCanvas, parkingLot.parkingSpaces);
  vehicleList.lastElementChild.scrollIntoView({ behavior: 'smooth' });
  
});

vehicleList.addEventListener('click', e => {
  if (isBusy) return;
  
  const start = performance.now();
  isBusy = true;
  
  const target = e.target.closest('.vehicle-list-item');
  
  if (target) {
    const id = target.dataset.licensePlateNumber;
    
    const unparkedCar = parkingLot.retrieve(id);
    buildParkingLot(svgCanvas, parkingLot.parkingSpaces);
  }
  
  isBusy = false;
  
  const end = performance.now()
  parkCartTimes.push(end - start);
});


document.addEventListener('click', e => {
  const infoBoxes = document.querySelectorAll('.info-box')
  
  infoBoxes.forEach((b, i) => {
    b.remove();
  });
})

svgCanvas.addEventListener('click', e => {
  e.stopPropagation()
  
  const infoBoxes = document.querySelectorAll('.info-box')
  
  infoBoxes.forEach((b, i) => {
    b.remove();
  });
  
  
  const tile = e.target.closest('g.parking-space')
  
  if (!tile || !tile.dataset.licensePlateNumber) return;
  
  const infoBox = document.createElement('div');
  infoBox.classList.add('info-box')
  infoBox.style.position = 'absolute';
  infoBox.style.transform = `translate(${e.clientX-0}px,${e.clientY-50}px)`;
  infoBox.textContent = `License Plate: \n${tile.dataset.licensePlateNumber}`
  appBody.appendChild(infoBox)
});