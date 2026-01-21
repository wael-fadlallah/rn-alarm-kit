export type AlarmkitModuleEvents = {
  onAlarmDismissed: (params: AlarmDismissedPayload) => void;
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
