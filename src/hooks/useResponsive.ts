import { useWindowDimensions } from 'react-native';
export function layoutFor(width: number, height: number, fontScale = 1) {
  const compact = width < 370;
  const stacked = width < 350 || fontScale > 1.25;
  const short = height < 700;
  return {
    compact,
    stacked,
    short,
    gutter: compact ? 14 : 20,
    heroHeight: short ? 215 : 265,
    heroTitle: compact ? 28 : 32,
    onboardingTitle: compact ? 28 : 34,
    onboardingImageHeight: Math.max(
      190,
      Math.min(480, height * (short ? 0.42 : 0.51)),
    ),
    orbSize: compact || short ? 142 : 170,
  };
}
export function useResponsive() {
  const { width, height, fontScale } = useWindowDimensions();
  return { ...layoutFor(width, height, fontScale), width, height, fontScale };
}
