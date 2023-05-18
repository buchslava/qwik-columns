// export let hMaxCount = 11;
// export let vMaxCount = 27;
export const hDefaultCount = 7;
export const vDefaultCount = 21;
export const hCount = hDefaultCount;
export const vCount = vDefaultCount;

enum Colors {
  white = '#EEEEEE',
  brown = '#964B00',
  red = '#FF0000',
  green = '#00FF00',
  blue = '#0000FF',
  yellow = '#FFFF00',
  lightGreenAccent = '#90EE90',
  indigo = '#4B0082',
  pinkAccent = '#FFC0CB',
  teal = '#008080',
  black = '#000000',
}

const colorsMap = [
  Colors.brown,
  Colors.red,
  Colors.green,
  Colors.blue,
  Colors.yellow,
  Colors.lightGreenAccent,
  Colors.indigo,
  Colors.pinkAccent,
  Colors.teal,
];

// key - color
const colorToString = {
  [Colors.brown]: "brown",
  [Colors.red]: "red",
  [Colors.green]: "green",
  [Colors.blue]: "blue",
  [Colors.yellow]: "yellow",
  [Colors.lightGreenAccent]: "lightGreenAccent",
  [Colors.indigo]: "indigo",
  [Colors.pinkAccent]: "pinkAccent",
  [Colors.teal]: "teal",
  [Colors.white]: "white",
  [Colors.black]: "black",
};

// value - color
const stringToColor = {
  brown: "brown",
  red: "red",
  green: "green",
  blue: "blue",
  yellow: "yellow",
  lightGreenAccent: "lightGreenAccent",
  indigo: "indigo",
  pinkAccent: "pinkAccent",
  teal: "teal",
  white: "white",
  black: "black",
};

const random = (min: number, max: number) => Math.random() * (max - min) + min;

export class Gameplay {
  static shape: Colors[] = [Colors.white, Colors.white, Colors.white];
  static nextShape: Colors[][] = [
    [Colors.white, Colors.white, Colors.white],
    [Colors.white, Colors.white, Colors.white],
    [Colors.white, Colors.white, Colors.white],
  ];
  static board: Colors[][] = [];
  static actorPosCol: number;
  static actorPosRow: number;
  static score: number;
  static howManyColors = 5;

  static init() {
    // score = 0;
    for (let col = 0; col < hCount; col++) {
      const colContent: Colors[] = [];
      for (let row = 0; row < vCount; row++) {
        colContent.push(Colors.white);
      }
      Gameplay.board.push(colContent);
    }
    Gameplay.board[0][0] = Colors.green;
    Gameplay.board[hCount-1][vCount-1] = Colors.red;
    Gameplay.actorPosCol = Gameplay.columnsQty() / 2;
    Gameplay.actorPosRow = -2;
  }

  // static reinit([GameState gameState]) {
  static reinit() {
    // if (gameState) {
    // score = 0;
    for (let col = 0; col < Gameplay.columnsQty(); col++) {
      for (let row = 0; row < Gameplay.rowsQty(); row++) {
        Gameplay.board[row][col] = Colors.white;
      }
    }
    // } else {
    //   for (var row = 0; row < vMaxCount; row++) {
    //     for (var col = 0; col < hMaxCount; col++) {
    //         Gameplay.board[row][col] = Colors.white;
    //     }
    //   }
    //   vCount = gameState.rows;
    //   hCount = gameState.cols;
    //   for (var row = 0; row < rowsQty(); row++) {
    //     for (var col = 0; col < columnsQty(); col++) {
    //         Gameplay.board[row][col] = gameState.board[row][col];
    //     }
    //   }
    //   Gameplay.howManyColors = gameState.howManyColors;
    // }
    Gameplay.actorPosCol = Gameplay.columnsQty() % 2;
    Gameplay.actorPosRow = -2;
  }

  static columnsQty() {
    return hCount;
  }

  static rowsQty() {
    return vCount;
  }

  static isShapeEmpty() {
    return (
      Gameplay.shape[0] == Colors.white ||
      Gameplay.shape[1] == Colors.white ||
      Gameplay.shape[2] == Colors.white
    );
  }

  static isNextShapeInit(n: number) {
    return (
      Gameplay.nextShape[n][0] != Colors.white &&
      Gameplay.nextShape[n][1] != Colors.white
    );
  }

  static initShape(n: number) {
    for (let i = 0; i < Gameplay.shape.length; i++) {
      Gameplay.nextShape[n][i] =
        colorsMap[random(0, Gameplay.howManyColors - 1)];
    }
  }

