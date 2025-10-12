import ReactNativeAlarmkit from 'react-native-alarmkit';
import { Button, SafeAreaView, ScrollView, Text, View } from 'react-native';

export default function App() {
  const requestAuthorization = async () => {
    try {
      const granted = await ReactNativeAlarmkit.requestAuthorization();
      console.log('Authorization result:', granted);
      if (granted) 
        console.log('Authorization granted');
    } catch (error) {
      console.error('Authorization denied', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>
        <Group name="Functions">
          <Text>{ReactNativeAlarmkit.hello()}</Text>
        </Group>
        <Group name="Request Authorization">
          <Button title="Request Authorization" onPress={requestAuthorization} />
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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  view: {
    flex: 1,
    height: 200,
  },
};
