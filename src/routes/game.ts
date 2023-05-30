export const w = "#ffffff";
export const b = "#000000";

export const customColors = [
  //   "#4169E1", // Royal Blue
  //   "#FF7F50", // Coral
  //   "#DAA520", // Goldenrod
  //   "#DA70D6", // Orchid
  //   "#32CD32", // Lime Green
  //   "#008080", // Teal
  //   "#800000", // Maroon
  //   "#00FFFF", // Aqua
  //   "#FFDB58", // Mustard

  "#f34336", // Red
  "#4db14f", // Green
  "#b3ff5a", // Lime
  "#feed3d", // Yellow
  "#795547", // Brown
  "#3e50b4", // Blue
  "#2196f3", // Light Blue
  "#008080", // Teal
  "#FF00FF", // Fuchsia
];

export const randomColor = () =>
  customColors[Math.floor(Math.random() * customColors.length)];

export const initData = [
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
  [w, w, w, w, w, w, w],
];
export const initActor = [randomColor(), randomColor(), randomColor()];

export enum Phase {
  INACTIVE,
  PAUSED,
  MOVING,
  DROP,
  MATCH_REQUEST,
  COLLAPSE_REQUEST,
}

export interface Actor {
  state: string[];
  x: number;
  y: number;
}

export interface Game {
  board: string[][];
  actor: {
    state: string[];
    x: number;
    y: number;
  };
  phase: Phase;
  nextActor: string[];
}

