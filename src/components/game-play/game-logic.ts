export const COLOR_WHITE = "#ffffff";

const w = COLOR_WHITE;

export const COLOR_RED = "#f34336";
export const COLOR_GREEN = "#4db14f";
export const COLOR_LIME = "#b3ff5a";
export const COLOR_YELLOW = "#feed3d";
export const COLOR_BROWN = "#795547";
export const COLOR_BLUE = "#3e50b4";
export const COLOR_LIGHT_BLUE = "#2196f3";
export const COLOR_TEAL = "#008080";
export const COLOR_FUCHSIA = "#ff00ff";

export const COLOR_INACTIVE_RED = "#f1867e";
export const COLOR_INACTIVE_GREEN = "#93ad93";
export const COLOR_INACTIVE_LIME = "#e5ffc7";
export const COLOR_INACTIVE_YELLOW = "#fff9be";
export const COLOR_INACTIVE_BROWN = "#dab7aa";
export const COLOR_INACTIVE_BLUE = "#868eba";
export const COLOR_INACTIVE_LIGHT_BLUE = "#96c7ee";
export const COLOR_INACTIVE_TEAL = "#8c9696";
export const COLOR_INACTIVE_FUCHSIA = "#ffb4ff";

export const customColors = [
  COLOR_RED,
  COLOR_GREEN,
  COLOR_LIME,
  COLOR_YELLOW,
  COLOR_BROWN,
  COLOR_BLUE,
  COLOR_LIGHT_BLUE,
  COLOR_TEAL,
  COLOR_FUCHSIA,
];

export type ColumnsColor =
  | typeof COLOR_WHITE
  | typeof COLOR_RED
  | typeof COLOR_GREEN
  | typeof COLOR_LIME
  | typeof COLOR_YELLOW
  | typeof COLOR_BROWN
  | typeof COLOR_BLUE
  | typeof COLOR_LIGHT_BLUE
  | typeof COLOR_TEAL
  | typeof COLOR_FUCHSIA
  | typeof COLOR_INACTIVE_RED
  | typeof COLOR_INACTIVE_GREEN
  | typeof COLOR_INACTIVE_LIME
  | typeof COLOR_INACTIVE_YELLOW
  | typeof COLOR_INACTIVE_BROWN
  | typeof COLOR_INACTIVE_BLUE
  | typeof COLOR_INACTIVE_LIGHT_BLUE
  | typeof COLOR_INACTIVE_TEAL
  | typeof COLOR_INACTIVE_FUCHSIA;

export const colorsToDisappearHash: { [k: string]: ColumnsColor } = {
  [COLOR_RED]: COLOR_INACTIVE_RED,
  [COLOR_GREEN]: COLOR_INACTIVE_GREEN,
  [COLOR_LIME]: COLOR_INACTIVE_LIME,
  [COLOR_YELLOW]: COLOR_INACTIVE_YELLOW,
  [COLOR_BROWN]: COLOR_INACTIVE_BROWN,
  [COLOR_BLUE]: COLOR_INACTIVE_BLUE,
  [COLOR_LIGHT_BLUE]: COLOR_INACTIVE_LIGHT_BLUE,
  [COLOR_TEAL]: COLOR_INACTIVE_TEAL,
  [COLOR_FUCHSIA]: COLOR_INACTIVE_FUCHSIA,
};

export const colorsToDisappear = Object.values(
  colorsToDisappearHash
) as ColumnsColor[];
export const shouldDisappear = (color: ColumnsColor) => {
  return colorsToDisappear.includes(color);
};

export const randomColor = (): ColumnsColor =>
  customColors[Math.floor(Math.random() * customColors.length)] as ColumnsColor;

export const initData: ColumnsColor[][] = [
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
  FLYING,
  MATCH_REQUEST,
  COLLAPSE_REQUEST,
}

export interface Actor {
  state: ColumnsColor[];
  column: number;
  row: number;
}

export interface Game {
  board: ColumnsColor[][];
  actor: Actor;
  phase: Phase;
  savedPhase: Phase;
  nextActor: ColumnsColor[];
  score: number;
}

export function clone(game: Game): Game {
  return {
    ...game,
    nextActor: [...game.nextActor],
    board: game.board.map((a) => a.slice()),
    actor: { ...game.actor },
  };
}

