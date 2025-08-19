import { longFiveLetterWords } from "../data/longFiveLetterWords";

/**
 * Compute the minimum number of single-letter transformations required to
 * change `start` into `end` where every intermediate word must appear in
 * `longFiveLetterWords`.
 *
 * Returns `null` if no such transformation exists.
 */
export function stepsBetweenWords(start: string, end: string): number | null {
  const normalizedStart = start.toLowerCase();
  const normalizedEnd = end.toLowerCase();

  if (normalizedStart.length !== normalizedEnd.length) {
    throw new Error("Words must have the same length");
  }

  if (normalizedStart === normalizedEnd) {
    return 0;
  }

  const dictionary = new Set(longFiveLetterWords.map((w) => w.toLowerCase()));
  // Ensure start and end words are in the dictionary so they can be part of the path
  dictionary.add(normalizedStart);
  dictionary.add(normalizedEnd);

  const visited = new Set<string>([normalizedStart]);
  const queue: Array<{ word: string; steps: number }> = [
    { word: normalizedStart, steps: 0 },
  ];

  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(97 + i),
  );

  while (queue.length) {
    const { word, steps } = queue.shift()!;

    for (let i = 0; i < word.length; i++) {
      for (const letter of alphabet) {
        if (letter === word[i]) continue;
        const nextWord = word.slice(0, i) + letter + word.slice(i + 1);

        if (!dictionary.has(nextWord) || visited.has(nextWord)) {
          continue;
        }

        if (nextWord === normalizedEnd) {
          return steps + 1;
        }

        visited.add(nextWord);
        queue.push({ word: nextWord, steps: steps + 1 });
      }
    }
  }

  return null;
}

/**
 * Find a random pair of words where the second word is exactly two
 * single-letter transformations away from the first word. Both words
 * are drawn from `longFiveLetterWords`.
 */
export function randomWordPairTwoStepsApart(): { start: string; end: string } {
  while (true) {
    const startIndex = Math.floor(Math.random() * longFiveLetterWords.length);
    const start = longFiveLetterWords[startIndex];

    // Try a handful of random candidates until one is exactly two steps away
    for (let i = 0; i < 1000; i++) {
      const endIndex = Math.floor(Math.random() * longFiveLetterWords.length);
      const end = longFiveLetterWords[endIndex];
      if (stepsBetweenWords(start, end) === 2) {
        return { start: start.toUpperCase(), end: end.toUpperCase() };
      }
    }
    // If no candidate found after many attempts, pick a new start word
  }
}

