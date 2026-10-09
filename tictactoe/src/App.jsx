import { useState } from 'react';

function Square({value, onSquareClick, isWinning}){
  return <button 
  className={isWinning ? "square winning-square" : "square"} //if there is a winner highlight boxes
  onClick={onSquareClick}>{value}</button>
}

function Board({xIsNext, squares, onPlay}) {

  function handleClick(i){
    if (squares[i] || calculateWinner(squares)){
      return;
    }
    const nextSquares = squares.slice();
    xIsNext ? nextSquares[i] = "X" : nextSquares[i] = "O";
    onPlay(nextSquares);
  }

  const result = calculateWinner(squares);
  let status;
  if(result){
    status = "Winner: " + result.winner;
  }
  else if (squares.every((square) => square !== null)){//if every square is full, and no winner, draw
    status = "The game is a draw!";
  }
  else {
    status = "Next play: " + (xIsNext ? "X" : "O");
  }
  return (  
  <>
    <div className="status">
      {status}
    </div>
    {Array(3).fill(null).map((_, row) => (//first loop
      <div className="board-row" key={row}>
        {Array(3).fill(null).map((_,col) => {//second loop
          const i = row * 3 + col;
          return(
            <Square key={i} value={squares[i]} onSquareClick={()=> handleClick(i)}
            isWinning={result ? result.line.includes(i) : false}/>
          );
        })}
      </div> 
    ))}
  </>);
}

function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);

  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    let location = "";

    if (move > 0){
      description = "Go to move #" + move;
      const previousSquares = history[move - 1];
      const changedIndex = squares.findIndex(
        (square, i) => square !== previousSquares[i]
      );

      const row = Math.floor(changedIndex / 3) + 1;//find row
      const col = (changedIndex % 3) + 1;//find col

      location = `(${row}, ${col})`;
    }
    else {
      description = "Go to game start";
    }
    return{move, description, location};
  });

  const displayedMoves = isAscending ? moves.slice() : moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}>
          sort {isAscending ? "descending" : "ascending"}
        </button>
        <ol>
          {displayedMoves.map(({move, description, location}) => (
            <li key={move}>{move === currentMove ? (
              `You are at move #${move}`
            ) : (<button onClick={() => jumpTo(move)}>
              {description}{location}
            </button>
          )}
          </li>
        ))}
        </ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let i = 0; i < lines.length; i++){
    const [a,b,c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return {winner: squares[a], line: lines[i].slice()};
    }
  }
  return null;
}

export default function App(){
  return<Game />
}