//DOMContentLoaded-fires only after the full HTML is loaded and paused without waithing for css,img... to finish loading

document.addEventListener("DOMContentLoaded", () => {
  const scoreBoard = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");

  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div")); // Change the collection into an array //querySelector All gives htmlcollection which can be accessed by index starting 0,it returns static nodelist which means new element added will not cbe added but in contrast The getElementsByClassName() and getElementsByTagName() methods return a live HTMLCollection
  // console.log(squares)

  const width = 10;
  let timer = false;
  let score = 0;
  const colors = ['#FF0D72',
  '#0DC2FF',
  '#0DFF72',
  '#F538FF',
  '#FF8E0D',
  '#FFE138',
  '#3877FF',
];
  //The Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0,1,width+1,width+2],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [2,width+2,width+1,width*2+1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  // Make starting position of tetris in middle (index 5)
  let random = 0
  let nextRandom = 0;
  let currentPosition = 4;
  let currentRotation = 0; //choose first shape from the array from each theTetrominos array
  let currentTetromino = theTetrominoes[0][0];
  //choose random tetromino
  // let random = Math.floor(Math.random() * theTetrominoes.length);
  // let currentTetromino = theTetrominoes[random][currentRotation];
  // console.log(currentTetromino);
  // let currentTetromino = theTetrominoes[0][0];
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Adding click event to start/pause button
  startBtn.addEventListener("click", () => {
    
    if (timer) {
      // if timer= true,
      clearInterval(timer); //then clear timer
      timer = false; //reassign timer=false
    } else {
      draw();
      timer = setInterval(moveDown, 1000); // initialize timer
      // nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayNext();
    }
  });//////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Adding Event Listener to ArrowKeys:
  //KeyCodes: left move=37 , rightmove=39 , movedown=40, moveup=38
  document.addEventListener("keyup", arrowKeys);
  //Adding event listener to arrowkey.The keyup event is fired when a key is released
  function arrowKeys(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Draw Tetrominoe:
  function draw() {
    
    console.log(`cp ${currentPosition}`)
    console.log(currentTetromino)
    currentTetromino.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition+ index].style.backgroundColor = colors[random];   
    });
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Undraw Tetrominoe:
  function unDraw() {
    currentTetromino.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition+ index].style.backgroundColor = '';
    });
  }
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Move the currentTetrominoe down by one square each time. we are using setInterval method to invoke a function in specified time interval
  //use a variable to assign the timer so that we can remove it later
  // timer=setInterval(moveDown,1000) //moveDown function is called continously in specified time interval
  function moveDown() {
    unDraw(); //First undraw the currentTetromino from its currentPosition
    currentPosition += width; // move down by changing currentPosition(4) to 14 by adding 10 to it
    console.log(currentPosition);
    draw(); // now draw again after moving down one time
    freeze();
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Freeze currentTetromino once it reaaches bottom:
  //Add 10 more divs with class"bottom" at the end of grid in HTML

    // Start a new tetromino falling
    function startNewTetromino() {
      //  Randomly select a tetromino and its rotation
      random = nextRandom;
      nextRandom = Math.floor(Math.random()*theTetrominoes.length);
     
      currentTetromino = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      
      draw();
      displayNext();
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function freeze() {
    //check if any(some) of the squares in currentTetromino contains class bottom. add class "bottom to all the index of current tetromino"
    //Start with next new tetromino
    if (
      currentTetromino.some((index) =>
        squares[currentPosition + index + width].classList.contains("bottom")
      )
    ) {
      console.log(`Reached bottom add bottom`)
      currentTetromino.forEach((index) =>
        squares[currentPosition + index].classList.add("bottom")
      );
      console.log(`added cls bottom to ${currentTetromino}`)
      console.log(`added cls bottom to ${currentPosition}`)
      //Start a new tetromino falling:
      startNewTetromino()
      updateScore();
      gameOver()
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Setting boundary for left side
  //tetromino can move left side( currentPosition -=1) as long as any one square doesnt have class "left"
  function moveLeft() {
    unDraw()
    const isLeftEdge = currentTetromino.some(index => (currentPosition + index) % width === 0)
    if(!isLeftEdge) currentPosition -=1
    if(currentTetromino.some(index => squares[currentPosition + index].classList.contains('bottom'))) {
      currentPosition +=1
    }
    draw()
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function moveRight() {
    unDraw()
    const isRightEdge = currentTetromino.some(index => (currentPosition + index) % width === (width -1))
    if(!isRightEdge) currentPosition +=1
    if(currentTetromino.some(index => squares[currentPosition + index].classList.contains('bottom'))) {
      currentPosition -=1
    }
    draw()
  }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
 function rotate(){
  let tempTet;
  currentRotation++
  if(currentRotation == currentTetromino.length){
    currentRotation = 0
  }
  tempTet =  theTetrominoes[random][currentRotation]
  // check if it collides with already freezed one,in left or in right edge:
  const isCollideFreeze = tempTet.some(index=>squares[currentPosition+index].classList.contains("bottom"))
  const isCollideLeft = tempTet.some(index=>(currentPosition+index)%width === 0)
  const isCollideRight =  tempTet.some(index=>(currentPosition+index)%width === (width-1))

  if(!isCollideFreeze && !(isCollideLeft&&isCollideRight)){
    unDraw()
    currentTetromino=tempTet
    draw()
  }
 }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //     // Display Next Tetromino:
  let miniSquares = document.querySelectorAll(".mini-grid div");
  let miniWidth = 4;
  let miniCurrentPosition = 0;

  //Each Tetrominos without rotations
  const nextTetrominoes = [
    [1, miniWidth + 1, miniWidth * 2 + 1, 2], //lTetromino
    [0, miniWidth, miniWidth + 1, miniWidth * 2 + 1], //zTetromino
    [1, miniWidth, miniWidth + 1, miniWidth + 2], //tTetromino
    [0, 1, miniWidth, miniWidth + 1], //oTetromino
    [1, miniWidth + 1, miniWidth * 2 + 1, miniWidth * 3 + 1], //iTetromino
  ];

  function displayNext() {
    miniSquares.forEach((square) => {
      square.classList.remove("tetromino"); // clear the display board if any tetromino is present
      square.style.backgroundColor = ""
    });
    // console.log(nextRandom)
    nextTetrominoes[nextRandom].forEach((index) => {
      miniSquares[miniCurrentPosition + index].classList.add("tetromino");
      miniSquares[miniCurrentPosition + index].style.backgroundColor = colors[nextRandom];
    
    });
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function updateScore() {
    // const removedItems = [];
    for (let i = 0; i < 199; i += width) {
      const eachRow = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]//checking row by row
      if (
        eachRow.every((index) => squares[index].classList.contains("bottom"))) {//if all the index in a row has class "bottom"
          console.log(`${eachRow}`)
        score += 5; //increase score
        scoreBoard.innerHTML = score;
       eachRow.forEach((index) => {
          squares[index].classList.remove("bottom"); //remove class "bottom" "tetromino" in that row
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });
       
        const removedRow = squares.splice(i, width); // remove the row by splicing
        console.log(`removedRow${removedRow}`)
        squares = removedRow.concat(squares);
          // console.log(squares)
        squares.forEach(cell => grid.appendChild(cell));  
      }
    }
   
  }
function gameOver(){

    if (currentTetromino.some(index=> squares[currentPosition+index].classList.contains('bottom'))){
      console.log(`gameover`)
      clearInterval(timer)
      unDraw()
      timer=false
      const body =document.getElementsByTagName('body')
      const gameover = document.createElement("div")
      gameover.classList.add('game-over')
      let h1txt = document.createElement("h1");
      h1txt.innerText="GAME OVER"
      gameover.appendChild(h1txt)
      gameover.append(body)

  }
}




//////////////////////////////////////////////////////

});
