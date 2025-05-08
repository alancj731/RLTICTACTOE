'use server'
import fs from "fs";
import readline from "readline";

const BOARD_ROWS = 3;
const BOARD_COLS = 3;
const BOARD_SIZE = BOARD_ROWS * BOARD_COLS;
const INSEQUENCE = 3;

class State {
  data: number[][];
  winner: number | null;
  end: boolean | null;
  hash_value: string | null;

  constructor(initial: Boolean = false) {
    this.winner = null;
    if (initial) {
      this.data = Array(BOARD_ROWS)
        .fill(0)
        .map(() => Array(BOARD_COLS).fill(0));
      this.hash_value = this.hash();
      this.end = this.isEnd();
    } else {
      this.data = [];
      this.end = null;
      this.hash_value = null;
    }
  }

  public setData(data: number[][]) {
    this.data = data.map((row) => [...row]);
    this.hash_value = this.hash();
    this.end = this.isEnd();
  }

  public hash(): string {
    let hashValue = 0;
    for (let row = 0; row < BOARD_ROWS; row++) {
      for (let col = 0; col < BOARD_COLS; col++) {
        hashValue = hashValue * 3 + this.data[row][col] + 1;
      }
    }
    this.hash_value = hashValue.toString();
    return this.hash_value;
  }

  public getWinner(sum: number): number | null {
    let winner = null;
    if (sum === INSEQUENCE) {
      winner = 1;
      this.setWinnder(winner);
    } else if (sum === -INSEQUENCE) {
      winner = -1;
      this.setWinnder(winner);
    }
    return winner;
  }

  public setWinnder(win: number) {
    this.winner = win;
  }

  public isEnd(): boolean {
    let end = false;
    // CHECK ROWS
    this.data.forEach((row) => {
      for (let col = 0; col <= row.length - INSEQUENCE; col++) {
        const sum = row
          .slice(col, col + INSEQUENCE)
          .reduce((acc, val) => acc + val, 0);
        if (this.getWinner(sum)) {
          end = true;
          return;
        }
      }
    });

    if (end) {
      this.end = true;
      return this.end;
    }

    // CHECK COLUMNS
    for (let row = 0; row <= this.data.length - BOARD_COLS; row++) {
      const slicedData = this.data.slice(row, row + INSEQUENCE);
      for (let col = 0; col < slicedData[0].length; col++) {
        const sum = slicedData.reduce((acc, r) => acc + r[col], 0);
        if (this.getWinner(sum)) {
          this.end = true;
          return this.end;
        }
      }
    }

    // CHECK LEFT TOP TO RIGHT BOTTOM
    for (let row = 0; row <= this.data.length - INSEQUENCE; row++) {
      for (let col = 0; col <= this.data[row].length - INSEQUENCE; col++) {
        const slicedData = this.data
          .slice(row, row + INSEQUENCE)
          .map((r) => r.slice(col, col + INSEQUENCE));

        let sum = 0;
        for (let i = 0; i < INSEQUENCE; i++) {
          for (let j = 0; j < INSEQUENCE; j++) {
            if (i === j) {
              sum += slicedData[i][j];
            }
          }
        }
        if (this.getWinner(sum)) {
          this.end = true;
          return this.end;
        }
      }
    }

    // CHECK RIGHT TOP TO LEFT BOTTOM
    for (let row = 0; row <= this.data.length - INSEQUENCE; row++) {
      for (let col = this.data[0].length - INSEQUENCE; col >= 0; col--) {
        const slicedData = this.data
          .slice(row, row + INSEQUENCE)
          .map((r) => r.slice(col, col + INSEQUENCE));

        let sum = 0;
        for (let i = 0; i < INSEQUENCE; i++) {
          for (let j = 0; j < INSEQUENCE; j++) {
            if (i + j === INSEQUENCE - 1) {
              sum += slicedData[i][j];
            }
          }
        }
        if (this.getWinner(sum)) {
          this.end = true;
          return this.end;
        }
      }
    }

    // CHECK IF BOARD IS FULL
    let empty = false;
    for (let row = 0; row < BOARD_ROWS; row++) {
      for (let col = 0; col < BOARD_COLS; col++) {
        if (this.data[row][col] === 0) {
          empty = true;
          break;
        }
      }
    }

    if (empty) {
      this.end = false;
    } else {
      this.end = true;
      this.winner = 0;
    }

    return this.end;
  }

