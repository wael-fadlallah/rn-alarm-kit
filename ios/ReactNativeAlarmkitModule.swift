import ExpoModulesCore
import AlarmKit
import SwiftUI

struct EmptyMetadata: AlarmMetadata {}

@available(iOS 26.0, *)
public class ReactNativeAlarmkitModule: Module {
  let alarmManager = AlarmManager.shared

  public func definition() -> ModuleDefinition {
    Name("ReactNativeAlarmkit")

    Function("hello") {
      return "Hello IOS module!!! 👋"
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
    
    
    
    AsyncFunction("scheduleAlarm") { (hour: Int, minute: Int, repeats: Bool) in
      do {
        
        let id = UUID()
        
        let attributes = AlarmAttributes(
          presentation: AlarmPresentation(
            alert: AlarmPresentation.Alert(
              title: "Hello World!",
              stopButton: AlarmButton.init(text: "Bye", textColor: Color.blue, systemImageName: "stop.circle")
            )
          ),
          metadata: EmptyMetadata(),
          tintColor: Color.red
        )

        let time = Alarm.Schedule.Relative.Time(
          hour: hour,
          minute: minute
        )
        let schedule = Alarm.Schedule.relative(.init(
          time: time,
        ))

        let alarmConfiguration = AlarmManager.AlarmConfiguration(
          schedule: schedule,
          attributes: attributes
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
        return alarms.map { alarm in
          var scheduleInfo = "N/A"
          
          // Extract schedule information
          if case .relative(let relativeSchedule) = alarm.schedule {
            let hour = relativeSchedule.time.hour
            let minute = relativeSchedule.time.minute
            scheduleInfo = String(format: "%02d:%02d", hour, minute)
          }
          
          return [
            "id": alarm.id.uuidString,
            "state": String(describing: alarm.state),
            "scheduledTime": scheduleInfo
          ]
        }
      } catch {
        print("Error listing alarms: \(error)")
        throw error
      }
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


  }
}
