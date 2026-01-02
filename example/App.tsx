import ReactNativeAlarmkit from "react-native-alarmkit";
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
} from "react-native";
import { useState } from "react";

export default function App() {
  const [time, setTime] = useState({ hour: "", minute: "" });
  const [alarms, setAlarms] = useState<{}[]>([]);

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
        true
      );
      console.log("Alarm scheduled with ID:", alarmId);
      setTime({ hour: "", minute: "" });
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
            placeholder="Hour"
            keyboardType="numeric"
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
            value={time.hour}
            onChangeText={(text) => setTime({ ...time, hour: text })}
          />
          <TextInput
            placeholder="Minute"
            keyboardType="numeric"
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
            value={time.minute}
            onChangeText={(text) => setTime({ ...time, minute: text })}
          />
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
};
