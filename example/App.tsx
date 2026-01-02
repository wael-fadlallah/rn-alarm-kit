import ReactNativeAlarmkit from "react-native-alarmkit";
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";

const WEEKDAYS = [
  { id: 1, name: "Sun", fullName: "Sunday" },
  { id: 2, name: "Mon", fullName: "Monday" },
  { id: 3, name: "Tue", fullName: "Tuesday" },
  { id: 4, name: "Wed", fullName: "Wednesday" },
  { id: 5, name: "Thu", fullName: "Thursday" },
  { id: 6, name: "Fri", fullName: "Friday" },
  { id: 7, name: "Sat", fullName: "Saturday" },
];

export default function App() {
  const [time, setTime] = useState({ hour: "", minute: "" });
  const [alarms, setAlarms] = useState<{}[]>([]);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const requestAuthorization = async () => {
    try {
      const granted = await ReactNativeAlarmkit.requestAuthorization();
      console.log("Authorization result:", granted);
      if (granted) console.log("Authorization granted");
    } catch (error) {
      console.error("Authorization denied", error);
    }
  };

  const scheduleAlarm = async () => {
    try {
      const alarmId = await ReactNativeAlarmkit.scheduleAlarm(
        parseInt(time.hour),
        parseInt(time.minute),
        selectedDays
      );
      console.log("Alarm scheduled with ID:", alarmId);
      setTime({ hour: "", minute: "" });
      setSelectedDays([]);
    } catch (error) {
      console.error("Failed to schedule alarm", error);
    }
  };

  const listAlarms = () => {
    return ReactNativeAlarmkit.listAlarms();
  };

  const handleClearAlarms = async () => {
    await ReactNativeAlarmkit.cancelAllAlarms();
    setAlarms([]);
  };

  const toggleDay = (dayId: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayId)
        ? prev.filter((id) => id !== dayId)
        : [...prev, dayId]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>
          ReactNativeAlarmkit Module API Example
        </Text>

        <Group name="Request Authorization">
          <Button
            title="Request Authorization"
            onPress={requestAuthorization}
          />
        </Group>

        <Group name="Schedule Alarm">
          <TextInput
            placeholder="Hour (0-23)"
            keyboardType="numeric"
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
            value={time.hour}
            onChangeText={(text) => setTime({ ...time, hour: text })}
          />
          <TextInput
            placeholder="Minute (0-59)"
            keyboardType="numeric"
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
            value={time.minute}
            onChangeText={(text) => setTime({ ...time, minute: text })}
          />

          <Text style={{ marginTop: 10, marginBottom: 10, fontWeight: "bold" }}>
            Repeat on:
          </Text>
          <View style={styles.daysContainer}>
            {WEEKDAYS.map((day) => (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayButton,
                  selectedDays.includes(day.id) && styles.dayButtonSelected,
                ]}
                onPress={() => toggleDay(day.id)}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDays.includes(day.id) && styles.dayTextSelected,
                  ]}
                >
                  {day.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
            {selectedDays.length === 0
              ? "No repeat (one-time alarm)"
              : `Repeats: ${WEEKDAYS.filter((d) => selectedDays.includes(d.id))
                  .map((d) => d.fullName)
                  .join(", ")}`}
          </Text>
          <Button title="Schedule Alarm" onPress={scheduleAlarm} />
        </Group>

        <Group name="List Alarms">
          <Text>{JSON.stringify(listAlarms(), null, 2)}</Text>
        </Group>

        <Group name="Cancel All Alarms">
          <Button title="Cancel All Alarms" onPress={handleClearAlarms} />
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  view: {
    flex: 1,
    height: 200,
  },
  daysContainer: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
    marginBottom: 10,
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  dayButtonSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  dayText: {
    color: "#333",
    fontWeight: "500" as const,
  },
  dayTextSelected: {
    color: "#fff",
  },
};
