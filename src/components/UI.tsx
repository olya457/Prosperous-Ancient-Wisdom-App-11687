import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Animated,
  ImageSourcePropType,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { colors, s, serif } from '../theme';
import { useNav } from '../navigation/types';
import { useIsFocused } from '@react-navigation/native';
import { useResponsive } from '../hooks/useResponsive';
import {
  GoldenAccent,
  ScenicImage,
  MotionScene,
  Reveal,
  usePressMotion,
} from './Motion';
import { Icon } from './Icon';
export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
  icon,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  icon?: string;
}) {
  const motion = usePressMotion();
  return (
    <Animated.View
      style={{ flexShrink: 0, transform: [{ scale: motion.scale }] }}
    >
      <Pressable
        onPressIn={motion.onPressIn}
        onPressOut={motion.onPressOut}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityLabel={title}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => ({
          opacity: disabled ? 0.4 : pressed ? 0.75 : 1,
        })}
      >
        <View style={[u.button, secondary && u.secondaryButton]}>
          <LinearGradient
            pointerEvents="none"
            colors={
              secondary
                ? [colors.raised, colors.card]
                : [colors.red, colors.orange]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {icon && <Icon name={icon} color={colors.text} size={17} />}
          <Text style={u.buttonText}>{title}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
export function Page({
  title,
  subtitle,
  children,
  back = false,
  action,
  scrollKey,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  back?: boolean;
  action?: React.ReactNode;
  scrollKey?: string | number;
}) {
  const nav = useNav();
  const active = useIsFocused();
  const { gutter, compact } = useResponsive();
  const scroll = useRef<ScrollView>(null);
  useEffect(() => {
    scroll.current?.scrollTo({ y: 0, animated: false });
  }, [scrollKey]);
  return (
    <MotionScene.Provider value={{ active, revision: scrollKey }}>
      <SafeAreaView edges={['top', 'left', 'right']} style={u.flex}>
        <View style={[u.header, { paddingHorizontal: gutter }]}>
          {back ? (
            <Pressable
              accessibilityLabel="Go back"
              accessibilityRole="button"
              onPress={() => nav.goBack()}
              style={u.touch}
            >
              <Icon name="back" color={colors.text} />
            </Pressable>
          ) : (
            <View style={u.seal}>
              <Text style={u.sealText}>道</Text>
            </View>
          )}
          <View style={u.flex}>
            <Text style={[u.headerTitle, { fontSize: compact ? 16 : 18 }]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={u.subtitle}>{subtitle.toUpperCase()}</Text>
            )}
          </View>
          {action}
        </View>
        <KeyboardAvoidingView
          style={u.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            ref={scroll}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={u.content}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </MotionScene.Provider>
  );
}
export function Hero({
  image,
  title,
  label,
  description,
  children,
}: {
  image: ImageSourcePropType;
  title: string;
  label?: string;
  description?: string;
  children?: React.ReactNode;
}) {
  const { heroHeight, heroTitle, gutter } = useResponsive();
  return (
    <Reveal>
      <View style={u.hero}>
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, u.heroArtwork]}
        >
          <ScenicImage source={image} />
        </View>
        <LinearGradient
          pointerEvents="none"
          colors={['transparent', colors.bg]}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            u.heroShade,
            { minHeight: heroHeight, padding: gutter, paddingTop: 45 },
          ]}
        >
          <View style={{ gap: 10 }}>
            <GoldenAccent />
            {label && <Text style={s.label}>{label}</Text>}
            <Text
              style={[
                s.title,
                { fontSize: heroTitle, lineHeight: heroTitle + 5 },
              ]}
            >
              {title}
            </Text>
            {description && (
              <Text style={[s.body, { color: '#CFC0B5' }]}>{description}</Text>
            )}
            {children}
          </View>
        </View>
      </View>
    </Reveal>
  );
}
export function Content({ children }: { children: React.ReactNode }) {
  const { gutter, compact } = useResponsive();
  return (
    <View style={{ padding: gutter, gap: compact ? 18 : 22 }}>
      {React.Children.toArray(children).map((child, index) => (
        <Reveal
          key={React.isValidElement(child) ? child.key ?? index : index}
          delay={index * 45}
        >
          {child}
        </Reveal>
      ))}
    </View>
  );
}
export function Card({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress?: () => void;
}) {
  const { compact } = useResponsive();
  const cardStyle = [s.card, { padding: compact ? 13 : 17 }];
  return onPress ? (
    <Pressable accessibilityRole="button" onPress={onPress} style={cardStyle}>
      {children}
    </Pressable>
  ) : (
    <View style={cardStyle}>{children}</View>
  );
}
export function Field({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
  maxLength = 3000,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <View style={{ gap: 9 }}>
      <Text style={u.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor="#82716E"
        maxLength={maxLength}
        style={[
          s.input,
          multiline && { minHeight: 115, textAlignVertical: 'top' },
        ]}
      />
    </View>
  );
}
export function Chips({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string | string[];
  onChange: (value: string) => void;
}) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {items.map(item => {
        const selected = Array.isArray(value)
          ? value.includes(item)
          : value === item;
        return (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(item)}
            style={[
              u.chip,
              selected && {
                backgroundColor: '#702923',
                borderColor: '#A74332',
              },
            ]}
          >
            <Text
              style={{
                color: selected ? colors.text : colors.muted,
                fontSize: 12,
              }}
            >
              {item}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
export function Select({
  label,
  value,
  items,
  onChange,
}: {
  label: string;
  value: string;
  items: string[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ gap: 9 }}>
      <Text style={u.fieldLabel}>{label}</Text>
      <Pressable
        accessibilityLabel={label}
        accessibilityRole="button"
        style={[s.input, s.between]}
        onPress={() => setOpen(true)}
      >
        <Text style={[s.body, { flex: 1, color: colors.text }]}>
          {value || 'Select an option'}
        </Text>
        <Text style={s.body}>⌄</Text>
      </Pressable>
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={u.modal} onPress={() => setOpen(false)}>
          <View
            style={[s.card, { width: '100%', maxWidth: 500, maxHeight: '80%' }]}
          >
            <Text style={s.heading}>{label}</Text>
            <ScrollView>
              {items.map(item => (
                <Pressable
                  key={item}
                  style={{ paddingVertical: 14 }}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[
                      s.body,
                      { color: item === value ? colors.gold : colors.text },
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <Button title="Close" secondary onPress={() => setOpen(false)} />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
export function Empty({
  title,
  description,
  button,
  onPress,
}: {
  title: string;
  description: string;
  button?: string;
  onPress?: () => void;
}) {
  return (
    <Card>
      <View style={{ alignItems: 'center', paddingVertical: 18, gap: 13 }}>
        <Icon name="journal" />
        <Text style={[s.heading, { textAlign: 'center', fontSize: 18 }]}>
          {title}
        </Text>
        <Text style={[s.body, { textAlign: 'center' }]}>{description}</Text>
      </View>
      {button && onPress && <Button title={button} onPress={onPress} />}
    </Card>
  );
}
export function Progress({ value }: { value: number }) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={u.track}
    >
      <LinearGradient
        colors={[colors.red, colors.gold]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          height: 4,
          width: `${Math.max(0, Math.min(100, value * 100))}%`,
          borderRadius: 3,
        }}
      />
    </View>
  );
}
export function Stats({
  items,
}: {
  items: { label: string; value: number }[];
}) {
  return (
    <View
      style={[s.card, { flexDirection: 'row', flexWrap: 'wrap', padding: 13 }]}
    >
      {items.map(item => (
        <View
          key={item.label}
          style={{
            flexGrow: 1,
            minWidth: 85,
            flexBasis: 85,
            alignItems: 'center',
            gap: 7,
            padding: 5,
          }}
        >
          <Text style={{ fontFamily: serif, fontSize: 25, color: colors.gold }}>
            {item.value}
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: 'center',
              color: colors.muted,
              textTransform: 'uppercase',
            }}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
export function Row({
  title,
  subtitle,
  onPress,
  icon = 'chevron',
}: {
  title: string;
  subtitle?: string;
  onPress: () => void;
  icon?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        s.between,
        {
          paddingVertical: 15,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
      ]}
    >
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={s.heading}>{title}</Text>
        {subtitle && (
          <Text style={[s.body, { fontSize: 12, lineHeight: 18 }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <Icon name={icon} />
    </Pressable>
  );
}
const u = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    minHeight: 64,
  },
  headerTitle: {
    color: colors.text,
    fontFamily: serif,
    fontWeight: '700',
    fontSize: 18,
  },
  subtitle: {
    fontSize: 9,
    letterSpacing: 1.2,
    color: colors.muted,
    marginTop: 4,
  },
  seal: {
    width: 32,
    height: 34,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#B6553D',
    backgroundColor: '#822622',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealText: { color: colors.gold, fontSize: 23 },
  touch: { minWidth: 44, minHeight: 44, justifyContent: 'center' },
  content: {
    paddingBottom: 32,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    flexGrow: 1,
  },
  secondaryButton: { borderWidth: 1, borderColor: colors.border },
  button: {
    minHeight: 50,
    flexShrink: 0,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  buttonText: {
    lineHeight: 20,
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'center',
  },
  hero: { width: '100%' },
  heroArtwork: { overflow: 'hidden' },
  heroShade: {
    flexShrink: 0,
    padding: 20,
    paddingTop: 65,
    justifyContent: 'flex-end',
  },
  fieldLabel: { color: colors.text, fontSize: 12, fontWeight: '500' },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 22,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
    justifyContent: 'center',
  },
  modal: {
    flex: 1,
    backgroundColor: '#000A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 22,
  },
  track: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
});

export function ResponsiveRow({ children }: { children: React.ReactNode }) {
  const { stacked } = useResponsive();
  return (
    <View
      style={{
        flexDirection: stacked ? 'column' : 'row',
        gap: 10,
        alignItems: 'stretch',
      }}
    >
      {React.Children.map(children, child => (
        <View style={{ flex: stacked ? undefined : 1, minWidth: 0 }}>
          {child}
        </View>
      ))}
    </View>
  );
}
