import { NativeModule, requireNativeModule } from "expo";

import { AlarmkitModuleEvents } from "./RNAlarmKit.types";

declare class AlarmkitModule extends NativeModule<AlarmkitModuleEvents> {
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

export default requireNativeModule<AlarmkitModule>("RNAlarmKit");
