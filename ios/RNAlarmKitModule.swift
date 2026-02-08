import ExpoModulesCore
import AlarmKit
import SwiftUI
import AppIntents

struct EmptyMetadata: AlarmMetadata {}

@available(iOS 26.0, *)
public struct AlarmDismissedIntent: LiveActivityIntent {
  public static var title: LocalizedStringResource = "Alarm Dismissed"
  public static var openAppWhenRun: Bool = true

  @Parameter(title: "alarmID")
  public var alarmIdentifier: String

  public init() {
    self.alarmIdentifier = ""
  }

  public init(alarmIdentifier: String) {
    self.alarmIdentifier = alarmIdentifier
  }

  public func perform() async throws -> some IntentResult {
    NotificationCenter.default.post(
      name: NSNotification.Name("AlarmDismissed"),
      object: nil,
      userInfo: ["alarmID": alarmIdentifier]
    )
    return .result()
  }
}

@available(iOS 26.0, *)
public class RNAlarmKitModule: Module {
  let alarmManager = AlarmManager.shared
  private var notificationObserver: NSObjectProtocol?
  private var alarmUpdatesTask: Task<Void, Never>?
  private var alertingAlarmIds: Set<String> = []

  public func definition() -> ModuleDefinition {
    Name("RNAlarmKit")

    Events("onAlarmDismissed", "onAlarmFired")

    OnCreate {
      // Listen for alarm dismissed notifications from the AppIntent
      self.notificationObserver = NotificationCenter.default.addObserver(
        forName: NSNotification.Name("AlarmDismissed"),
        object: nil,
        queue: .main
      ) { [weak self] notification in
        if let alarmID = notification.userInfo?["alarmID"] as? String {
          self?.sendEvent("onAlarmDismissed", [
            "alarmId": alarmID
          ])
        }
      }

      self.alarmUpdatesTask = Task { [weak self] in
        guard let self = self else { return }
        for await alarms in self.alarmManager.alarmUpdates {
          if Task.isCancelled { break }

          var currentlyAlerting = Set<String>()

          for alarm in alarms {
            let alarmIdString = alarm.id.uuidString

            if case .alerting = alarm.state {
              currentlyAlerting.insert(alarmIdString)

              if !self.alertingAlarmIds.contains(alarmIdString) {
                DispatchQueue.main.async {
                  self.sendEvent("onAlarmFired", [
                    "alarmId": alarmIdString
                  ])
                }
              }
            }
          }

          self.alertingAlarmIds = currentlyAlerting
        }
      }
    }

    OnDestroy {
      if let observer = self.notificationObserver {
        NotificationCenter.default.removeObserver(observer)
      }
      self.alarmUpdatesTask?.cancel()
      self.alarmUpdatesTask = nil
      self.alertingAlarmIds.removeAll()
    }

    AsyncFunction("requestAuthorization") {
        do {
          let state = try await alarmManager.requestAuthorization()
          return state == .authorized
        } catch {
          print("Error requesting authorization: \(error)")
          return false
        }
    }

    AsyncFunction("scheduleAlarm") { (hour: Int, minute: Int, repeatDays: [Int]?, config: [String: String]) in
      do {
        let id = UUID()
        let title = config["title"] ?? "Alarm"
        let stopButtonText = config["stopButtonText"] ?? "Stop"
        let textColorHex = config["textColor"] ?? "#0000FF"
        let tintColorHex = config["tintColor"] ?? "#FF0000"
        let dismissIntent = AlarmDismissedIntent(alarmIdentifier: id.uuidString)

        let textColor = colorFromHex(textColorHex)
        let tintColor = colorFromHex(tintColorHex)

        let titleResource = LocalizedStringResource(stringLiteral: title)
        let stopButtonTextResource = LocalizedStringResource(stringLiteral: stopButtonText)
        
        let attributes = AlarmAttributes(
          presentation: AlarmPresentation(
            alert: AlarmPresentation.Alert(
              title: titleResource,
              stopButton: AlarmButton(
                text: stopButtonTextResource,
                textColor: textColor,
                systemImageName: "stop.circle"
              )
            )
          ),
          metadata: EmptyMetadata(),
          tintColor: tintColor
        )

        let time = Alarm.Schedule.Relative.Time(
          hour: hour,
          minute: minute
        )
        let cadence: Alarm.Schedule.Relative.Recurrence = (repeatDays != nil && !repeatDays!.isEmpty)
        ? .weekly(weekdayFromInt(days: repeatDays!))
        : .never

        let schedule = Alarm.Schedule.relative(.init(
          time: time,
          repeats: cadence
        ))


        let alarmConfiguration = AlarmManager.AlarmConfiguration(
          schedule: schedule,
          attributes: attributes,
          stopIntent: dismissIntent,
          secondaryIntent: dismissIntent,
          
        )

        let alarm = try await alarmManager.schedule(id: id, configuration: alarmConfiguration)
        print(alarm.schedule.debugDescription)
        return alarm.id.uuidString
      } catch {
        print("Error scheduling alarm: \(error)")
        throw error
      }
    }
    
    Function("listAlarms") {
      do {
        let alarms = try alarmManager.alarms
        return alarms.map { alarmToDict($0) }
      } catch {
        print("Error listing alarms: \(error)")
        throw error
      }
    }

    AsyncFunction("getAlarm") { (alarmId: String) -> [String: String]? in
      guard let uuid = UUID(uuidString: alarmId) else {
        return nil
      }

      let alarms = try alarmManager.alarms
      if let alarm = alarms.first(where: { $0.id == uuid }) {
        return alarmToDict(alarm)
      }
      return nil
    }
    
    Function("cancelAllAlarms") {
      do {
        let alarms = try alarmManager.alarms
        var cancelledCount = 0
        
        for alarm in alarms {
          try alarmManager.cancel(id: alarm.id)
          cancelledCount += 1
        }
        
        return ["success": true, "cancelledCount": cancelledCount]
      } catch {
        print("Error clearing alarms: \(error)")
        throw error
      }
    }

    AsyncFunction("cancelAlarm") { (alarmId: String) in
      guard let uuid = UUID(uuidString: alarmId) else {
        throw NSError(domain: "RNAlarmKit", code: 1, userInfo: [NSLocalizedDescriptionKey: "Invalid UUID string"])
      }
      do {
        try alarmManager.cancel(id: uuid)
        return ["success": true]
      } catch {
        print("Error cancelling alarm: \(error)")
        throw error
      }
    }


  }
  
