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
  CONNECTING,
  RUNNING,
  DAEMON,
  ERROR,
}

export enum Collections {
  Users = "users",
  // Contacts = "friends",
  Wechats = "wechats",
  Rooms = "rooms",
  Friends = "friends",
  Services = "services",
  Feedback = "feedback",
}

export enum Visibility {
  LoginModal = "login_modal",
  FeedbackModal = "feedback_modal",
  ScanModal = "scan_modal",
}

export enum Network {
  FriendsPulling = "contacts_pulling",
  RoomsPulling = "rooms_pulling",
  ServerRequesting = "server_requesting",
  ServerStarting = "server_starting",
  BackendConnected = "backend_connected",
  LoggingOut = "logging_out",
  RobotRunning = "robot_running",
}

export enum CookieKeys {
  user = "user",
  wechat = "wechat",
}
