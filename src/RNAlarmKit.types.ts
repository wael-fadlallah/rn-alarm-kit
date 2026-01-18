export type AlarmkitModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type AlarmConfig = {
  title: string;
  stopButtonText: string;
  textColor: string;
  tintColor: string;
};
