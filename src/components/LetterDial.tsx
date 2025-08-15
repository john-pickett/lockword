import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const ITEM_HEIGHT = 60;
const EXTENDED_LETTERS = Array.from(
  { length: LETTERS.length * 3 },
  (_, i) => LETTERS[i % LETTERS.length],
);

interface Props {
  initialLetter?: string;
  onChange?: (letter: string) => void;
}

export default function LetterDial({ initialLetter = 'A', onChange }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const startIndex =
    LETTERS.indexOf(initialLetter.toUpperCase()) + LETTERS.length;
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: (startIndex - 1) * ITEM_HEIGHT,
      animated: false,
    });
  }, [startIndex]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT) + 1;
    setCurrentIndex(index);
  };

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    let index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT) + 1;
    const mod = ((index % LETTERS.length) + LETTERS.length) % LETTERS.length;
    const adjustedIndex = LETTERS.length + mod;
    if (index !== adjustedIndex) {
      scrollRef.current?.scrollTo({
        y: (adjustedIndex - 1) * ITEM_HEIGHT,
        animated: false,
      });
      index = adjustedIndex;
    }
    setCurrentIndex(index);
    onChange?.(LETTERS[mod]);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumEnd}
          scrollEventThrottle={16}
        >
          {EXTENDED_LETTERS.map((letter, i) => {
            const isSelected = i === currentIndex;
            return (
              <View
                key={`${letter}-${i}`}
                style={[styles.item, isSelected && styles.selectedItem]}
              >
                <Text
                  style={[styles.letter, isSelected ? styles.selected : styles.adjacent]}
                >
                  {letter}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    height: ITEM_HEIGHT * 3,
    width: '100%',
    overflow: 'hidden',
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  letter: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  selected: {
  },
  adjacent: {
    color: '#aaa',
  },
});
