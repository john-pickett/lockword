import React, { useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import LetterDial from './src/components/LetterDial';
import { COMMON_FIVE_LETTER_WORDS } from './src/data/fiveLetterWords';

export default function App() {
  const randomWord = useMemo(() => {
    const index = Math.floor(Math.random() * COMMON_FIVE_LETTER_WORDS.length);
    return COMMON_FIVE_LETTER_WORDS[index].toUpperCase();
  }, []);
  const letters = randomWord.split('');

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {letters.map((letter, i) => (
          <View key={i} style={styles.dial}>
            <LetterDial initialLetter={letter} />
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
