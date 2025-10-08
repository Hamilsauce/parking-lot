const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const randomButton = document.querySelector('#random-button')


let workerMan = new window.Worker('workerman.js');

let isPaused = false
let bgString = ''

workerMan.onmessage = (e) => {
  if (isPaused) return;
  bgString = `${e.data.bgString.trim()}`;
  app.style.background = bgString
  app.style.filter = e.data.invert
}

randomButton.addEventListener('click', e => {
isPaused = !isPaused;
  console.log(
    // 'click', randy
  )
  console.log('bgString', bgString)
  
  // workerMan.postMessage()
});