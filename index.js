const container = document.createElement('div');
container.classList.add('container');
const reloadBtn = document.createElement('button');
reloadBtn.classList.add('reload');
reloadBtn.innerText = '重新开始';
reloadBtn.addEventListener('click', reload);
const noDeathButton = document.createElement('button');
noDeathButton.classList.add('noDeath');
noDeathButton.innerText = '穿越墙体'
noDeathButton.addEventListener('click', togglerNoDeath);
const scene = document.createElement('div');
scene.classList.add('scene');
scene.appendChild(reloadBtn);
scene.appendChild(noDeathButton);
const snake = document.createElement('div');
snake.classList.add('player');
const attr = {
  creazEat: false,
  size: 1,
  step: 10,
  x: 0,
  y: 0,
  body: [],
  direction: 'ArrowRight',
  directionKey: {
    ArrowUp: ['y', -1],
    ArrowRight: ['x', 1],
    ArrowDown: ['y', 1],
    ArrowLeft: ['x', -1]
  },
  keys: {x: 'left', y: 'top'},
  food: document.createElement('div'),
  foodPosition: getRandomPosition(),
  noDeath: false
}
attr.food.classList.add('food');
attr.food.style.left = attr.foodPosition.x + 'px';
attr.food.style.top = attr.foodPosition.y + 'px';
scene.appendChild(snake);
scene.appendChild(attr.food);
container.appendChild(scene);
document.body.appendChild(container);
function gameLoop(){
  const {directionKey, direction, step,keys} = attr;
  const [dirt, base] = directionKey[direction];
  const snakePrevPosition = {x: attr.x, y: attr.y};
  const mockNext = {...snakePrevPosition};
  mockNext[dirt] += step*base;
  if(death(mockNext)) return;
  if(!attr.noDeath)attr[dirt] += step*base;
  snake.style[keys[dirt]] = attr[dirt] + 'px';
  eat();
  bodyMove(snakePrevPosition);
}
const dirKey = Object.keys(attr.directionKey);
let timer = setInterval(gameLoop, 300);
const disabledKyes = {
  ArrowUp: 'ArrowDown',
  ArrowDown: 'ArrowUp',
  ArrowRight: 'ArrowLeft',
  ArrowLeft: 'ArrowRight'
}
window.addEventListener('keydown', e => {
  if(!dirKey.includes(e.key) || (disabledKyes[e.key] === attr.direction && attr.body.length)) return;
  attr.direction = e.key;
  clearInterval(timer)
  gameLoop();
  timer = setInterval(gameLoop, 300);
})
function getRandomPosition(){
  const x = Math.floor(Math.random()*490/10)*10;
  const y = Math.floor(Math.random()*490/10)*10;
  return {x, y}
}
function eat(){
  const {x, y, foodPosition: {x: _x, y: _y}} = attr;
  console.log(x !== _x || y !== _y);
  if(!attr.creazEat && (x !== _x || y !== _y)) return;
  attr.foodPosition = getRandomPosition();
  attr.food.style.left = attr.foodPosition.x + 'px';
  attr.food.style.top = attr.foodPosition.y + 'px';
  const body = document.createElement('div');
  body.classList.add('body');
  attr.body.push({body, dir: attr.direction, position: {}});
  scene.appendChild(body);
}
function bodyMove({x, y}){
  if(!attr.body.length)return;
  attr.body[0].body.style.left = x + 'px';
  attr.body[0].body.style.top = y + 'px';
  for(let i = 1; i < attr.body.length; i++) {
    attr.body[i].body.style.left = attr.body[i-1].position.x + 'px';
    attr.body[i].body.style.top = attr.body[i-1].position.y + 'px';
  };
  for(let i = attr.body.length-1; i > 0; i--) {
    attr.body[i].position = attr.body[i-1].position;
  }
  attr.body[0].position = {x, y};
}
function death(mockNext){
  if(attr.noDeath){
    if(mockNext.x > 490) mockNext.x = 0;
    if(mockNext.x < 0) mockNext.x = 490;
    if(mockNext.y > 490) mockNext.y = 0;
    if(mockNext.y < 0) mockNext.y = 490;
    if(!attr.body.length){Object.assign(attr, mockNext); return; }
    
  }else {
    if(mockNext.x > 490 || mockNext.x < 0) return true;
    if(mockNext.y > 490 || mockNext.y < 0) return true;
  }
  
  const bodys = attr.body.map(body => body.position);
  let isBody = bodys.filter(p => p.x === mockNext.x && p.y === mockNext.y);
  if(attr.noDeath && !isBody.length) Object.assign(attr, mockNext);
  return isBody.length > 0;
}

function reload(){
  attr.body.map(body => body.body.remove());
  Object.assign(attr, {
    creazEat: false,
    size: 1,
    step: 10,
    x: 0,
    y: 0,
    body: [],
    direction: 'ArrowRight',
    directionKey: {
      ArrowUp: ['y', -1],
      ArrowRight: ['x', 1],
      ArrowDown: ['y', 1],
      ArrowLeft: ['x', -1]
    },
    keys: {x: 'left', y: 'top'},
    foodPosition: getRandomPosition()
  });
  snake.style.left = attr.x + 'px';
  snake.style.top = attr.y + 'px';
  attr.foodPosition = getRandomPosition();
  attr.food.style.left = attr.foodPosition.x + 'px';
  attr.food.style.top = attr.foodPosition.y + 'px';
}

function togglerNoDeath(){
  attr.noDeath = !attr.noDeath;
  noDeathButton.classList.toggle('active');
}