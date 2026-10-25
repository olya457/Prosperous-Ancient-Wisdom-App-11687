import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme';
const Preferences = createContext(false);
export const MotionScene = createContext<{
  active: boolean;
  revision?: string | number;
}>({ active: true });
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(value => {
        if (active) setReduced(value);
      })
      .catch(() => {});
    const listener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduced,
    );
    return () => {
      active = false;
      listener.remove();
    };
  }, []);
  return (
    <Preferences.Provider value={reduced}>{children}</Preferences.Provider>
  );
}
export const useReducedMotion = () => useContext(Preferences);
export function Reveal({
  children,
  delay = 0,
  style,
  revision,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
  revision?: string | number;
}) {
  const reduced = useReducedMotion();
  const scene = useContext(MotionScene);
  const progress = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    progress.stopAnimation();
    if (reduced || !scene.active) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 520,
      delay: Math.min(delay, 240),
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, reduced, scene.active, scene.revision, revision, delay]);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
export function usePressMotion() {
  const reduced = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => () => scale.stopAnimation(), [scale]);
  const animate = (value: number) => {
    scale.stopAnimation();
    if (reduced) {
      scale.setValue(1);
      return;
    }
    Animated.spring(scale, {
      toValue: value,
      speed: 28,
      bounciness: 3,
      useNativeDriver: true,
    }).start();
  };
  return {
    scale,
    onPressIn: () => animate(0.97),
    onPressOut: () => animate(1),
  };
}

export function ScenicImage({
  source,
  revision,
}: {
  source: import('react-native').ImageSourcePropType;
  revision?: string | number;
}) {
  const reduced = useReducedMotion();
  const { active } = useContext(MotionScene);
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    scale.stopAnimation();
    if (reduced || !active) {
      scale.setValue(1);
      return;
    }
    scale.setValue(1.055);
    const animation = Animated.timing(scale, {
      toValue: 1,
      duration: 1800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [scale, reduced, active, revision, source]);
  return (
    <Animated.Image
      accessible={false}
      source={source}
      resizeMode="cover"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transform: [{ scale }],
      }}
    />
  );
}
export function GoldenAccent() {
  const reduced = useReducedMotion();
  const { active, revision } = useContext(MotionScene);
  const progress = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (reduced || !active) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, reduced, active, revision]);
  return (
    <Animated.View
      pointerEvents="none"
      accessible={false}
      style={{
        width: 64,
        height: 2,
        backgroundColor: colors.accent,
        opacity: progress,
        transform: [{ scaleX: progress }],
      }}
    />
  );
}
