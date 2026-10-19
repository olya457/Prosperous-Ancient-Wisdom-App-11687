import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from '../App';
import { layoutFor } from '../src/hooks/useResponsive';
import { AppStore, initialState, useStore } from '../src/store/AppStore';
import { dateKey, todayIndex, validDate } from '../src/utils/date';
import { principles, lessons, quizzes } from '../src/data';
jest.mock('../src/navigation/AppNavigator', () => ({
  AppNavigator: () => null,
}));
afterEach(() => {
  jest.clearAllMocks();
});
test('educational content is complete and every quiz has valid answers', () => {
  expect(principles).toHaveLength(36);
  expect(lessons).toHaveLength(25);
  expect(quizzes).toHaveLength(5);
  for (const lesson of lessons) {
    expect(lesson.options).toHaveLength(4);
    expect(lesson.sections).toHaveLength(6);
    expect(lesson.options[lesson.answer]).toBeTruthy();
  }
  for (const quiz of quizzes) {
    expect(quiz).toHaveLength(5);
    for (const q of quiz) {
      expect(q.options).toHaveLength(4);
      expect(q.options[q.answer]).toBeTruthy();
    }
  }
});
test('daily wisdom is stable during a local calendar day and dates are validated', () => {
  expect(todayIndex(36, new Date(2026, 9, 19, 0))).toBe(
    todayIndex(36, new Date(2026, 9, 19, 23)),
  );
  expect(dateKey(new Date(2026, 9, 19))).toBe('2026-10-19');
  expect(validDate('2026-02-30')).toBe(false);
  expect(validDate('2028-02-29')).toBe(true);
});
test('splash advances only when its WebView animation completes, then onboarding is persisted', async () => {
  jest.useFakeTimers();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
  let root: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    root = ReactTestRenderer.create(<App />);
  });
  expect(root!.root.findAllByType('WebView' as never)).toHaveLength(1);
  await act(async () => {
    root!.root
      .findByType('WebView' as never)
      .props.onMessage({ nativeEvent: { data: 'complete' } });
  });
  const skip = root!.root.findAll(
    node =>
      node.props.accessibilityRole === 'button' &&
      node
        .findAllByType('Text' as never)
        .some(t => t.props.children === 'Skip'),
  )[0];
  await act(async () => {
    skip.props.onPress();
  });
  expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
    '@ancient-wisdom/state/v1',
    expect.stringContaining('"onboarded":true'),
  );
  await act(async () => root!.unmount());
  jest.useRealTimers();
});
test('restores user records and preserves independent changes in successive updates', async () => {
  const existing = { ...initialState, onboarded: true, saved: ['1'] };
  (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
    JSON.stringify(existing),
  );
  let store: ReturnType<typeof useStore>;
  function Probe() {
    store = useStore();
    return null;
  }
  let root: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    root = ReactTestRenderer.create(
      <AppStore>
        <Probe />
      </AppStore>,
    );
  });
  expect(store!.state.saved).toEqual(['1']);
  await act(async () => {
    store!.update(v => ({ ...v, completed: ['2'] }));
    store!.update(v => ({ ...v, saved: [...v.saved, '3'] }));
  });
  expect(store!.state.completed).toEqual(['2']);
  expect(store!.state.saved).toEqual(['1', '3']);
  expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
    '@ancient-wisdom/state/v1',
    JSON.stringify(store!.state),
  );
  await act(async () => root!.unmount());
});
test('does not overwrite unreadable storage with an empty profile', async () => {
  (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('{invalid');
  let store: ReturnType<typeof useStore>;
  function Probe() {
    store = useStore();
    return null;
  }
  let root: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    root = ReactTestRenderer.create(
      <AppStore>
        <Probe />
      </AppStore>,
    );
  });
  expect(store!.error).toBe(true);
  expect(store!.ready).toBe(false);
  expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  await act(async () => root!.unmount());
});

test('compact screens and enlarged text use a stacked layout with smaller artwork', () => {
  const small = layoutFor(320, 568);
  expect(small.stacked).toBe(true);
  expect(small.heroHeight).toBe(215);
  expect(small.orbSize).toBe(142);
  expect(small.onboardingImageHeight).toBeLessThan(250);
  expect(layoutFor(390, 844).stacked).toBe(false);
  expect(layoutFor(390, 844, 1.5).stacked).toBe(true);
  expect(layoutFor(844, 390).short).toBe(true);
});
