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
const VISIBLE_COUNT = 3;
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
      y: startIndex * ITEM_HEIGHT,
      animated: false,
    });
  }, [startIndex]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    setCurrentIndex(index);
  };

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    let index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const mod = ((index % LETTERS.length) + LETTERS.length) % LETTERS.length;
    const adjustedIndex = LETTERS.length + mod;
    if (index !== adjustedIndex) {
      scrollRef.current?.scrollTo({
        y: adjustedIndex * ITEM_HEIGHT,
        animated: false,
      });
      index = adjustedIndex;
    }
    setCurrentIndex(index);
    onChange?.(LETTERS[mod]);
  };

  return (
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
          const isCurrent = i === currentIndex;
          const isAdjacent = i === currentIndex - 1 || i === currentIndex + 1;
          return (
            <View key={`${letter}-${i}`} style={styles.item}>
              <Text
                style={[
                  styles.letter,
                  isCurrent
                    ? styles.selected
                    : isAdjacent
                    ? styles.adjacent
                    : styles.hidden,
                ]}
              >
                {letter}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT * VISIBLE_COUNT,
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
  selected: {
    color: '#000',
  },
  adjacent: {
    color: '#aaa',
  },
  hidden: {
    color: '#000',
    opacity: 0,
  },
});
