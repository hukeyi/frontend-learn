import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 棋盘格子：受控组件
// 当一个组件只包含render方法，并不包含state，就可以将它改写为函数组件
// class Square extends React.Component {
//   render(){
//     return (
//       <button 
//       className="square" 
//       onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

// 棋盘格子类的函数组件形式
function Square(props){
  return (
    <button 
    className="square"
    // thinkme: 为什么这里就不是箭头函数了？
    onClick={props.onClick}>
      {props.value}
    </button>
  )
}

// 棋盘
class Board extends React.Component {
  // 渲染子组件
  renderSquare(i) {
    return <Square 
    value={this.props.squares[i]}
    onClick={() => this.props.onClick(i)} />;
  }

  render(){
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    )
  }
}

// 游戏类
class Game extends React.Component {
  constructor(props){
    super(props);//继承父类
    // state对于每个组件来说是私有的，不能直接被其他组件获得
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        cordinate: {col: null, row: null},
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  // 处理点击事件的监听方法
  handleClick(i){
    // 为什么需要创建一个副本，而不是直接修改现有的数组？【不可变性】
    /**
     * 1. 简化复杂的功能：方便追溯并复用旧数据：history
     * 2. 跟踪数据改变 ：history
     * 3. 方便确定在React中何时重新渲染
     */
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1]; //最近一次历史
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]){
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const match_row = [1, 1, 1, 2, 2, 2, 3, 3, 3];
    const match_col = [1, 2, 3, 1, 2, 3, 1, 2, 3];
    this.setState({
      history: history.concat([{
        squares: squares,
        cordinate: {col: match_col[i], row: match_row[i]},
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      // console.log(step);
      const {col, row} = step.cordinate;
      const desc = move ? `Go to move #${move} | cordinate: (${col}, ${row})`
       : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner){
      status = 'Winner: ' + winner;
    }else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)

// 判定游戏胜出者
function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }
  return null;
}
