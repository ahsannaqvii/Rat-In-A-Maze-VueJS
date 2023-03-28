// const CONSTANTS = require("./Constants");
var CONSTANTS = {
    ROW_SIZE: 4,
    COL_SIZE: 4,
};
var ConsoleUI = /** @class */ (function () {
    function ConsoleUI() {
    }
    ConsoleUI.prototype.DisplayMaze = function (maze) {
        return maze;
    };  
    ConsoleUI.prototype.PathNotFound = function () {
        return false;
    };
    return ConsoleUI;
}());
 /* eslint-disable */
//Context class to connect with the Strategy classes.
export var Maze = /** @class */ (function () {
    function Maze() {
        this.MazeBoard = Array(CONSTANTS.ROW_SIZE)
            .fill(0)
            .map(function () { return Array(CONSTANTS.COL_SIZE).fill(0); });
        this.MazeUI = new ConsoleUI();
    }
    //Function responsible to calculate the start and end coordinates
    Maze.prototype.calculateStartAndFinalPos = function () {
        this.startPosition = [
            Math.floor(Math.random() * CONSTANTS.ROW_SIZE),
            Math.floor(Math.random() * CONSTANTS.COL_SIZE),
        ];
        do {
            this.endPosition = [
                Math.floor(Math.random() * CONSTANTS.ROW_SIZE),
                Math.floor(Math.random() * CONSTANTS.COL_SIZE),
            ];
        } while (this.startPosition[0] === this.endPosition[0] &&
            this.startPosition[1] === this.endPosition[1]);
    };
    //Function responsible to mark the blocks, start and end.
    Maze.prototype.generateMaze = function () {
        this.calculateStartAndFinalPos();
        for (var i = 0; i < CONSTANTS.ROW_SIZE; i++) {
            for (var j = 0; j < CONSTANTS.COL_SIZE; j++) {
                //Set the START position
                if (i === this.startPosition[0] && j === this.startPosition[1]) {
                    this.MazeBoard[i][j] = "S";
                    //Set the END position
                }
                else if (i === this.endPosition[0] && j === this.endPosition[1]) {
                    this.MazeBoard[i][j] = "E";
                    //Set the BLOCKS and EMPTY cells.
                }
                else {
                    var blocks = Math.floor(Math.random() * 2);
                    if (blocks % 2 === 0) {
                        this.MazeBoard[i][j] = "B";
                    }
                    else {
                        this.MazeBoard[i][j] = "O";
                    }
                }
            }
        }
        return this.MazeBoard;
    };
    Maze.prototype.solveMazeBoard = function () {
        if (this.mazeStrategy.solveMaze(this.MazeBoard, this.startPosition, this.endPosition)) {
          
            return this.MazeUI.DisplayMaze(this.MazeBoard);
        }
        else {
            return this.MazeUI.PathNotFound();
        }
    };
    Maze.prototype.setMazeStrategy = function (mazeStrategy) {
        this.mazeStrategy = mazeStrategy;
    };
    return Maze;
}());
export var BFSMaze = /** @class */ (function () {
    function BFSMaze() {
    }
    BFSMaze.prototype.checkIfSafe = function (maze, row, col) {
        if (row >= 0 &&
            col >= 0 &&
            row < CONSTANTS.ROW_SIZE &&
            col < CONSTANTS.COL_SIZE &&
            (maze[row][col] === "O" ||
                maze[row][col] === "S" ||
                maze[row][col] === "E")) {
            return true;
        }
        return false;
    };
    BFSMaze.prototype.MazeSolver = function (maze, row, col, startPos, endPos) {
        var Queue = [];
        var visited = Array(CONSTANTS.ROW_SIZE)
            .fill(0)
            .map(function () { return Array(CONSTANTS.COL_SIZE).fill(0); });
        Queue.push(startPos);
        console.log(startPos, endPos);
        while (Queue.length > 0) {
            var currentIndex = Queue.shift();
            visited[currentIndex[0]][currentIndex[1]] = 1;
            if (maze[currentIndex[0]][currentIndex[1]] != "S" &&
                maze[currentIndex[0]][currentIndex[1]] != "E") {
                maze[currentIndex[0]][currentIndex[1]] = "V";
            }
            if (currentIndex[0] === endPos[0] && currentIndex[1] === endPos[1]) {
                return true;
            }
            if (this.checkIfSafe(maze, currentIndex[0] + 1, currentIndex[1]) == true &&
                visited[currentIndex[0] + 1][currentIndex[1]] == 0) {
                Queue.push([currentIndex[0] + 1, currentIndex[1]]);
            }
            if (this.checkIfSafe(maze, currentIndex[0], currentIndex[1] + 1) == true &&
                visited[currentIndex[0]][currentIndex[1] + 1] == 0) {
                Queue.push([currentIndex[0], currentIndex[1] + 1]);
            }
            if (this.checkIfSafe(maze, currentIndex[0] - 1, currentIndex[1]) == true &&
                visited[currentIndex[0] - 1][currentIndex[1]] == 0) {
                Queue.push([currentIndex[0] - 1, currentIndex[1]]);
            }
            if (this.checkIfSafe(maze, currentIndex[0], currentIndex[1] - 1) == true &&
                visited[currentIndex[0]][currentIndex[1] - 1] == 0) {
                Queue.push([currentIndex[0], currentIndex[1] - 1]);
            }
        }
        return false;
    };
    BFSMaze.prototype.solveMaze = function (maze, startPos, endPos) {
        var res = this.MazeSolver(maze, null, null, startPos, endPos);
        console.log(res);
        if (res) {
            return true;
        }
        return false;
    };
    return BFSMaze;
}());
export var BackTrackingMaze = /** @class */ (function () {
    function BackTrackingMaze() {
    }
    BackTrackingMaze.prototype.checkIfSafe = function (maze, row, col) {
        if (row >= 0 &&
            col >= 0 &&
            row < CONSTANTS.ROW_SIZE &&
            col < CONSTANTS.COL_SIZE &&
            (maze[row][col] === "O" || maze[row][col] === "S")) {
            return true;
        }
        return false;
    };
    BackTrackingMaze.prototype.MazeSolver = function (maze, row, col, startPos, endPos) {
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
    };
    BackTrackingMaze.prototype.solveMaze = function (maze, startPos, endPos) {
        if (this.MazeSolver(maze, startPos[0], startPos[1], startPos, endPos) == false) {
            return false;
        }
        return true;
    };
    return BackTrackingMaze;
}());
// let mazeBacktracking = new BackTrackingMaze(4, 4) BFSMaze;
// let maze = new Maze();
// maze.setMazeStrategy(new BFSMaze());
// console.log(maze.generateMaze());
// maze.solveMazeBoard();
