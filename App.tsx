import React, { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Button, ScrollView } from 'react-native';
import LetterDial from './src/components/LetterDial';
import { COMMON_FIVE_LETTER_WORDS } from './src/data/fiveLetterWords';

export default function App() {
  const randomWord = useMemo(() => {
    const index = Math.floor(Math.random() * COMMON_FIVE_LETTER_WORDS.length);
    return COMMON_FIVE_LETTER_WORDS[index].toUpperCase();
  }, []);
  const [letters, setLetters] = useState(() => randomWord.split(''));
  const [words, setWords] = useState<string[]>([]);

  const handleLetterChange = (index: number, letter: string) => {
    setLetters(prev => {
      const updated = [...prev];
      updated[index] = letter;
      return updated;
    });
  };

  const handleSubmit = () => {
    const word = letters.join('');
    setWords(prev => [...prev, word]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.wordsArea} contentContainerStyle={styles.wordsContent}>
        <Text style={styles.randomWord}>{randomWord}</Text>
        {words.map((word, i) => (
          <Text key={`${word}-${i}`} style={styles.submittedWord}>
            {word}
          </Text>
        ))}
      </ScrollView>
      <View style={styles.bottomArea}>
        <View style={styles.row}>
          {letters.map((letter, i) => (
            <View key={i} style={styles.dial}>
              <LetterDial
                initialLetter={letter}
                onChange={l => handleLetterChange(i, l)}
              />
            </View>
          ))}
        </View>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
      <StatusBar style="auto" />
    </View>
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
});
