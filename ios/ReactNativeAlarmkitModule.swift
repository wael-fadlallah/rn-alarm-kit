import ExpoModulesCore
import AlarmKit

public class ReactNativeAlarmkitModule: Module {
  
  public func definition() -> ModuleDefinition {
    Name("ReactNativeAlarmkit")

    Function("hello") {
      return "Hello IOS module! 12 👋"
    }

    AsyncFunction("requestAuthorization") {
      if #available(iOS 26.0, *) {
        do {
          let alarmManager = AlarmManager.shared
          let state = try await alarmManager.requestAuthorization()
          return state == .authorized
        } catch {
          print("Error requesting authorization: \(error)")
          return false
        }
      } else {
        print("AlarmManager is only available on iOS 26.0 or newer.")
        return false
      }
    }

    AsyncFunction("setValueAsync") { (value: String) in
      self.sendEvent("onChange", [
        "value": value
      ])
    }
  }
}
