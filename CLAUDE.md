# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo Module that provides React Native bindings for iOS 26's AlarmKit framework. The module enables scheduling system-level alarms with one-time or recurring schedules.

**Important constraints:**
- iOS 26.0+ only (Android support is planned but not implemented)
- Built using Expo Modules framework
- Uses Swift 5.9 for native iOS implementation

## Commands

### Building & Development
```bash
# Build the module
npm run build

# Clean build artifacts
npm run clean

# Lint code
npm run lint

# Run tests
npm test

# Prepare module for publishing
npm run prepare

# Open iOS project in Xcode
npm run open:ios

# Open Android project in Android Studio (not yet functional)
npm run open:android
```

### Example App
The example app is located in `./example/` and is used for testing the module:
```bash
cd example
npm install
npx expo start
```

## Architecture

### Module Structure

```
src/
├── index.ts                    # Main entry point, exports module and types
├── RNAlarmKitModule.ts         # TypeScript interface to native module
└── RNAlarmKit.types.ts         # TypeScript type definitions

ios/
├── RNAlarmKitModule.swift      # Swift implementation using AlarmKit
├── RNAlarmKitView.swift        # SwiftUI view (currently minimal)
└── RNAlarmKit.podspec          # CocoaPods specification

android/                        # Stubbed out, not yet implemented
```

### Key Design Patterns

**Expo Modules Architecture:**
- Native module is defined using Expo Modules DSL in Swift
- The module is registered with name "RNAlarmKit"
- TypeScript uses `requireNativeModule()` to access native functionality
- Configuration in `expo-module.config.json` specifies iOS-only platform support

**Native Bridge:**
- All alarm operations go through `AlarmManager.shared` (iOS AlarmKit singleton)
- Async operations use `AsyncFunction` from Expo Modules
- Day representation: 1=Sunday through 7=Saturday (converted to `Locale.Weekday` in Swift)

**Schedule Handling:**
- Uses `Alarm.Schedule.Relative` with `.Time(hour:minute:)`
- Recurrence: `.weekly([Locale.Weekday])` for recurring, `.never` for one-time
- Empty/null `repeatDays` array creates one-time alarms

**Alarm Attributes:**
- Configurable via `AlarmConfig` object: title, stopButtonText, textColor, tintColor
- Colors are passed as hex strings (e.g., "#FF0000") and converted to SwiftUI Color
- Uses `EmptyMetadata` struct as placeholder for custom metadata

## iOS-Specific Requirements

**Info.plist Entry Required:**
```xml
<key>NSAlarmKitUsageDescription</key>
<string>We'll schedule alerts for alarms you create within our app.</string>
```

**Minimum Deployment Target:**
- iOS 26.0 (set in podspec and Podfile)
- Swift 5.9

**AlarmKit Framework:**
- Requires `@available(iOS 26.0, *)` attribute on module class
- Uses `AlarmManager.shared` for all operations
- Authorization state: `.authorized`, `.denied`, `.notDetermined`

## Current Limitations & TODOs

1. **Missing Implementation:**
   - `cancelAlarm(id: string)` is declared in TypeScript but not implemented in Swift
   - Android support is completely absent

2. **No Custom Metadata:**
   - Currently uses `EmptyMetadata` struct
   - Custom metadata support would require defining a proper metadata type

## TypeScript Types

The module exports these primary types:
- `AlarmkitModuleEvents` - Event types for native module events
- `ChangeEventPayload` - Payload structure for onChange events (currently unused)
- `AlarmConfig` - Configuration object for alarm UI (title, stopButtonText, textColor, tintColor)

## Testing

The `example/` directory contains a full test app with UI for:
- Requesting authorization
- Day selection checkboxes
- Hour/minute input
- Listing scheduled alarms
- Cancelling all alarms

To test changes, always run the example app on an iOS 26+ device/simulator.
