import { Platform, StyleSheet } from 'react-native';
export const colors = {
  bg: '#C5DFA3',
  card: '#F8FAE9',
  raised: '#EAF0CD',
  border: '#A3B77C',
  text: '#193D2B',
  muted: '#4E6343',
  accent: '#35633B',
  primary: '#245936',
  primaryEnd: '#3D7240',
  onPrimary: '#FFFDEB',
  selected: '#DFEBAE',
  yellow: '#F5E99B',
};
export const backgroundGradient = [colors.bg, '#E0E8A5', colors.yellow];
export const serif = Platform.select({ ios: 'Georgia', android: 'serif' });
export const s = StyleSheet.create({
  body: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  title: {
    color: colors.text,
    fontFamily: serif,
    fontSize: 27,
    lineHeight: 33,
  },
  heading: {
    color: colors.text,
    fontFamily: serif,
    fontSize: 20,
    lineHeight: 26,
  },
  label: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.7,
    textTransform: 'uppercase',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  section: { gap: 14, marginBottom: 25 },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    padding: 17,
    gap: 12,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    color: colors.text,
    padding: 14,
    fontSize: 14,
    minHeight: 48,
  },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
});