  public nextState(i: number, j: number, symbol: number): number[][] {
    const data = this.data.map((row) => [...row]);
    data[i][j] = symbol;
    return data;
  }

  public showState(): void {
    for (let i = 0; i < BOARD_ROWS; i++) {
      console.log("-------------");
      let out = "| ";
      for (let j = 0; j < BOARD_COLS; j++) {
        const token =
          this.data[i][j] === 1 ? "*" : this.data[i][j] === -1 ? "x" : "0";
        out += token + " | ";
      }
      console.log(out);
    }
    console.log("-------------");
  }
}

function getAllStatesImplementation(
  currentState: State,
  symbol: number,
  all: Record<string, State>
): void {
  for (let i = 0; i < BOARD_ROWS; i++) {
    for (let j = 0; j < BOARD_COLS; j++) {
      if (currentState.data[i][j] == 0) {
        const newState = new State();
        newState.setData(currentState.nextState(i, j, symbol));
        const newHash = newState.hash_value;
        if (newHash && !(newHash in all)) {
          all[newHash] = newState;
          if (!newState.end) {
            getAllStatesImplementation(newState, -symbol, all);
          }
        }
      }
    }
  }
}

function getAllStates() {
  const all: Record<string, State> = {};
  const initialState = new State(true);
  const initialHash = initialState.hash_value;
  if (initialHash) {
    all[initialHash] = initialState;
    getAllStatesImplementation(initialState, 1, all);
  } else {
    console.error("Initial state has no hash value.");
  }
  return all;
}

const allStates = getAllStates();

class Player {
  states: State[];
  greedy: number[];
  estimations: Record<string, number>;

  constructor(
    public symbol: number = 0,
    public stepSize = 0.1,
    public epsilon = 0.1
  ) {
    this.symbol = symbol;
    this.stepSize = stepSize;
    this.epsilon = epsilon;
    this.states = [];
    this.greedy = [];
    this.estimations = {};
  }

  public reset() {
    this.states = [];
    this.greedy = [];
  }

  public setState(state: State, greedy: number = 1) {
    // make sure data is set in state
    state.hash();
    this.states.push(state);
    this.greedy.push(greedy);
  }

  public setSymbol(symbol: number) {
    this.symbol = symbol;
    for (const hash in allStates) {
      const state = allStates[hash];
      if (state.end) {
        if (state.winner === this.symbol) {
          this.estimations[hash] = 1.0;
          continue;
        }

        if (state.winner === 0) {
          this.estimations[hash] = 0.5;
          continue;
        }

        this.estimations[hash] = 0.0;
      } else {
        this.estimations[hash] = 0.5;
      }
    }
  }

  public backPropagation() {
    const hashs: string[] = this.states.map(
      (state) => state.hash_value
    ) as string[];
    for (let i = hashs.length - 2; i >= 0; i--) {
      const hash = hashs[i] as string;
      const td_error: number =
        this.greedy[i] *
        (this.estimations[hashs[i + 1]] - this.estimations[hash]);
      this.estimations[hash] += this.stepSize * td_error;
    }
  }