export function matching(game: Game, customBoard?: ColumnsColor[][]) {
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
        !shouldDisappear(board[row][col]);
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
        !shouldDisappear(board[row][col]);
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
      board[row][col] !== w &&
      !shouldDisappear(board[row][col])
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
          board[row][col] !== w &&
          !shouldDisappear(board[row][col])
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
          board[row][col] !== w &&
          !shouldDisappear(board[row][col])
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
            board[row][col] = colorsToDisappearHash[board[row][col]];
            game.score++;
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
    const newCol: ColumnsColor[] = [];
    for (let row = rowsQty - 1; row >= 0; row--) {
      if (board[row][col] !== w && !shouldDisappear(board[row][col])) {
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

  if (game.actor.row + 2 >= rowsQty) {
    return false;
  }
  if (board[game.actor.row + 2][game.actor.column] !== w) {
    return false;
  }

  return true;
}

export function endActorSession(game: Game) {
  const { actor, board } = game;
  const { state } = actor;

  if (actor.row - 1 >= 0) {
    board[actor.row - 1][actor.column] = state[0];
  }
  if (actor.row >= 0) {
    board[actor.row][actor.column] = state[1];
  }
  if (actor.row + 1 >= 0) {
    board[actor.row + 1][actor.column] = state[2];
  }
}

export function isFinish(game: Game): boolean {
  const { board, actor } = game;
  const { state } = actor;
  const columnsQty = board[0].length;

  const getNextBoard = (): ColumnsColor[][] => {
    const result = board.map((a) => a.slice());
    if (actor.row - 1 >= 0) {
      result[actor.row - 1][actor.column] = state[0];
    }
    if (actor.row >= 0) {
      result[actor.row][actor.column] = state[1];
    }
    if (actor.row + 1 >= 0) {
      result[actor.row + 1][actor.column] = state[2];
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
  game.board = initData.map((a) => a.slice());
  const columnsQty = game.board[0].length;
  game.actor.column = Math.floor(columnsQty / 2);
  game.actor.row = -2;
  game.score = 0;
}

export function isActorEmpty(game: Game): boolean {
  const { actor } = game;
  const { state } = actor;
  return state[0] === w || state[1] === w || state[2] === w;
}

export function isNextActorInit(game: Game): boolean {
  const { nextActor } = game;
  return nextActor[0] !== w;
}

export function randomColors(n: number): ColumnsColor[] {
  const res: ColumnsColor[] = [];
  for (let i = 0; i < n; i++) {
    res.push(randomColor());
  }
  return res;
}

export function doNextActor(game: Game) {
  const { board, actor, nextActor } = game;
  const { state } = actor;
  const columnsQty = board[0].length;

  for (let i = 0; i < state.length; i++) {
    state[i] = nextActor[i];
  }
  actor.column = Math.floor(columnsQty / 2);
  actor.row = -2;

  for (let i = 0; i < actor.state.length; i++) {
    nextActor[i] = randomColor();
  }
}

export function actorDown(game: Game, extent = 1) {
  game.actor.row += extent;
}

export function moveHorTo(game: Game, pos: number) {
  const { board, actor } = game;
  const rowsQty = board.length;

  if (pos !== null && pos >= 0 && pos <= rowsQty) {
    if (pos < actor.column) {
      moveLeftTo(game, pos);
    } else if (pos > actor.column) {
      moveRightTo(game, pos);
    }
  }
}

export function moveLeft(game: Game): boolean {
  const { board, actor } = game;

  if (actor.column - 1 >= 0) {
    if (
      (actor.row < 0 || board[actor.row][actor.column - 1] === w) &&
      (actor.row < 0 || board[actor.row + 1][actor.column - 1] === w) &&
      (actor.row < 0 || board[actor.row + 2][actor.column - 1] === w)
    ) {
      actor.column--;
      return true;
    }
  }
  return false;
}

export function moveLeftTo(game: Game, pos: number) {
  const { actor } = game;
  while (moveLeft(game) && actor.column !== pos);
}

export function moveRight(game: Game) {
  const { board, actor } = game;
  const columnsQty = board[0].length;

  if (actor.column + 1 < columnsQty) {
    if (
      (actor.row < 0 || board[actor.row][actor.column + 1] === w) &&
      (actor.row < 0 || board[actor.row + 1][actor.column + 1] === w) &&
      (actor.row < 0 || board[actor.row + 2][actor.column + 1] === w)
    ) {
      actor.column++;
      return true;
    }
  }
  return false;
}

export function moveRightTo(game: Game, pos: number) {
  const { actor } = game;
  while (moveRight(game) && actor.column != pos);
}

export function pause(game: Game) {
  if (game.phase === Phase.PAUSED) {
    game.phase = game.savedPhase;
  } else {
    game.savedPhase = game.phase;
    game.phase = Phase.PAUSED;
  }
}
