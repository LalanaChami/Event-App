export const COLORS = {
  lightMint: '#C6EBBE',
  mint: '#A9DBB8',
  steelBlue: '#7CA5B8',
  deepBlue: '#38369A',
  navyBlue: '#020887',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#CCCCCC',
  lightGray: '#F5F5F5',
  error: '#FF3B30',
  success: '#4CD964',
  transparent: 'transparent',
};

export const FONTS = {
  regular: {
    fontFamily: 'System',
    fontWeight: '400',
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500',
  },
  bold: {
    fontFamily: 'System',
    fontWeight: '700',
  },
  light: {
    fontFamily: 'System',
    fontWeight: '300',
  },
};

export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,
  margin: 20,

  // font sizes
  largeTitle: 40,
  h1: 30,
  h2: 22,
  h3: 18,
  h4: 16,
  h5: 14,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,
  small: 10,
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