  public async act(): Promise<{ x: number; y: number; symbol: number }> {
    const state = this.states[this.states.length - 1];
    const nextStates: string[] = [];
    const next_positions: number[][] = [];
    let foundEmptyPlace = false;
    for (let i = 0; i < BOARD_ROWS; i++) {
      for (let j = 0; j < BOARD_COLS; j++) {
        if (state.data[i][j] === 0) {
          foundEmptyPlace = true;
          next_positions.push([i, j]);
          const newState = new State();
          const newData = state.nextState(i, j, this.symbol);
          newState.setData(newData);
          if (!newState.hash_value) {
            console.error("New state has no hash value.");
            console.error("New data", newData);
          }
          nextStates.push(newState.hash_value as string);
        }
      }
    }
    if (!foundEmptyPlace) {
      console.error("No empty positions found.");
      console.error("Current state", state.data);
    }

    if (Math.random() < this.epsilon) {
      const randomIndex = Math.floor(Math.random() * next_positions.length);
      const pos = next_positions[randomIndex];
      const action = { x: pos[0], y: pos[1], symbol: this.symbol };
      this.greedy[this.greedy.length - 1] = 0;
      return action;
    }

    let values: [number, number[]][] = [];
    if (nextStates.length === 0) {
      console.error("No next states found.");
    }
    for (let i = 0; i < nextStates.length; i++) {
      const hashVal = nextStates[i];
      // console.log("hashVal", hashVal);
      // console.log("estimations:", this.estimations[hashVal]);
      const pos = next_positions[i];
      values.push([this.estimations[hashVal], pos]);
    }

    // Shuffle the array
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }

    // Sort by estimated value in descending order
    values.sort((a, b) => b[0] - a[0]);
    // if(values[0])
    // {
    //   console.log("values[0]", values[0]);
    // }
    // else{
    //   console.error("values:", values);
    // }
    const pos = [...values[0][1]]; // Copy to avoid mutating original if needed
    const action = { x: pos[0], y: pos[1], symbol: this.symbol };
    return action;
  }

  public savePolycy() {
    const fileName = `./src/data/policy_${
      this.symbol === 1 ? "first" : "second"
    }.policy`;
    fs.writeFileSync(fileName, JSON.stringify(this.estimations));
  }
  public loadPolicy() {
    const fileName = `./src/data/policy_${
      this.symbol === 1 ? "first" : "second"
    }.policy`;
    const data = fs.readFileSync(fileName, "utf-8");
    this.estimations = JSON.parse(data);
  }
}

class Judge {
  p1: Player | HumanPlayer;
  p2: Player | HumanPlayer;
  current: Player | null;
  symbolP1: number;
  symbolP2: number;

  constructor(p1: Player | HumanPlayer, p2: Player | HumanPlayer) {
    this.p1 = p1;
    this.p2 = p2;
    this.current = null;
    this.symbolP1 = 1;
    this.p1.setSymbol(this.symbolP1);
    this.symbolP2 = -1;
    this.p2.setSymbol(this.symbolP2);
  }

  public reset() {
    this.p1.reset();
    this.p2.reset();
    this.current = null;
  }

  public *alternate() {
    while (true) {
      console.log("p1 turn");
      yield this.p1;
      console.log("p2 turn");
      yield this.p2;
    }
  }

  public async play(printState: boolean = false): Promise<number> {
    const iterator = this.alternate();
    this.reset();
    let currentState = new State(true);
    this.p1.setState(currentState);
    this.p2.setState(currentState);
    if (printState) {
      currentState.showState();
    }

    let player: Player | HumanPlayer = this.p1;
    while (true) {
      player = iterator.next().value as Player;
      const { x, y, symbol } = await player.act();
      console.log("x, y, symbol", x, y, symbol);
      const newState = new State();
      newState.setData(currentState.nextState(x, y, symbol));
      const nextHash = newState.hash_value;
      if (!nextHash) {
        console.error("Next state has no hash value.");
      }
      currentState = allStates[nextHash!];
      this.p1.setState(currentState);
      this.p2.setState(currentState);
      if (printState) {
        currentState.showState();
      }
      if (currentState.end) {
        if (currentState.winner === null) {
          console.error("Game ended with no winner.");
        }
        return currentState.winner as number;
      }
    }
  }
}

