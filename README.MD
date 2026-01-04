# react-native-alarmkit

A React Native module that provides native alarm scheduling capabilities using iOS 26's AlarmKit framework. Schedule one-time or recurring alarms with custom UI presentations.

## Features

- ✅ Schedule alarms at specific times (24-hour format)
- ✅ One-time or recurring alarms (weekly schedule)
- ✅ Custom alarm UI with title, buttons, and colors
- ✅ Request alarm authorization
- ✅ List all scheduled alarms
- ✅ Cancel all alarms
- ✅ Built with Expo Modules for seamless integration

## Requirements

- iOS 26.0+
- React Native with Expo
- Xcode 26.0+

## Installation

```bash
npm install react-native-alarmkit
```

Or with yarn:

```bash
yarn add react-native-alarmkit
```

### iOS Setup

Add the following to your `Info.plist`:

```xml
<key>NSAlarmKitUsageDescription</key>
<string>We'll schedule alerts for alarms you create within our app.</string>
```

Update your Podfile to set the minimum iOS version:

```ruby
platform :ios, '26.0'
```

Then run:

```bash
cd ios && pod install
```

## Usage

### Request Authorization

Before scheduling alarms, request user authorization:

```typescript
import ReactNativeAlarmkit from "react-native-alarmkit";

const authorized = await ReactNativeAlarmkit.requestAuthorization();
if (authorized) {
  console.log("Alarm permissions granted");
}
```

### Schedule a One-Time Alarm

```typescript
// Schedule alarm for 8:30 AM (one-time)
const alarmId = await ReactNativeAlarmkit.scheduleAlarm(
  8, // hour (0-23)
  30, // minute (0-59)
  null // no repeat days
);

console.log("Alarm scheduled:", alarmId);
```

### Schedule a Recurring Alarm

```typescript
// Schedule alarm for 7:00 AM on Monday, Wednesday, Friday
const alarmId = await ReactNativeAlarmkit.scheduleAlarm(
  7, // hour
  0, // minute
  [2, 4, 6] // days: 1=Sun, 2=Mon, 3=Tue, 4=Wed, 5=Thu, 6=Fri, 7=Sat
);
```

### Schedule Daily Alarm

```typescript
// Schedule alarm for 6:00 AM every day
const alarmId = await ReactNativeAlarmkit.scheduleAlarm(
  6,
  0,
  [1, 2, 3, 4, 5, 6, 7] // All days
);
```

### List All Alarms

```typescript
const alarms = ReactNativeAlarmkit.listAlarms();

// Returns array of alarm objects:
// [
//   {
//     id: "UUID-STRING",
//     state: "scheduled",
//     scheduledTime: "08:30 (Mon, Wed, Fri)"
//   }
// ]
```

### Cancel All Alarms

```typescript
const result = ReactNativeAlarmkit.cancelAllAlarms();
console.log(`Cancelled ${result.cancelledCount} alarms`);
```

## API Reference

### `requestAuthorization(): Promise<boolean>`

Requests permission to schedule alarms. Returns `true` if authorized, `false` otherwise.

### `scheduleAlarm(hour: number, minute: number, repeatDays: number[] | null): Promise<string>`

Schedules an alarm and returns its unique ID.

**Parameters:**

- `hour` (0-23): Hour in 24-hour format
- `minute` (0-59): Minute
- `repeatDays` (optional): Array of days to repeat (1=Sunday, 2=Monday, ..., 7=Saturday). Pass `null` or empty array for one-time alarm.

**Returns:** Alarm UUID as a string

### `listAlarms(): Array<AlarmInfo>`

Returns all scheduled alarms.

**Returns:** Array of objects with:

- `id`: Alarm UUID
- `state`: Current alarm state (e.g., "scheduled", "alerting")
- `scheduledTime`: Formatted time and repeat days (e.g., "08:30 (Mon, Wed)")

### `cancelAllAlarms(): { success: boolean, cancelledCount: number }`

Cancels all scheduled alarms.

**Returns:** Object with success status and count of cancelled alarms

## Example

See the [example app](./example) for a complete implementation with a UI for:

- Day selection checkboxes
- Time input (hour and minute)
- Alarm listing
- Cancel all functionality

## Day Number Reference

When scheduling recurring alarms, use these numbers:

- `1` - Sunday
- `2` - Monday
- `3` - Tuesday
- `4` - Wednesday
- `5` - Thursday
- `6` - Friday
- `7` - Saturday

## Time Format

All times use **24-hour format**:

- `0` = midnight (12:00 AM)
- `12` = noon (12:00 PM)
- `23` = 11:00 PM

## Platform Support

Currently **iOS only** (requires iOS 26.0+). Android support is not available as AlarmKit is an iOS-exclusive framework.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT

## Author

Wael Fadlallah ([@wael-fadlallah](https://github.com/wael-fadlallah))

## Links

- [GitHub Repository](https://github.com/wael-fadlallah/react-native-alarmkit)
- [Report Issues](https://github.com/wael-fadlallah/react-native-alarmkit/issues)
- [Apple AlarmKit Documentation](https://developer.apple.com/documentation/alarmkit)