  static fillShapeByShape(source: Colors[], dest: Colors[]) {
    for (let i = 0; i < source.length && i < dest.length; i++) {
      dest[i] = source[i];
    }
  }

  static initNextShape() {
    if (Gameplay.isNextShapeInit(1)) {
      Gameplay.fillShapeByShape(Gameplay.nextShape[0], Gameplay.nextShape[1]);
      Gameplay.nextShape[1] = [...Gameplay.nextShape[0]];
    } else {
      Gameplay.initShape(1);
    }
    Gameplay.initShape(0);
    // Global.eventBus.fire(new SettingsEvent(type: SettingsType.nextShape));
  }

  static doNextShape() {
    for (let i = 0; i < Gameplay.shape.length; i++) {
      Gameplay.shape[i] = Gameplay.nextShape[1][i];
    }
    Gameplay.actorPosCol = Gameplay.columnsQty() % 2;
    Gameplay.actorPosRow = -2;
    Gameplay.initNextShape();
  }

  static actorDown() {
    Gameplay.actorPosRow++;
  }

  static isNextMovePossible() {
    if (Gameplay.actorPosRow + 2 >= Gameplay.rowsQty() - 1) {
      return false;
    }

    if (
      Gameplay.board[Gameplay.actorPosRow + 3][Gameplay.actorPosCol] !=
      Colors.white
    ) {
      return false;
    }

    return true;
  }

  static moveHorTo(pos: number) {
    if (pos != null && pos >= 0 && pos <= hCount) {
      if (pos < Gameplay.actorPosCol) {
        Gameplay.moveLeftTo(pos);
      } else if (pos > Gameplay.actorPosCol) {
        Gameplay.moveRightTo(pos);
      }
    }
  }

  static moveLeft(): boolean {
    if (Gameplay.actorPosCol - 1 >= 0) {
      if (
        (Gameplay.actorPosRow < 0 ||
          Gameplay.board[Gameplay.actorPosRow][Gameplay.actorPosCol - 1] ==
            Colors.white) &&
        (Gameplay.actorPosRow < 0 ||
          Gameplay.board[Gameplay.actorPosRow + 1][Gameplay.actorPosCol - 1] ==
            Colors.white) &&
        (Gameplay.actorPosRow < 0 ||
          Gameplay.board[Gameplay.actorPosRow + 2][Gameplay.actorPosCol - 1] ==
            Colors.white)
      ) {
        Gameplay.actorPosCol--;
        return true;
      }
    }
    return false;
  }

  static moveLeftTo(pos: number) {
    while (Gameplay.moveLeft() && Gameplay.actorPosCol != pos) {}
  }

  static moveRight(): boolean {
    if (Gameplay.actorPosCol + 1 < Gameplay.columnsQty()) {
      if (
        (Gameplay.actorPosRow < 0 ||
          Gameplay.board[Gameplay.actorPosRow][Gameplay.actorPosCol + 1] ==
            Colors.white) &&
        (Gameplay.actorPosRow < 0 ||
          Gameplay.board[Gameplay.actorPosRow + 1][Gameplay.actorPosCol + 1] ==
            Colors.white) &&
        (Gameplay.actorPosRow < 0 ||
          Gameplay.board[Gameplay.actorPosRow + 2][Gameplay.actorPosCol + 1] ==
            Colors.white)
      ) {
        Gameplay.actorPosCol++;
        return true;
      }
    }
    return false;
  }

  static moveRightTo(pos: number) {
    while (Gameplay.moveRight() && Gameplay.actorPosCol != pos) {}
  }

  static isFinish(): boolean {
    if (Gameplay.matching(Gameplay._getNextBoard())) {
      return false;
    }
    for (let col = 0; col < Gameplay.columnsQty(); col++) {
      if (Gameplay.board[0][col] != Colors.white) {
        return true;
      }
    }
    return false;
  }

  static endActorSession() {
    if (Gameplay.actorPosRow >= 0) {
      Gameplay.board[Gameplay.actorPosRow][Gameplay.actorPosCol] =
        Gameplay.shape[0];
    }
    if (Gameplay.actorPosRow + 1 >= 0) {
      Gameplay.board[Gameplay.actorPosRow + 1][Gameplay.actorPosCol] =
        Gameplay.shape[1];
    }
    if (Gameplay.actorPosRow + 2 >= 0) {
      Gameplay.board[Gameplay.actorPosRow + 2][Gameplay.actorPosCol] =
        Gameplay.shape[2];
    }
  }