  private func alarmToDict(_ alarm: Alarm) -> [String: String] {
    var scheduleInfo = "N/A"

    if case .relative(let relativeSchedule) = alarm.schedule {
      let hour = relativeSchedule.time.hour
      let minute = relativeSchedule.time.minute
      let timeString = String(format: "%02d:%02d", hour, minute)

      switch relativeSchedule.repeats {
      case .never:
        scheduleInfo = "\(timeString) (Once)"
      case .weekly(let weekdays):
        let dayNames = weekdays.map { weekdayToString($0) }.joined(separator: ", ")
        scheduleInfo = "\(timeString) (\(dayNames))"
      @unknown default:
        scheduleInfo = timeString
      }
    }

    return [
      "id": alarm.id.uuidString,
      "state": String(describing: alarm.state),
      "scheduledTime": scheduleInfo
    ]
  }

  private func weekdayToString(_ weekday: Locale.Weekday) -> String {
    switch weekday {
    case .sunday: return "Sun"
    case .monday: return "Mon"
    case .tuesday: return "Tue"
    case .wednesday: return "Wed"
    case .thursday: return "Thu"
    case .friday: return "Fri"
    case .saturday: return "Sat"
    @unknown default: return "Unknown"
    }
  }
  
  private func weekdayFromInt(days: [Int]) -> [Locale.Weekday] {
    if !days.isEmpty {
      let weekdays = days.compactMap { day -> Locale.Weekday? in
        switch day {
          case 1: return .sunday
          case 2: return .monday
          case 3: return .tuesday
          case 4: return .wednesday
          case 5: return .thursday
          case 6: return .friday
          case 7: return .saturday
          default: return nil
        }
      }
      return weekdays
    }
    return []
  }

  private func colorFromHex(_ hex: String) -> Color {
    var hexSanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines)
    hexSanitized = hexSanitized.replacingOccurrences(of: "#", with: "")

    var rgb: UInt64 = 0
    Scanner(string: hexSanitized).scanHexInt64(&rgb)

    let red = Double((rgb & 0xFF0000) >> 16) / 255.0
    let green = Double((rgb & 0x00FF00) >> 8) / 255.0
    let blue = Double(rgb & 0x0000FF) / 255.0

    return Color(red: red, green: green, blue: blue)
  }
}

