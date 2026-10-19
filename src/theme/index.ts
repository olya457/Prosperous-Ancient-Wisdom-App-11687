import { Platform, StyleSheet } from 'react-native';
export const colors = {
  bg: '#170E10',
  card: '#251719',
  raised: '#301C1E',
  border: '#422B2B',
  text: '#F1E8DB',
  muted: '#AC9D98',
  gold: '#D79A42',
  red: '#A92F27',
  orange: '#D35531',
};
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
    color: colors.gold,
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