  static swapActorColors() {
    const tmp = Gameplay.shape[2];
    Gameplay.shape[2] = Gameplay.shape[1];
    Gameplay.shape[1] = Gameplay.shape[0];
    Gameplay.shape[0] = tmp;
    // Global.eventBus.fire(new SettingsEvent(type: SettingsType.nextShape));
  }

  static matching(customBoard: Colors[][]) {
    const match: boolean[][] = Gameplay.initMatches();
    var _board = customBoard != null ? customBoard : Gameplay.board;
    Gameplay._verticalMatching(match, _board);
    Gameplay._horizontalMatching(match, _board);
    Gameplay._diagonalColumnRightToLeftMatching(match, _board);
    Gameplay._diagonalRowRightToLeftMatching(match, _board);
    Gameplay._diagonalColumnLeftToRightMatching(match, _board);
    Gameplay._diagonalRowLeftToRightMatching(match, _board);
    Gameplay._squareMatching(match, _board);
    Gameplay._crossSquareMatching(match, _board);
    return Gameplay._checkCollapsed(match, _board == Gameplay.board);
  }

  static initMatches(): boolean[][] {
    const match: boolean[][] = [];

    for (let row = 0; row < Gameplay.rowsQty(); row++) {
      const rowContent: boolean[] = [];
      for (var col = 0; col < Gameplay.columnsQty(); col++) {
        rowContent.push(false);
      }
      match.push(rowContent);
    }

    return match;
  }

  static collapse() {
    for (let col = 0; col < Gameplay.columnsQty(); col++) {
      const newCol: Colors[] = [];
      for (let row = Gameplay.rowsQty() - 1; row >= 0; row--) {
        if (
          Gameplay.board[row][col] != Colors.white &&
          Gameplay.board[row][col] != Colors.black
        ) {
          newCol.push(Gameplay.board[row][col]);
        }
      }
      for (
        let row = Gameplay.rowsQty() - 1, r = 0;
        r < newCol.length;
        row--, r++
      ) {
        Gameplay.board[row][col] = newCol[r];
      }
      for (let row = Gameplay.rowsQty() - newCol.length - 1; row >= 0; row--) {
        Gameplay.board[row][col] = Colors.white;
      }
    }
  }

  static resetScore() {
    // score = 0;
  }

  static _diagonalMatch(
    rowDirect: number,
    row: number,
    colDirect: number,
    col: number
  ) {
    return (
      Gameplay.board[row][col] ==
        Gameplay.board[row + rowDirect][col + colDirect] &&
      Gameplay.board[row][col] != Colors.white &&
      Gameplay.board[row][col] != Colors.black
    );
  }

