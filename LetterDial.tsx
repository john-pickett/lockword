import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const ITEM_HEIGHT = 60;

interface Props {
  initialLetter?: string;
  onChange?: (letter: string) => void;
}

export default function LetterDial({ initialLetter = 'A', onChange }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const [current, setCurrent] = useState(initialLetter.toUpperCase());

  useEffect(() => {
    const index = LETTERS.indexOf(current);
    if (index >= 0) {
      scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: false });
    }
  }, [current]);

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const letter = LETTERS[index] || 'A';
    setCurrent(letter);
    onChange?.(letter);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumEnd}
      >
        {LETTERS.map((letter) => (
          <View key={letter} style={styles.item}>
            <Text style={styles.letter}>{letter}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
    width: '100%',
    overflow: 'hidden',
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
