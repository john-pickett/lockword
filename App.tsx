import React, { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Button, ScrollView } from 'react-native';
import LetterDial from './src/components/LetterDial';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { randomWordPairTwoStepsApart } from './src/utils/wordLadder';

export default function App() {
  const { start, end } = useMemo(() => randomWordPairTwoStepsApart(), []);
  const [baseLetters, setBaseLetters] = useState(() => start.split(''));
  const [letters, setLetters] = useState(() => start.split(''));
  const [words, setWords] = useState<string[]>([]);
  const [hasWon, setHasWon] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleLetterChange = (index: number, letter: string) => {
    const updated = [...letters];
    updated[index] = letter;
    setLetters(updated);
    const diffs = updated.reduce<number[]>((acc, l, i) => {
      if (l !== baseLetters[i]) acc.push(i);
      return acc;
    }, []);
    setActiveIndex(diffs.length ? diffs[0] : null);
  };

  const handleSubmit = () => {
    const word = letters.join('');
    setWords(prev => [...prev, word]);
    if (word === end) {
      setHasWon(true);
    }
    setBaseLetters([...letters]);
    setActiveIndex(null);
  };

  const handleReset = () => {
    setLetters(baseLetters);
    setActiveIndex(null);
  };

  return (
    <SafeAreaProvider>
      {/* Only apply the safe area to the top so content clears the notch/status bar */}
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={styles.wordsArea} contentContainerStyle={styles.wordsContent}>
          <Text style={styles.randomWord}>{start}</Text>
          <Text style={styles.randomWord}>?????</Text>
          <Text style={styles.randomWord}>{end}</Text>
          {words.map((word, i) => (
            <Text key={`${word}-${i}`} style={styles.submittedWord}>
              {word}
            </Text>
          ))}
          {hasWon && <Text style={styles.winner}>You win!</Text>}
        </ScrollView>

        <View style={styles.bottomArea}>
          <View style={styles.row}>
            {letters.map((letter, i) => (
              <View key={i} style={styles.dial}>
                <LetterDial
                  initialLetter={letter}
                  onChange={l => handleLetterChange(i, l)}
                  disabled={activeIndex !== null && activeIndex !== i}
                />
              </View>
            ))}
          </View>
          <View style={styles.buttonRow}>
            <Button title="Reset" onPress={handleReset} />
            <View style={styles.buttonSpacer} />
            <Button title="Submit" onPress={handleSubmit} />
          </View>
        </View>

        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wordsArea: {
    flex: 2,
  },
  wordsContent: {
    alignItems: 'center',
    paddingTop: 40,
  },
  randomWord: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submittedWord: {
    fontSize: 24,
    marginTop: 8,
  },
  winner: {
    fontSize: 32,
    color: 'green',
    marginTop: 16,
  },
  bottomArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dial: {
    width: 60,
    height: 180,
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonSpacer: {
    width: 16,
  },
});
