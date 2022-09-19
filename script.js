//DOMContentLoaded-fires only after the full HTML is loaded and paused without waithing for css,img... to finish loading

document.addEventListener("DOMContentLoaded", () => {
  const scoreCount = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const body = document.body;
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div")); // Change the collection into an array //querySelector All gives htmlcollection which can be accessed by index starting 0,it returns static nodelist which means new element added will not cbe added but in contrast The getElementsByClassName() and getElementsByTagName() methods return a live HTMLCollection
  const container = document.querySelector(".container");
  const players = document.querySelector(".players");
  const linesclear = document.querySelector("#line");
  const rightBoard = document.querySelector(".right-side-board");
  const currentPlayer = document.querySelector(".currentplayer");
  const submitButton = document.querySelector("#submit");
  const cpspan = document.querySelector("#cp");
  const scoreBoard = document.querySelector('.score-board')
  const restart = document.querySelector('#re')
  let timeoutValue = 60000
  ////////////////////////////////////////////////////////

  let gamer1 = { id: 1, name: "player1", score: 0 };
  let gamer2 = { id: 2, name: "player2", score: 0 };
  let currentGamer = gamer1;
  const width = 10;
  let timer = null;
  let score = 0;
  let linescleared = 0;
  let gameTime = null;
  const colors = [
    "#FF0D72",
    "#0DC2FF",
    "#0DFF72",
    "#F538FF",
    "#FF8E0D",
    "#FFE138",
    "#3877FF",
  ];
  //The Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, 1, width + 1, width + 2],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [2, width + 2, width + 1, width * 2 + 1],
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

  let random = 0;
  let nextRandom = 0;
  let currentPosition = 4;
  let currentRotation = 0; //choose first shape from the array from each theTetrominos array
  let currentTetromino = theTetrominoes[0][0];
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  grid.style.visibility = "hidden";
  rightBoard.style.visibility = "hidden";
  currentPlayer.style.visibility = "hidden";
  scoreBoard.style.visibility = "hidden";
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  submitButton.addEventListener("click", () => {
    players.style.visibility = "hidden";
    const player1Val = document.querySelector("#player1name").value;
    const player2Val = document.querySelector("#player2name").value;
    // assign player names
    if (player1Val) {
      gamer1.name = player1Val;
    }
    if (player2Val) {
      gamer2.name = player2Val;
    }
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Adding click event to start/pause button
  startBtn.addEventListener("click", () => {
    gameTime = setTimeout(() => {
      timeout();
    }, 60000);

    grid.style.visibility = "visible";
    rightBoard.style.visibility = "visible";
    currentPlayer.style.visibility = "visible";
    scoreBoard.style.visibility = "visible";
    cpspan.innerText = `${currentGamer.name}`;

    if (timer) {
      // if timer= true,
      clearInterval(timer); //then clear timer
      timer = null; //reassign timer=false
    } else {
      draw();
      timer = setInterval(moveDown, 1000); // initialize timer
      displayNext();
    }
  });
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // function flashMessageEvent(){
  // const flashMessage = document.createElement("div");
  // const message = document.createElement("h1");
  // message.innerText = `${gamer1.name}'s turn`;
  // flashMessage.appendChild(message);
  // flashMessage.classList.add("flashMessage");
  // body.appendChild(flashMessage);

  // setTimeout(() => flashMessage.remove(),2000);
  // }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    console.log(`cp ${currentPosition}`);
    console.log(currentTetromino);
    currentTetromino.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Undraw Tetrominoe:
  function unDraw() {
    currentTetromino.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = "";
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
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);

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
      currentTetromino.forEach((index) =>
        squares[currentPosition + index].classList.add("bottom")
      );
      //Start a new tetromino falling:
      startNewTetromino();
      updateScore();
      gameOver();
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Setting boundary for left side
  //tetromino can move left side( currentPosition -=1) as long as any one square doesnt have class "left"
  function moveLeft() {
    unDraw();
    const isLeftEdge = currentTetromino.some(
      (index) => (currentPosition + index) % width === 0
    );
    if (!isLeftEdge) currentPosition -= 1;
    if (
      currentTetromino.some((index) =>
        squares[currentPosition + index].classList.contains("bottom")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function moveRight() {
    unDraw();
    const isRightEdge = currentTetromino.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    if (!isRightEdge) currentPosition += 1;
    if (
      currentTetromino.some((index) =>
        squares[currentPosition + index].classList.contains("bottom")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function rotate() {
    let tempTet;
    currentRotation++;
    if (currentRotation == currentTetromino.length) {
      currentRotation = 0;
    }
    tempTet = theTetrominoes[random][currentRotation];
    // check if it collides with already freezed one,in left or in right edge:
    const isCollideFreeze = tempTet.some((index) =>
      squares[currentPosition + index].classList.contains("bottom")
    );
    const isCollideLeft = tempTet.some(
      (index) => (currentPosition + index) % width === 0
    );
    const isCollideRight = tempTet.some(
      (index) => (currentPosition + index) % width === width - 1
    );

    if (!isCollideFreeze && !(isCollideLeft && isCollideRight)) {
      unDraw();
      currentTetromino = tempTet;
      draw();
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
      square.style.backgroundColor = "";
    });
    // console.log(nextRandom)
    nextTetrominoes[nextRandom].forEach((index) => {
      miniSquares[miniCurrentPosition + index].classList.add("tetromino");
      miniSquares[miniCurrentPosition + index].style.backgroundColor =
        colors[nextRandom];
    });
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function updateScore() {
    // const removedItems = [];
    for (let i = 0; i < 199; i += width) {
      const eachRow = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ]; //checking row by row
      if (
        eachRow.every((index) => squares[index].classList.contains("bottom"))
      ) {
        //if all the index in a row has class "bottom"
        console.log(`${eachRow}`);
        score += 5; //increase score
        linescleared++;
        scoreCount.textContent = score;
        linesclear.textContent = linescleared;
        currentGamer.score = score;
        /////////////////////////////

        eachRow.forEach((index) => {
          squares[index].classList.remove("bottom"); //remove class "bottom" "tetromino" in that row
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });

        const removedRow = squares.splice(i, width); // remove the row by splicing
        console.log(`removedRow${removedRow}`);
        squares = removedRow.concat(squares);
        // console.log(squares)
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }
  function gameOver() {
    if (
      currentTetromino.some((index) =>
        squares[currentPosition + index].classList.contains("bottom")
      )
    ) {
      clearInterval(timer);
      unDraw();
      timer = null;
      const gameover = document.createElement("button");
      gameover.classList.add("game-over");
      gameover.innerText = "GAME OVER";
      body.appendChild(gameover);
      console.log(gameover);


      gameover.addEventListener("click", () => {
        gameDiv = document.querySelector('.game-over')
        console.log(gameDiv)
        gameDiv.style.visibility = "hidden";
        if(gameDiv){
          gameDiv.remove()
        }
        decideGamer2orWinner()
      });
    }
  }

  ///////////////////////////////////////////////////////

  // function gameOver(){
  //   let i=0
  //   const firstRow = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9,i+10,i+11,i+12,i+13,i+14,i+15,i+16,i+17,i+18,i+19]
  //   if (firstRow.some((index) => squares[index].classList.contains("bottom"))){
  //   clearInterval(timer)
  //   unDraw()
  //   timer=false
  //   const body =document.body

  //////////////////////////////////////////////////////
  function timeout() {
    if (gameTime) {
      clearTimeout(gameTime);
      gameTime = null;
    }
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    const timeUp = document.createElement("button");
    timeUp.classList.add("timeup");
    timeUp.innerText = "Time Up!";
    body.appendChild(timeUp);
    timeUp.addEventListener("click", () => {
      timeUp.style.visibility = "hidden";
   decideGamer2orWinner()

    });
  } /////////////////////////////////////////////////////////////////////////////////////////////////////

  function decideGamer2orWinner(){
  
    if (currentGamer.id == 1) {
      //if player one this block executes else go to find who is winner
      const player2start = document.createElement("button");
      player2start.classList.add("player2start");
      player2start.innerText = `${gamer2.name} Start`;
      body.appendChild(player2start);
     

    
      let getplayer2start = document.querySelector(".player2start");
      getplayer2start.addEventListener("click", () => {
        player2start.style.visibility = "hidden";
      
        linescleared =0 
        score =0
        scoreCount.textContent = score;
        linesclear.textContent = linescleared;
        random = 0;
        nextRandom = 0;
        currentPosition = 4;
        currentRotation = 0; 
        currentGamer = gamer2;
        gameTime = setTimeout(() => {
          timeout();
        }, 60000);
  
        grid.style.visibility = "visible";
        rightBoard.style.visibility = "visible";
        cpspan.innerText = `${currentGamer.name}`;
        
        squares = Array.from(document.querySelectorAll(".grid div"));
        for (let i = 0; i < 200; i++) {
          squares[i].classList.remove("bottom");
          squares[i].classList.remove("tetromino");
            squares[i].style.backgroundColor = "";
        }
  
        /////////////
        miniSquares = document.querySelectorAll(".mini-grid div");
        for (let i = 0; i < 16; i++) {
          if (miniSquares[i].classList.contains("tetromino")) {
            miniSquares[i].classList.remove("tetromino");
            miniSquares[i].style.backgroundColor = "";
          }
        }
    
        currentTetromino = theTetrominoes[0][0];
        draw();
        timer = setInterval(moveDown, 1000); // initialize timer
        displayNext();
      });
    } else {
     

      const winnerEle = document.createElement("button");
      winnerEle.classList.add("winner");
      let txt = document.createElement("h1");
      let win;
      if (gamer1.score > gamer2.score) {
        win = gamer1.name;
      } else if (gamer1.score === gamer2.score) {
        win = "Tie";
      } else {
        win = gamer2.name;
      }
      txt.innerText = `winner-${win} `;
      winnerEle.appendChild(txt);
      body.appendChild(winnerEle);
      // winnerEle.addEventListener('click',()=>{
      //   winnerEle.style.visibility = 'hidden'
      //   const reStart= document.createElement("button");
      //   reStart.classList.add("restart");
      //   reStart.innerText = "ReStart!";
      //   body.appendChild(reStart);
      //   reStart.addEventListener('click',()=>{
      //     location.reload()
      //   })
      // })
    
    }

  }

restart.addEventListener('click',()=>{
  location.reload()
})



});