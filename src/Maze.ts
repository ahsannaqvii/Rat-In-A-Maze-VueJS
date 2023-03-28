// const CONSTANTS = require("./Constants");
const CONSTANTS = {
  ROW_SIZE: 4,
  COL_SIZE: 4,
}
interface MazeUI {
  DisplayMaze(maze: string[][]): string[][] ;
  PathNotFound(): boolean;
}

class ConsoleUI implements MazeUI {
  DisplayMaze(maze: string[][]): string[][] {
    return maze;
  }
  PathNotFound(): boolean {
    return false;
  }
}

//Context class to connect with the Strategy classes.
class Maze {
  mazeStrategy: IMazeStrategy;
  MazeBoard: string[][];
  startPosition: number[];
  endPosition: Array<number>;
  MazeUI: MazeUI;

  constructor() {
    this.MazeBoard = Array(CONSTANTS.ROW_SIZE)
      .fill(0)
      .map(() => Array(CONSTANTS.COL_SIZE).fill(0));
    this.MazeUI = new ConsoleUI();
  }

  //Function responsible to calculate the start and end coordinates
  calculateStartAndFinalPos() {
    this.startPosition = [
      Math.floor(Math.random() * CONSTANTS.ROW_SIZE),
      Math.floor(Math.random() * CONSTANTS.COL_SIZE),
    ];
    do {
      this.endPosition = [
        Math.floor(Math.random() * CONSTANTS.ROW_SIZE),
        Math.floor(Math.random() * CONSTANTS.COL_SIZE),
      ];
    } while (
      this.startPosition[0] === this.endPosition[0] &&
      this.startPosition[1] === this.endPosition[1]
    );
  }

  //Function responsible to mark the blocks, start and end.
  generateMaze(): string[][] {
    this.calculateStartAndFinalPos();
    for (let i = 0; i < CONSTANTS.ROW_SIZE; i++) {
      for (let j = 0; j < CONSTANTS.COL_SIZE; j++) {
        //Set the START position
        if (i === this.startPosition[0] && j === this.startPosition[1]) {
          this.MazeBoard[i][j] = "S";

          //Set the END position
        } else if (i === this.endPosition[0] && j === this.endPosition[1]) {
          this.MazeBoard[i][j] = "E";

          //Set the BLOCKS and EMPTY cells.
        } else {
          let blocks = Math.floor(Math.random() * 2);
          if (blocks % 2 === 0) {
            this.MazeBoard[i][j] = "B";
          } else {
            this.MazeBoard[i][j] = "O";
          }
        }
      }
    }
    return this.MazeBoard;
  }
  solveMazeBoard(): void {
    if (
      this.mazeStrategy.solveMaze(
        this.MazeBoard,
        this.startPosition,
        this.endPosition
      )
    ) {
      // return
      this.MazeUI.DisplayMaze(this.MazeBoard);
    } else {
      this.MazeUI.PathNotFound();
    }
  }

  setMazeStrategy(mazeStrategy: IMazeStrategy): void {
    this.mazeStrategy = mazeStrategy;
  }
}
interface IMazeStrategy {
  checkIfSafe(maze: string[][], row: number, col: number): boolean;

  //Utility function.
  MazeSolver(
    maze: string[][],
    row: number,
    col: number,
    startPos: number[],
    endPos: number[]
  ): boolean;

