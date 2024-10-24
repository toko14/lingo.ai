export type WordBase = {
  english: string;
  japanese: string;
  partOfSpeech: string;
  example: string;
}

export type Word = WordBase & {
  id: number;
}

export type GenerateWordsParams = {
  toeic_level: number;
  words: number;
  text: string;
}
