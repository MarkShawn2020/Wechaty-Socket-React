export enum TokenType {
  WEB,
  PAD,
  MOBILE,
}

export enum ScanStatus {
  Unknown = 0,
  Cancel = 1,
  Waiting = 2,
  Scanned = 3,
  Confirmed = 4,
  Timeout = 5,
}

export enum ServerStatus {
  IDLE,
  RUNNING,
  DAEMON,
  ERROR,
}

export enum UserStatus {
  UNKNOWN,
  LOGIN,
  LOGOUT,
}
