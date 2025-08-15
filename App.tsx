import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import LetterDial from './src/components/LetterDial';

export default function App() {
  const dials = Array.from({ length: 5 });
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {dials.map((_, i) => (
          <View key={i} style={styles.dial}>
            <LetterDial />
          </View>
        ))}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  dial: {
    width: 60,
    height: 180,
    marginHorizontal: 4,
    overflow: 'hidden',
  },
});