async function train(epochs: number = 5000, printEveryN: number = 500) {
  const p1 = new Player(0, 0.1, 0.01);
  const p2 = new Player(0, 0.1, 0.01);
  const judge = new Judge(p1, p2);
  let player1Wins = 0.0;
  let player2Wins = 0.0;
  let winner: number = 0;
  for (let i = 0; i < epochs; i++) {
    winner = await judge.play();
    if (winner === 1) {
      player1Wins += 1;
    } else if (winner === -1) {
      player2Wins += 1;
    }
    if (i % printEveryN === 0) {
      console.log(
        `Game ${i} finished. Player 1 wins: ${(player1Wins / (i + 1)).toFixed(
          2
        )}, Player 2 wins: ${(player2Wins / (i + 1)).toFixed(2)}`
      );
    }
    p1.backPropagation();
    p2.backPropagation();
    judge.reset();
  }
  p1.savePolycy();
  p2.savePolycy();
}

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Promise-based input function
function getUserInput(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

class HumanPlayer {
  public symbol: number | null = null;
  public state: State | null = null;
  public setState(state: State) {
    this.state = state;
  }
  public reset(){

  }
  public setSymbol(symbol: number) {
    this.symbol = symbol;
  }

  public async getSymbol(type: "Row" | "Col"): Promise<number> {
    while (true) {
      const x = await getUserInput(`Enter ${type} (0-2): `);
      console.log("user input", x);
      const num = parseInt(x);
      if (isNaN(num) || num < 0 || num > 2) {
        console.log("Invalid input. Please enter a number between 0 and 2.");
        continue;
      }
      return num;
    }
  }
  public async act() {
    console.log("human player acting...");
    this.state?.showState();
    while (true) {
      const x = await this.getSymbol("Row");
      const y = await this.getSymbol("Col");
      if (this.state?.data[x][y] !== 0) {
        console.log("Invalid move. Cell already occupied. Try again.");
        continue;
      }
      const act = { x, y, symbol: this.symbol as number };
      console.log("act", act);
      return act;
    }
  }
}

class WebGame {
    p1: HumanPlayer;
    p2: Player;
    currentPlayer: Player | HumanPlayer | null = null;
    currentState: State | null = null;
    symbolP1 = 1;
    symbolP2 = -1;

    constructor(){
        this.p1 = new HumanPlayer();
        this.p2 = new Player(0, 0.1, 0.2);
    }
    
    public start(usePolocy: boolean = false) {
        console.log("WebGame started");
        this.currentState = new State(true);
        this.p1.setState(this.currentState);
        this.p1.setSymbol(this.symbolP1);
        if (usePolocy) {
          this.p2 = new Player(0, 0.1, 0.0);
          this.p2.setSymbol(this.symbolP2);
          this.p2.loadPolicy();
        }
        else{
          this.p2 = new Player(0, 0.1, 0.2);
          this.p2.setSymbol(this.symbolP2);
        }
        this.p2.setState(this.currentState);

    }

    public async HumanAct(i: number, j: number) : Promise<{x: number, y: number} | null> {
        // update human action
        let newState = new State();
        console.log("currentState", this.currentState);
        let data = this.currentState?.nextState(i, j, this.symbolP1) as number[][]
        console.log("next data", data);
        newState.setData(data);
        let nextHash = newState.hash_value;
        if (!nextHash) {
            console.error("Next state has no hash value.");
        }
        this.currentState = allStates[nextHash!];
        this.p1.setState(this.currentState);
        this.p2.setState(this.currentState);
        if (this.currentState && this.currentState.end){
            return null
        }
        const { x, y, symbol } = await this.p2.act();

        // update bot reaction
        data = this.currentState?.nextState(x, y, this.symbolP2) as number[][]
        newState.setData(data);
        nextHash = newState.hash_value;
        if (!nextHash) {
            console.error("Next state has no hash value.");
        }
        this.currentState = allStates[nextHash!];
        this.p1.setState(this.currentState);
        this.p2.setState(this.currentState);
        return { x, y}
    }
}
const game = new WebGame();

async function startGame(usePolocy: boolean = false) {
  game.start(usePolocy);
  return 0;
}

async function userInput(i: number, j: number) {
  const result = await game.HumanAct(i, j);
  return result;
}
export { startGame, userInput }

