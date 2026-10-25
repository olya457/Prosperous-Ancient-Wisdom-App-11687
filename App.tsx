import React, { useCallback, useState } from 'react';
import { StatusBar, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppStore, useStore } from './src/store/AppStore';
import { AppNavigator } from './src/navigation/AppNavigator';
import { Splash, Onboarding } from './src/screens/Welcome';
import { Button, ScreenBackground } from './src/components/UI';
import { MotionProvider } from './src/components/Motion';
import { colors, s } from './src/theme';
function AppContent() {
  const { state, ready, error, retry } = useStore();
  const [loaded, setLoaded] = useState(false);
  const done = useCallback(() => setLoaded(true), []);
  if (error)
    return (
      <ScreenBackground>
        <SafeAreaView style={styles.error}>
          <Text style={s.heading}>Your journal could not be opened</Text>
          <Text style={s.body}>Please try loading your saved data again.</Text>
          <Button title="Try again" onPress={retry} />
        </SafeAreaView>
      </ScreenBackground>
    );
  if (!loaded || !ready) return <Splash onDone={done} />;
  return state.onboarded ? <AppNavigator /> : <Onboarding />;
}
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <MotionProvider>
        <AppStore>
          <AppContent />
        </AppStore>
      </MotionProvider>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  error: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 18,
  },
});
