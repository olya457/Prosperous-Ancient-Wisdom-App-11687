import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { WebView } from 'react-native-webview';
import { assets } from '../data';
import { colors, s, serif } from '../theme';
import { Reveal, ScenicImage, useReducedMotion } from '../components/Motion';
import { useResponsive } from '../hooks/useResponsive';
import { Button, ScreenBackground } from '../components/UI';
import { useStore } from '../store/AppStore';
const animation = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;background:transparent;overflow:hidden}.track{width:120px;height:4px;background:${colors.border};margin:20px auto;border-radius:4px;overflow:hidden}.bar{height:100%;background:linear-gradient(90deg,${colors.primary},${colors.accent});transform-origin:left;animation:load 4s linear forwards}@keyframes load{from{transform:scaleX(0)}to{transform:scaleX(1)}}</style></head><body><div class="track"><div class="bar"></div></div><script>document.querySelector('.bar').addEventListener('animationend',function(){window.ReactNativeWebView.postMessage('complete')})</script></body></html>`;
export function Splash({ onDone }: { onDone: () => void }) {
  const { width, height, short } = useResponsive();
  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(onDone, 4300);
    return () => clearTimeout(timer);
  }, [loaded, onDone]);
  return (
    <ScreenBackground>
      <View
        style={[
          w.fill,
          {
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          },
        ]}
      >
        <Reveal>
          <Image
            source={assets.logo}
            style={{
              width: Math.min(width - 48, 360, height * 0.43),
              height: Math.min(width - 48, 360, height * 0.43),
              borderRadius: 32,
              marginTop: short ? 0 : 45,
            }}
          />
        </Reveal>
        <Text
          style={{
            fontFamily: serif,
            color: colors.text,
            fontSize: Math.min(39, width / 10),
            textAlign: 'center',
            marginTop: height * (short ? 0.04 : 0.09),
          }}
        >
          Ancient Mind Garden
        </Text>
        <Text
          style={{
            letterSpacing: 1.2,
            color: colors.muted,
            fontSize: 12,
            marginTop: 14,
          }}
        >
          Daily wisdom · Personal growth
        </Text>
        <View
          style={{ position: 'absolute', bottom: 34, width: 160, height: 45 }}
        >
          <WebView
            originWhitelist={['*']}
            source={{
              html: reduced
                ? animation.replace(
                    'animation:load 4s linear forwards',
                    'animation:load 4s steps(1,end) forwards',
                  )
                : animation,
            }}
            onLoadEnd={() => setLoaded(true)}
            onError={() => {
              setLoaded(true);
            }}
            onMessage={e => {
              if (e.nativeEvent.data === 'complete') onDone();
            }}
            scrollEnabled={false}
            style={{ backgroundColor: 'transparent' }}
            opaque={false}
          />
        </View>
      </View>
    </ScreenBackground>
  );
}
const slides = [
  [
    'Discover Ancient\nChinese Wisdom',
    'Explore philosophical principles and consider how traditional teachings may inspire everyday decisions.',
  ],
  [
    'Find Wisdom Every Day',
    'Explore a daily principle, its context, and a practical reflection activity.',
  ],
  [
    'Approach Decisions\nwith Clarity',
    'Examine situations through Confucian, Daoist, and Mohist perspectives.',
  ],
  [
    'Learn and Reflect',
    'Complete interactive lessons and explore Confucian ideas through practical scenarios.',
  ],
  [
    'Build Your Wisdom\nJournal',
    'Record reflections, save insights, and review how your thinking changes over time.',
  ],
];
export function Onboarding() {
  const [step, setStep] = useState(0);
  const { gutter, stacked, onboardingTitle, onboardingImageHeight } =
    useResponsive();
  const { update } = useStore();
  const finish = () => update(v => ({ ...v, onboarded: true }));
  return (
    <ScreenBackground>
      <SafeAreaView edges={['bottom', 'left', 'right']} style={w.fill}>
        <ScrollView
          style={w.scroll}
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={{
            flexGrow: 1,
            width: '100%',
            maxWidth: 640,
            alignSelf: 'center',
          }}
        >
          <Reveal revision={step}>
            <View style={{ height: onboardingImageHeight, overflow: 'hidden' }}>
              <ScenicImage source={assets.onboarding[step]} revision={step} />
              <LinearGradient
                pointerEvents="none"
                colors={['#C5DFA320', '#C5DFA360', '#D5E4A4']}
                style={StyleSheet.absoluteFill}
              />
              <View style={w.overlay}>
                <SafeAreaView
                  edges={['top']}
                  style={{ alignItems: 'flex-end', padding: 18 }}
                >
                  <Pressable
                    onPress={finish}
                    accessibilityRole="button"
                    style={{
                      backgroundColor: colors.card,
                      padding: 14,
                      borderRadius: 30,
                    }}
                  >
                    <Text style={{ color: colors.text }}>Skip</Text>
                  </Pressable>
                </SafeAreaView>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 30,
                    left: 22,
                    backgroundColor: colors.selected,
                    borderColor: colors.accent,
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 9,
                  }}
                >
                  <Text style={{ fontSize: 26, color: colors.accent }}>道</Text>
                </View>
              </View>
            </View>
          </Reveal>
          <Reveal
            revision={step}
            delay={90}
            style={{ padding: gutter, gap: 15 }}
          >
            <Text style={s.label}>Ancient Mind Garden · 0{step + 1}</Text>
            <Text
              style={[
                s.title,
                { fontSize: onboardingTitle, lineHeight: onboardingTitle + 5 },
              ]}
            >
              {slides[step][0]}
            </Text>
            <Text style={s.body}>{slides[step][1]}</Text>
          </Reveal>
        </ScrollView>
        <View
          style={[
            w.footer,
            {
              paddingHorizontal: gutter,
              flexDirection: stacked ? 'column' : 'row',
              alignItems: stacked ? 'stretch' : 'center',
            },
          ]}
        >
          <View style={[s.row, { gap: 5 }]}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === step ? 23 : 5,
                  height: 5,
                  borderRadius: 4,
                  backgroundColor: i === step ? colors.accent : colors.border,
                }}
              />
            ))}
          </View>
          <Button
            title={step === 4 ? 'Get Started  →' : 'Continue  →'}
            onPress={() => (step === 4 ? finish() : setStep(step + 1))}
          />
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}
const w = StyleSheet.create({
  fill: { flex: 1 },
  overlay: { flex: 1 },
  scroll: { flex: 1 },
  footer: {
    flexShrink: 0,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
});
