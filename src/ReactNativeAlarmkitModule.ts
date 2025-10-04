import { NativeModule, requireNativeModule } from 'expo';

import { ReactNativeAlarmkitModuleEvents } from './ReactNativeAlarmkit.types';

declare class ReactNativeAlarmkitModule extends NativeModule<ReactNativeAlarmkitModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ReactNativeAlarmkitModule>('ReactNativeAlarmkit');
