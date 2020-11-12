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
  constructor(props){
    super(props);//继承父类
    // state对于每个组件来说是私有的，不能直接被其他组件获得
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    }
  }

  // 处理点击事件的监听方法
  handleClick(i){
    // 为什么需要创建一个副本，而不是直接修改现有的数组？【不可变性】
    /**
     * 1. 简化复杂的功能：方便追溯并复用旧数据
     * 2. 跟踪数据改变
     * 3. 方便确定在React中何时重新渲染
     */
    const squares = this.state.squares.slice();

    if (calculateWinner(squares) || squares[i]){
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  // 渲染子组件
  renderSquare(i) {
    return <Square 
    value={this.state.squares[i]}
    onClick={() => this.handleClick(i)} />;
  }

  render(){
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner){
      status = 'Winner: ' + winner;
    }else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
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
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board/>
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
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
