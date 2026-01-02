import { NativeModule, requireNativeModule } from "expo";

import { ReactNativeAlarmkitModuleEvents } from "./ReactNativeAlarmkit.types";

declare class ReactNativeAlarmkitModule extends NativeModule<ReactNativeAlarmkitModuleEvents> {
  requestAuthorization(): Promise<boolean>;
  scheduleAlarm(
    hour: number,
    minute: number,
    repeats: number[]
  ): Promise<string>;
  listAlarms(): Promise<[]>;
  cancelAlarm(id: string): Promise<void>; // TODO: implement in native code
  cancelAllAlarms(): Promise<void>;
}

export default requireNativeModule<ReactNativeAlarmkitModule>(
  "ReactNativeAlarmkit"
);
