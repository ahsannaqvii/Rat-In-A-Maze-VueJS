<template>
  <div>
    <div class="maze">
      <div v-for="(row, rowIndex) in MazeBoard" :key="rowIndex">
        <div v-for="(cell, cellIndex) in row" :key="cellIndex">
          <div :class="computeClasses(cell)"></div>
        </div>
      </div>
    </div>
    <div class="main-container">
      <div class="container" v-if="solve === false">
        <button class="button" v-on:click="solveMazeUsingBacktracking">
          <div class="button__line"></div>
          <div class="button__line"></div>
          <span class="button__text">Solve Maze using Backtracking</span>
          <div class="button__drow1"></div>
          <div class="button__drow2"></div>
        </button>
      </div>

      <div class="container" v-if="solve === false">
        <button class="button" v-on:click="solveMazeUsingBFS">
          <div class="button__line"></div>
          <div class="button__line"></div>
          <span class="button__text">Solve Maze using BFS</span>
          <div class="button__drow1"></div>
          <div class="button__drow2"></div>
        </button>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  // eslint-disable-next-line
  name: "MazeVue",
  props: ["MazeBoard", "solve"],
  methods: {
    computeClasses: function (cell) {
      if (cell === "S") {
        return "start";
      } else if (cell === "B") {
        return "wall";
      } else if (cell === "V") {
        return "visited";
      } else if (cell === "O") {
        return "path";
      } else {
        return "end";
      }
    },
    solveMazeUsingBacktracking() {
      this.$emit("solveMaze","Backtracking");
    },
    solveMazeUsingBFS() {
      this.$emit("solveMaze","BFS");
    },

    }
  
};
</script>
  
  <style scoped >
body {
  margin: 0;
  padding: 0;
}
.main-container{
  margin-top:20px;
  
  display:flex;
}
.maze {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-gap: 0;
  margin: auto;
  width: 400px;
  height: 400px;
}

.visited {
  padding: 16px;
  text-align: center;
  background-color: green;
  border: 1px solid #ccc;
  width: 70px;
  height: 70px;
}
.start {
  background-image: url(https://i.ibb.co/zQ40wZk/jkerry.png);
  background-position: cover;
  border: 1px solid #ccc;
  background-size: contain;
  width: 70px;
  height: 70px;
  padding: 16px;
  text-align: center;
}
.end {
  width: 70px;
  height: 70px;
  background-image: url(https://i.ibb.co/HtRZMqB/jkerry.png);
  background-size: cover;
  border: 1px solid #ccc;

  padding: 16px;
  text-align: center;
}
.wall {
  padding: 16px;
  text-align: center;
  background-color: #b00020;
  border: 1px solid #ccc;
  width: 70px;
  height: 70px;
}

.path {
  padding: 16px;
  text-align: center;
  background-color: white;
  border: 1px solid #ccc;
  width: 70px;
  height: 70px;
}


</style>