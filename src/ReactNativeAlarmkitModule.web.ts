import { registerWebModule, NativeModule } from 'expo';

import { ReactNativeAlarmkitModuleEvents } from './ReactNativeAlarmkit.types';

class ReactNativeAlarmkitModule extends NativeModule<ReactNativeAlarmkitModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ReactNativeAlarmkitModule, 'ReactNativeAlarmkitModule');