  //Main method to solve the Maze.
  solveMaze(maze: string[][], startPos: number[], endPos: number[]): boolean;
}

 class BFSMaze implements IMazeStrategy {
  checkIfSafe(maze: string[][], row: number, col: number): boolean {
    if (
      row >= 0 &&
      col >= 0 &&
      row < CONSTANTS.ROW_SIZE &&
      col < CONSTANTS.COL_SIZE &&
      (maze[row][col] === "O" ||
        maze[row][col] === "S" ||
        maze[row][col] === "E")
    ) {
      return true;
    }
    return false;
  }

  MazeSolver(
    maze: string[][],
    row: number,
    col: number,
    startPos: number[],
    endPos: number[]
  ): boolean {
    let Queue = [];
    let visited = Array(CONSTANTS.ROW_SIZE)
      .fill(0)
      .map(() => Array(CONSTANTS.COL_SIZE).fill(0));

    Queue.push(startPos);

    while (Queue.length > 0) {
      let currentIndex = Queue.shift();

      visited[currentIndex[0]][currentIndex[1]] = 1;
      if (
        maze[currentIndex[0]][currentIndex[1]] != "S" &&
        maze[currentIndex[0]][currentIndex[1]] != "E"
      ) {
        maze[currentIndex[0]][currentIndex[1]] = "V";
      }

      if (currentIndex[0] === endPos[0] && currentIndex[1] === endPos[1]) {
        return true;
      }
      if (
        this.checkIfSafe(maze, currentIndex[0] + 1, currentIndex[1]) == true &&
        visited[currentIndex[0] + 1][currentIndex[1]] == 0
      ) {
        Queue.push([currentIndex[0] + 1, currentIndex[1]]);
      }
      if (
        this.checkIfSafe(maze, currentIndex[0], currentIndex[1] + 1) == true &&
        visited[currentIndex[0]][currentIndex[1] + 1] == 0
      ) {
        Queue.push([currentIndex[0], currentIndex[1] + 1]);
      }
      if (
        this.checkIfSafe(maze, currentIndex[0] - 1, currentIndex[1]) == true &&
        visited[currentIndex[0] - 1][currentIndex[1]] == 0
      ) {
        Queue.push([currentIndex[0] - 1, currentIndex[1]]);
      }
      if (
        this.checkIfSafe(maze, currentIndex[0], currentIndex[1] - 1) == true &&
        visited[currentIndex[0]][currentIndex[1] - 1] == 0
      ) {
        Queue.push([currentIndex[0], currentIndex[1] - 1]);
      }
    }
    return false;
  }
  solveMaze(maze: string[][], startPos: number[], endPos: number[]): boolean {
    let res = this.MazeSolver(maze, null, null, startPos, endPos);
    if (res) {
      return true;
    }
    return false;
  }
}

 class BackTrackingMaze implements IMazeStrategy {
  checkIfSafe(maze: string[][], row: number, col: number): boolean {
    if (
      row >= 0 &&
      col >= 0 &&
      row < CONSTANTS.ROW_SIZE &&
      col < CONSTANTS.COL_SIZE &&
      (maze[row][col] === "O" || maze[row][col] === "S")
    ) {
      return true;
    }
    return false;
  }

  MazeSolver(
    maze: string[][],
    row: number,
    col: number,
    startPos: number[],
    endPos: number[]
  ): boolean {
    //Check if the end position has been reached.
    if (row === endPos[0] && col === endPos[1]) {
      return true;
    }
    if (this.checkIfSafe(maze, row, col) == true) {
      //Turn the block into a visited block.
      if (maze[row][col] != "S") {
        maze[row][col] = "V";
      }
      //Check if the bottom block is safe

      if (this.MazeSolver(maze, row + 1, col, startPos, endPos) == true) {
        return true;
      }

      //Check if the right block is safe

      if (this.MazeSolver(maze, row, col + 1, startPos, endPos) == true) {
        return true;
      }

      //Check if the upwards block is safe

      if (this.MazeSolver(maze, row - 1, col, startPos, endPos) == true) {
        return true;
      }
      //Check if the left block is safe
      if (this.MazeSolver(maze, row, col - 1, startPos, endPos) == true) {
        return true;
      }

      return false;
    }
    return false;
  }

  solveMaze(maze: string[][], startPos: number[], endPos: number[]): boolean {
    if (
      this.MazeSolver(maze, startPos[0], startPos[1], startPos, endPos) == false
    ) {
      return false;
    }
    return true;
  }
}