  // board instead board
  static _verticalMatching(match: boolean[][], board: Colors[][]) {
    for (let row = 0; row < Gameplay.rowsQty(); row++) {
      let matchStartIndex = -1;
      const isMatch = (col: number) =>
        board[row][col] == board[row][col - 1] &&
        board[row][col] != Colors.white &&
        board[row][col] != Colors.black;
      for (let col = 1; col < Gameplay.columnsQty(); col++) {
        if (isMatch(col)) {
          if (matchStartIndex == -1) {
            matchStartIndex = col - 1;
          } else if (
            col == Gameplay.columnsQty() - 1 &&
            col - matchStartIndex >= 2
          ) {
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

  static _horizontalMatching(match: boolean[][], board: Colors[][]) {
    for (let col = 0; col < Gameplay.columnsQty(); col++) {
      let matchStartIndex = -1;
      const isMatch = (row: number) =>
        board[row][col] == board[row - 1][col] &&
        board[row][col] != Colors.white &&
        board[row][col] != Colors.black;
      for (let row = 1; row < Gameplay.rowsQty(); row++) {
        if (isMatch(row)) {
          if (matchStartIndex == -1) {
            matchStartIndex = row - 1;
          } else if (
            row == Gameplay.rowsQty() - 1 &&
            row - matchStartIndex >= 2
          ) {
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

  static _diagonalColumnRightToLeftMatching(
    match: boolean[][],
    board: Colors[][]
  ) {
    for (let xCol = Gameplay.columnsQty() - 1; xCol > 1; xCol--) {
      let startRow = -1;
      let startCol = -1;
      for (let col = xCol - 1, row = 1; col >= 0; col--, row++) {
        if (Gameplay._diagonalMatch(-1, row, 1, col)) {
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

  static _diagonalRowRightToLeftMatching(
    match: boolean[][],
    board: Colors[][]
  ) {
    for (let xRow = 0; xRow <= Gameplay.rowsQty(); xRow++) {
      let startRow = -1;
      let startCol = -1;
      for (
        let row = xRow + 1, col = Gameplay.columnsQty() - 2;
        row < Gameplay.rowsQty() && col >= 0;
        row++, col--
      ) {
        if (Gameplay._diagonalMatch(-1, row, 1, col)) {
          if (startRow == -1 && startCol == -1) {
            startRow = row - 1;
            startCol = col + 1;
          } else if (
            (row == Gameplay.rowsQty() - 1 || col == 0) &&
            row - startRow >= 2
          ) {
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

  static _diagonalColumnLeftToRightMatching(
    match: boolean[][],
    board: Colors[][]
  ) {
    for (let xCol = 0; xCol <= Gameplay.columnsQty(); xCol++) {
      let startRow = -1;
      let startCol = -1;
      for (
        let col = xCol + 1, row = 1;
        col < Gameplay.columnsQty() && row < Gameplay.rowsQty();
        col++, row++
      ) {
        if (Gameplay._diagonalMatch(-1, row, -1, col)) {
          if (startRow == -1 && startCol == -1) {
            startRow = row - 1;
            startCol = col - 1;
          } else if (
            (col == Gameplay.columnsQty() - 1 ||
              row == Gameplay.rowsQty() - 1) &&
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

  static _diagonalRowLeftToRightMatching(
    match: boolean[][],
    board: Colors[][]
  ) {
    for (let xRow = 0; xRow < Gameplay.rowsQty(); xRow++) {
      let startRow = -1;
      let startCol = -1;
      for (
        let row = xRow + 1, col = 1;
        row < Gameplay.rowsQty() && col < Gameplay.columnsQty();
        row++, col++
      ) {
        if (Gameplay._diagonalMatch(-1, row, -1, col)) {
          if (startRow == -1 && startCol == -1) {
            startRow = row - 1;
            startCol = col - 1;
          } else if (
            row == Gameplay.rowsQty() - 1 ||
            col == Gameplay.columnsQty() - 1
          ) {
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

  static _squareMatching(match: boolean[][], board: Colors[][]) {
    for (let row = 1; row < Gameplay.rowsQty(); row++) {
      for (let col = 1; col < Gameplay.columnsQty(); col++) {
        if (
          board[row][col - 1] == board[row][col] &&
          board[row - 1][col - 1] == board[row][col] &&
          board[row - 1][col] == board[row][col] &&
          board[row][col] != Colors.white &&
          board[row][col] != Colors.black
        ) {
          match[row][col] = true;
          match[row][col - 1] = true;
          match[row - 1][col - 1] = true;
          match[row - 1][col] = true;
        }
      }
    }
  }

  static _crossSquareMatching(match: boolean[][], board: Colors[][]) {
    for (let row = 1; row < Gameplay.rowsQty(); row++) {
      for (let col = 1; col < Gameplay.columnsQty(); col++) {
        if (
          board[row][col] == board[row - 1][col - 1] &&
          board[row][col - 1] == board[row - 1][col] &&
          board[row][col] != Colors.white &&
          board[row][col] != Colors.black
        ) {
          match[row][col] = true;
          match[row][col - 1] = true;
          match[row - 1][col - 1] = true;
          match[row - 1][col] = true;
        }
      }
    }
  }

  static _checkCollapsed(match: boolean[][], mark: boolean): boolean {
    let result = false;
    for (let row = 0; row < Gameplay.rowsQty(); row++) {
      for (let col = 0; col < Gameplay.columnsQty(); col++) {
        if (match[row][col]) {
          if (mark) {
            Gameplay.board[row][col] = Colors.black;
            // score++;
          }
          result = true;
        }
      }
    }
    return result;
  }

  static _getNextBoard(): Colors[][] {
    const result: Colors[][] = [...Gameplay.board];
    if (Gameplay.actorPosRow >= 0) {
      result[Gameplay.actorPosRow][Gameplay.actorPosCol] = Gameplay.shape[0];
    }
    if (Gameplay.actorPosRow + 1 >= 0) {
      result[Gameplay.actorPosRow + 1][Gameplay.actorPosCol] =
        Gameplay.shape[1];
    }
    if (Gameplay.actorPosRow + 2 >= 0) {
      result[Gameplay.actorPosRow + 2][Gameplay.actorPosCol] =
        Gameplay.shape[2];
    }
    return result;
  }
}
