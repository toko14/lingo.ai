export type Theme = 'default' | 'dark' | 'nature';

export const themes = {
  default: {
    bgClass: 'bg-white',
    textColor: 'text-black'
  },
  dark: {
    bgClass: 'bg-gray-900',
    textColor: 'text-white'
  },
  nature: {
    bgClass: 'bg-green-100',
    textColor: 'text-green-800'
  }
};
