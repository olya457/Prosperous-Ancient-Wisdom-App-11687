import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResponsive } from '../hooks/useResponsive';
import { useReducedMotion } from '../components/Motion';
import { Text } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from './types';
import { colors } from '../theme';
import { Icon } from '../components/Icon';
import { WisdomHome, WisdomDetail, Library, History } from '../screens/Wisdom';
import { DecisionsHome, DecisionFlow } from '../screens/Decisions';
import {
  LessonsHome,
  ModuleScreen,
  LessonScreen,
  QuizScreen,
} from '../screens/Lessons';
import {
  BalanceHome,
  PracticeScreen,
  PracticeComplete,
} from '../screens/Balance';
import {
  JournalHome,
  EntryForm,
  EntryDetail,
  Compare,
  Statistics,
} from '../screens/Journal';
const Stack = createNativeStackNavigator<Routes>();
const Tab = createBottomTabNavigator();
function FeatureStack({ home }: { home: React.ComponentType }) {
  const reduced = useReducedMotion();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: reduced ? 'none' : 'fade_from_bottom',
      }}
    >
      <Stack.Screen name="Home" component={home} />
      <Stack.Screen name="WisdomDetail" component={WisdomDetail} />
      <Stack.Screen name="Library" component={Library} />
      <Stack.Screen name="History" component={History} />
      <Stack.Screen name="DecisionFlow" component={DecisionFlow} />
      <Stack.Screen name="Module" component={ModuleScreen} />
      <Stack.Screen
        name="Lesson"
        component={LessonScreen}
        getId={({ params }) => params.id}
      />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Practice" component={PracticeScreen} />
      <Stack.Screen name="PracticeComplete" component={PracticeComplete} />
      <Stack.Screen name="EntryForm" component={EntryForm} />
      <Stack.Screen name="EntryDetail" component={EntryDetail} />
      <Stack.Screen name="Compare" component={Compare} />
      <Stack.Screen name="Statistics" component={Statistics} />
    </Stack.Navigator>
  );
}
const WisdomStack = () => <FeatureStack home={WisdomHome} />;
const DecisionsStack = () => <FeatureStack home={DecisionsHome} />;
const LessonsStack = () => <FeatureStack home={LessonsHome} />;
const BalanceStack = () => <FeatureStack home={BalanceHome} />;
const JournalStack = () => <FeatureStack home={JournalHome} />;
export function AppNavigator() {
  const insets = useSafeAreaInsets();
  const { fontScale } = useResponsive();
  const reduced = useReducedMotion();
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: colors.accent,
          background: colors.bg,
          card: colors.bg,
          text: colors.text,
          border: colors.border,
        },
      }}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          animation: reduced ? 'none' : 'fade',
          tabBarLabelPosition: 'below-icon',
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingTop: 8,
            height: insets.bottom + Math.max(58, 44 * fontScale),
            paddingBottom: insets.bottom,
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.muted,
          tabBarLabel: ({ color }) => (
            <Text style={{ fontSize: 9, color, marginBottom: 4 }}>
              {route.name}
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Icon name={route.name.toLowerCase()} color={color} size={21} />
          ),
          tabBarHideOnKeyboard: true,
        })}
      >
        <Tab.Screen name="Wisdom" component={WisdomStack} />
        <Tab.Screen name="Decisions" component={DecisionsStack} />
        <Tab.Screen name="Lessons" component={LessonsStack} />
        <Tab.Screen name="Balance" component={BalanceStack} />
        <Tab.Screen name="Journal" component={JournalStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
