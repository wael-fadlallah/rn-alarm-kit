import { requireNativeView } from 'expo';
import * as React from 'react';

import { ReactNativeAlarmkitViewProps } from './ReactNativeAlarmkit.types';

const NativeView: React.ComponentType<ReactNativeAlarmkitViewProps> =
  requireNativeView('ReactNativeAlarmkit');

export default function ReactNativeAlarmkitView(props: ReactNativeAlarmkitViewProps) {
  return <NativeView {...props} />;
}
