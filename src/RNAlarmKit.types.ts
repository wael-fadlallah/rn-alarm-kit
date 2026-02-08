export type AlarmFiredPayload = {
  alarmId: string;
};

export type AlarmkitModuleEvents = {
  onAlarmDismissed: (params: AlarmDismissedPayload) => void;
  onAlarmFired: (params: AlarmFiredPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type AlarmDismissedPayload = {
  alarmId: string;
};

export type AlarmConfig = {
  title: string;
  stopButtonText: string;
  textColor: string;
  tintColor: string;
};

export type AlarmInfo = {
  id: string;
  state: string;
  scheduledTime: string;
};