export function matching(game: Game, customBoard?: string[][]) {
  const board = customBoard ?? game.board;
  const columnsQty = board[0].length;
  const rowsQty = board.length;

  function initMatches(): boolean[][] {
    const match: boolean[][] = [];

    for (let row = 0; row < rowsQty; row++) {
      const rowContent: boolean[] = [];
      for (let col = 0; col < columnsQty; col++) {
        rowContent.push(false);
      }
      match.push(rowContent);
    }

    return match;
  }

  function verticalMatching(match: boolean[][]) {
    for (let row = 0; row < rowsQty; row++) {
      let matchStartIndex = -1;
      const isMatch = (col: number): boolean =>
        board[row][col] === board[row][col - 1] &&
        board[row][col] !== w &&
        board[row][col] !== b;
      for (let col = 1; col < columnsQty; col++) {
        if (isMatch(col)) {
          if (matchStartIndex == -1) {
            matchStartIndex = col - 1;
          } else if (col == columnsQty - 1 && col - matchStartIndex >= 2) {
            for (let c = matchStartIndex; c <= col; c++) {
              match[row][c] = true;
            }
          }
        } else {
          if (matchStartIndex >= 0 && col - matchStartIndex > 2) {
            for (let c = matchStartIndex; c < col; c++) {
              match[row][c] = true;
            }
          }
          matchStartIndex = -1;
        }
      }
    }
  }

  function horizontalMatching(match: boolean[][]) {
    for (let col = 0; col < columnsQty; col++) {
      let matchStartIndex = -1;
      const isMatch = (row: number): boolean =>
        board[row][col] === board[row - 1][col] &&
        board[row][col] !== w &&
        board[row][col] != b;
      for (let row = 1; row < rowsQty; row++) {
        if (isMatch(row)) {
          if (matchStartIndex == -1) {
            matchStartIndex = row - 1;
          } else if (row == rowsQty - 1 && row - matchStartIndex >= 2) {
            for (let r = matchStartIndex; r <= row; r++) {
              match[r][col] = true;
            }
          }
        } else {
          if (matchStartIndex >= 0 && row - matchStartIndex > 2) {
            for (let r = matchStartIndex; r < row; r++) {
              match[r][col] = true;
            }
          }
          matchStartIndex = -1;
        }
      }
    }
  }

  function diagonalMatch(
    rowDirect: number,
    row: number,
    colDirect: number,
    col: number
  ) {
    return (
      board[row][col] === board[row + rowDirect][col + colDirect] &&
      board[row][col] != w &&
      board[row][col] != b
    );
  }

  function diagonalColumnRightToLeftMatching(match: boolean[][]) {
    for (let xCol = columnsQty - 1; xCol > 1; xCol--) {
      let startRow = -1;
      let startCol = -1;
      for (let col = xCol - 1, row = 1; col >= 0; col--, row++) {
        if (diagonalMatch(-1, row, 1, col)) {
          if (startRow == -1 && startCol == -1) {
            startRow = row - 1;
            startCol = col + 1;
          } else if (col == 0 && row - startRow >= 2) {
            for (let r = startRow, c = startCol; r <= row; r++, c--) {
              match[r][c] = true;
            }
          }
        } else {
          if (startRow >= 0 && startCol >= 0 && row - startRow > 2) {
            for (let r = startRow, c = startCol; r < row; r++, c--) {
              match[r][c] = true;
            }
          }
          startRow = -1;
          startCol = -1;
        }
      }
    }
  }

  function diagonalRowRightToLeftMatching(match: boolean[][]) {
    for (let xRow = 0; xRow <= rowsQty; xRow++) {
      let startRow = -1;
      let startCol = -1;
      for (
        let row = xRow + 1, col = columnsQty - 2;
        row < rowsQty && col >= 0;
        row++, col--
      ) {
        if (diagonalMatch(-1, row, 1, col)) {
          if (startRow == -1 && startCol == -1) {
            startRow = row - 1;
            startCol = col + 1;
          } else if ((row == rowsQty - 1 || col == 0) && row - startRow >= 2) {
            for (let r = startRow, c = startCol; r <= row; r++, c--) {
              match[r][c] = true;
            }
          }
        } else {
          if (startRow >= 0 && startCol >= 0 && row - startRow > 2) {
            for (let r = startRow, c = startCol; r < row; r++, c--) {
              match[r][c] = true;
            }
          }
          startRow = -1;
          startCol = -1;
        }
      }
    }
  }

  function diagonalColumnLeftToRightMatching(match: boolean[][]) {
    for (let xCol = 0; xCol <= columnsQty; xCol++) {
      let startRow = -1;
      let startCol = -1;
      for (
        let col = xCol + 1, row = 1;
        col < columnsQty && row < rowsQty;
        col++, row++
      ) {
        if (diagonalMatch(-1, row, -1, col)) {
          if (startRow == -1 && startCol == -1) {
            startRow = row - 1;
            startCol = col - 1;
          } else if (
            (col == columnsQty - 1 || row == rowsQty - 1) &&
            row - startRow >= 2
          ) {
            for (let r = startRow, c = startCol; r <= row; r++, c++) {
              match[r][c] = true;
            }
          }
        } else {
          if (startRow >= 0 && startCol >= 0 && row - startRow > 2) {
            for (let r = startRow, c = startCol; r < row; r++, c++) {
              match[r][c] = true;
            }
          }
          startRow = -1;
          startCol = -1;
        }
      }
    }
  }

  function diagonalRowLeftToRightMatching(match: boolean[][]) {
    for (let xRow = 0; xRow < rowsQty; xRow++) {
      let startRow = -1;
      let startCol = -1;
      for (
        let row = xRow + 1, col = 1;
        row < rowsQty && col < columnsQty;
        row++, col++
      ) {
        if (diagonalMatch(-1, row, -1, col)) {
          if (startRow == -1 && startCol == -1) {
            startRow = row - 1;
            startCol = col - 1;
          } else if (row == rowsQty - 1 || col == columnsQty - 1) {
            if (row - startRow >= 2) {
              for (let r = startRow, c = startCol; r <= row; r++, c++) {
                match[r][c] = true;
              }
            }
          }
        } else {
          if (startRow >= 0 && startCol >= 0 && row - startRow > 2) {
            for (let r = startRow, c = startCol; r < row; r++, c++) {
              match[r][c] = true;
            }
          }
          startRow = -1;
          startCol = -1;
        }
      }
    }
  }

  function squareMatching(match: boolean[][]) {
    for (let row = 1; row < rowsQty; row++) {
      for (let col = 1; col < columnsQty; col++) {
        if (
          board[row][col - 1] == board[row][col] &&
          board[row - 1][col - 1] == board[row][col] &&
          board[row - 1][col] == board[row][col] &&
          board[row][col] != w &&
          board[row][col] != b
        ) {
          match[row][col] = true;
          match[row][col - 1] = true;
          match[row - 1][col - 1] = true;
          match[row - 1][col] = true;
        }
      }
    }
  }

  function crossSquareMatching(match: boolean[][]) {
    for (let row = 1; row < rowsQty; row++) {
      for (let col = 1; col < columnsQty; col++) {
        if (
          board[row][col] == board[row - 1][col - 1] &&
          board[row][col - 1] == board[row - 1][col] &&
          board[row][col] != w &&
          board[row][col] != b
        ) {
          match[row][col] = true;
          match[row][col - 1] = true;
          match[row - 1][col - 1] = true;
          match[row - 1][col] = true;
        }
      }
    }
  }

  function checkCollapsed(match: boolean[][], mark: boolean): boolean {
    let result = false;
    for (let row = 0; row < rowsQty; row++) {
      for (let col = 0; col < columnsQty; col++) {
        if (match[row][col]) {
          if (mark) {
            board[row][col] = b;
            // score++;
          }
          result = true;
        }
      }
    }
    return result;
  }

  return function (mark: boolean) {
    const match = initMatches();
    verticalMatching(match);
    horizontalMatching(match);
    diagonalColumnRightToLeftMatching(match);
    diagonalRowRightToLeftMatching(match);
    diagonalColumnLeftToRightMatching(match);
    diagonalRowLeftToRightMatching(match);
    squareMatching(match);
    crossSquareMatching(match);
    return checkCollapsed(match, mark);
  };
}

export function collapse(game: Game) {
  const { board } = game;
  const columnsQty = board[0].length;
  const rowsQty = board.length;

  for (let col = 0; col < columnsQty; col++) {
    const newCol = [];
    for (let row = rowsQty - 1; row >= 0; row--) {
      if (board[row][col] != w && board[row][col] != b) {
        newCol.push(board[row][col]);
      }
    }
    for (let row = rowsQty - 1, r = 0; r < newCol.length; row--, r++) {
      board[row][col] = newCol[r];
    }
    for (let row = rowsQty - newCol.length - 1; row >= 0; row--) {
      board[row][col] = w;
    }
  }
}

