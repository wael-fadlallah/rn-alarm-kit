import { NativeModule, requireNativeModule } from "expo";

import { AlarmkitModuleEvents, AlarmConfig, AlarmInfo } from "./RNAlarmKit.types";

declare class AlarmkitModule extends NativeModule<AlarmkitModuleEvents> {
  requestAuthorization(): Promise<boolean>;
  scheduleAlarm(
    hour: number,
    minute: number,
    repeats: number[],
    config: AlarmConfig
  ): Promise<string>;
  listAlarms(): Promise<AlarmInfo[]>;
  cancelAlarm(id: string): Promise<void>; // TODO: implement in native code
  cancelAllAlarms(): Promise<void>;
}

export default requireNativeModule<AlarmkitModule>("RNAlarmKit");
