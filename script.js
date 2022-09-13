    //DOMContentLoaded-fires only after the full HTML is loaded and paused without waithing for css,img... to finish loading

    document.addEventListener('DOMContentLoaded',()=>{
    const score= document.querySelector('#score')
    const startBtn=document.querySelector('#start-button')

    const grid= document.querySelector('.grid')
    const squares = Array.from(document.querySelectorAll('.grid div'))// Change the collection into an array //querySelector All gives htmlcollection which can be accessed by index starting 0,it returns static nodelist which means new element added will not cbe added but in contrast The getElementsByClassName() and getElementsByTagName() methods return a live HTMLCollection
    // console.log(squares)

    const width=10;
 //The Tetrominoes
 const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
 
// Make starting position of tetris in middle (index 5)
let currentPosition = 4 
let currentRotation = 0//choose first shape from the array from each theTetrominos
//choose random tetromino
let random = Math.floor(Math.random()*theTetrominoes.length)
let currentTetromino = theTetrominoes[random][currentRotation]
console.log(currentTetromino)
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Draw Tetrominoe:
draw()
function draw(){
    currentTetromino.forEach((index)=>{
        squares[currentPosition+index].classList.add('tetromino')
    })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Undraw Tetrominoe:
function unDraw(){
    currentTetromino.forEach((index)=>{
        squares[currentPosition+index].classList.remove('tetromino')
    })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Move the currentTetrominoe down by one square each time. we are using setInterval method to invoke a function every 1sec
 //use a variable to assign the timer so that we can remove it later
 timer=setInterval(moveDown,300) //moveDown function is called every 1 sec
 //////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Adding Event Listener to ArrowKeys:
//KeyCodes: left move=37 , rightmove=39 , movedown=40, moveup=38
function arrowKeys(e){
    if(e.keyCode === 37){
        leftBoundary()
    }else if(e.keyCode === 39){
        rightBoundary()
    }
}
//Adding event listener to arrowkey.The keyup event is fired when a key is released
document.addEventListener('keyup',arrowKeys)


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
function moveDown(){
    unDraw()//First undraw the currentTetromino from its currentPosition
    currentPosition +=width // move down by changing currentPosition(4) to 14 by adding 10 to it
    console.log(currentPosition)
    draw() // now draw again after moving down one time
    freeze()
  
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Freeze currentTetromino once it reaaches bottom:
//Add 10 more divs with class"bottom" at the end of grid in HTML

function freeze(){
    //check if any(some) of the squares in currentTetromino contains class bottom.
    //  if reaches bottom it should freeze so have to clear the timer for movedown function so it doesnt move down further.
if(currentTetromino.some(index=> squares[currentPosition +index+width].classList.contains('bottom'))){
    currentTetromino.forEach(index=>squares[currentPosition +index].classList.add('bottom'))
    clearInterval(timer)
    //Start a new tetromino falling:
    nextRandom = Math.floor(Math.random()*theTetrominoes.length)
    currentTetromino = theTetrominoes[nextRandom][currentRotation]
    currentPosition = 4
    draw()
    timer=setInterval(moveDown,300)
} 
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Setting boundary for left side
//tetromino can move left side( currentPosition -=1) as long as any one square doesnt have class left
function leftBoundary(){
unDraw()
let isLeft = currentTetromino.some(index=> squares[currentPosition +index+width].classList.contains('left'))
if(!isLeft) {
    currentPosition -=1
}
if(currentTetromino.some(index=> squares[currentPosition +index+width].classList.contains('bottom'))){
    currentPosition +=1
}
draw()
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function rightBoundary(){
    unDraw()
    let isright = currentTetromino.some(index=> squares[currentPosition +index+width].classList.contains('right'))
    if(!isright) {
        currentPosition +=1
    }
    if(currentTetromino.some(index=> squares[currentPosition +index+width].classList.contains('bottom'))){
        currentPosition -=1
    }
    draw()
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////




})