export function isNextMovePossible(game: Game) {
  const { board } = game;
  const rowsQty = board.length;

  if (game.actor.y + 2 >= rowsQty) {
    return false;
  }
  if (board[game.actor.y + 2][game.actor.x] !== w) {
    return false;
  }

  return true;
}

export function endActorSession(game: Game) {
  const { actor, board } = game;
  const { state } = actor;

  if (actor.y - 1 >= 0) {
    board[actor.y - 1][actor.x] = state[2];
  }
  if (actor.y >= 0) {
    board[actor.y][actor.x] = state[1];
  }
  if (actor.y + 1 >= 0) {
    board[actor.y + 1][actor.x] = state[0];
  }
}

export function isFinish(game: Game): boolean {
  const { board, actor } = game;
  const { state } = actor;
  const columnsQty = board[0].length;

  const getNextBoard = (): string[][] => {
    const result = board.map((a) => a.slice());
    if (actor.y - 1 >= 0) {
      result[actor.y - 1][actor.x] = state[0];
    }
    if (actor.y >= 0) {
      result[actor.y][actor.x] = state[1];
    }
    if (actor.y + 1 >= 0) {
      result[actor.y + 1][actor.x] = state[2];
    }
    return result;
  };

  if (matching(game, getNextBoard())(false)) {
    return false;
  }
  for (let col = 0; col < columnsQty; col++) {
    if (board[0][col] !== w) {
      return true;
    }
  }
  return false;
}

export function swapActorColors(game: Game) {
  const { actor } = game;
  const { state } = actor;
  const tmp = state[2];
  state[2] = state[1];
  state[1] = state[0];
  state[0] = tmp;
}

export function init(game: Game) {
  const { board, actor } = game;
  const columnsQty = board[0].length;
  const rowsQty = board.length;

  // score = 0;
  for (let row = 0; row < rowsQty; row++) {
    const rowContent = [];
    for (let col = 0; col < columnsQty; col++) {
      rowContent.push(w);
    }
    board.push(rowContent);
  }
  actor.x = Math.floor(columnsQty / 2);
  actor.y = -2;
}

export function isShapeEmpty(game: Game): boolean {
  const { actor } = game;
  const { state } = actor;
  return state[0] === w || state[1] === w || state[2] === w;
}

export function isNextActorInit(game: Game): boolean {
  const { nextActor } = game;
  return nextActor[0] !== w;
}

export function initShape(game: Game) {
  const { actor, nextActor } = game;
  for (let i = 0; i < actor.state.length; i++) {
    nextActor[i] = randomColor();
  }
}

export function randomColors(n: number): string[] {
  const res = [];
  for (let i = 0; i < n; i++) {
    res.push(randomColor());
  }
  return res;
}

export function initNextShape(game: Game) {
  initShape(game);
}

export function doNextShape(game: Game) {
  const { board, actor, nextActor } = game;
  const { state } = actor;
  const columnsQty = board[0].length;

  for (let i = 0; i < state.length; i++) {
    state[i] = nextActor[i];
  }
  actor.x = Math.floor(columnsQty / 2);
  actor.y = -2;
  initNextShape(game);
}

export function actorDown(game: Game) {
  game.actor.y++;
}

export function moveHorTo(game: Game, pos: number) {
  const { board, actor } = game;
  const rowsQty = board.length;

  if (pos !== null && pos >= 0 && pos <= rowsQty) {
    if (pos < actor.x) {
      moveLeftTo(game, pos);
    } else if (pos > actor.x) {
      moveRightTo(game, pos);
    }
  }
}

export function moveLeft(game: Game): boolean {
  const { board, actor } = game;

  if (actor.x - 1 >= 0) {
    if (
      (actor.y < 0 || board[actor.y][actor.x - 1] === w) &&
      (actor.y < 0 || board[actor.y + 1][actor.x - 1] === w) &&
      (actor.y < 0 || board[actor.y + 2][actor.x - 1] === w)
    ) {
      actor.x--;
      return true;
    }
  }
  return false;
}

export function moveLeftTo(game: Game, pos: number) {
  const { actor } = game;
  while (moveLeft(game) && actor.x !== pos);
}

export function moveRight(game: Game) {
  const { board, actor } = game;
  const columnsQty = board[0].length;

  if (actor.x + 1 < columnsQty) {
    if (
      (actor.y < 0 || board[actor.y][actor.x + 1] === w) &&
      (actor.y < 0 || board[actor.y + 1][actor.x + 1] === w) &&
      (actor.y < 0 || board[actor.y + 2][actor.x + 1] === w)
    ) {
      actor.x++;
      return true;
    }
  }
  return false;
}

export function moveRightTo(game: Game, pos: number) {
  const { actor } = game;
  while (moveRight(game) && actor.x != pos);
}
