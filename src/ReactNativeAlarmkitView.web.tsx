import * as React from 'react';

import { ReactNativeAlarmkitViewProps } from './ReactNativeAlarmkit.types';

export default function ReactNativeAlarmkitView(props: ReactNativeAlarmkitViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
