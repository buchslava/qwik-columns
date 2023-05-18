export enum Phase {
  inactive,
  moving,
  matchRequest,
  collapseRequest,
  drop,
}
export class Global {
  static hMaxCount = 11;
  static vMaxCount = 27;
  static hDefaultCount = 7;
  static vDefaultCount = 21;
  static ihCount = 7;
  static vCount = 21;
  static hCount = 7;
  static cellWidth = -1;
  static bodyPadding = 0.0;
  static showControlBar = false;
  static showNextShape = true;
  static hasInitGameState = false;

  static phase = Phase.inactive;
  static copyPhase = null;
  static playTime = 0;
  static isPause = false;
  static isGameOver = false;

  static resetInfoData() {
    this.phase = Phase.inactive;
    this.playTime = 0;
    this.isPause = false;
    this.isGameOver = false;
  }
}
