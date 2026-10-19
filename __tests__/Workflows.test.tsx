import React from 'react';
import { TextInput } from 'react-native';
import Renderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppStore, useStore } from '../src/store/AppStore';
import { EntryForm } from '../src/screens/Journal';
import { PracticeScreen } from '../src/screens/Balance';
import { DecisionFlow } from '../src/screens/Decisions';
import { Button } from '../src/components/UI';
import { ScreenProps } from '../src/navigation/types';
const mockNav = { navigate: jest.fn(), replace: jest.fn(), goBack: jest.fn() };
jest.mock('../src/navigation/types', () => ({ useNav: () => mockNav }));
jest.mock('@react-navigation/native', () => ({ useIsFocused: () => true }));
beforeEach(() => {
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
});
let store: ReturnType<typeof useStore>;
function Probe() {
  store = useStore();
  return null;
}
async function render(child: React.ReactNode) {
  let root: Renderer.ReactTestRenderer;
  await act(async () => {
    root = Renderer.create(
      <AppStore>
        <Probe />
        {child}
      </AppStore>,
    );
  });
  return root!;
}
function button(root: Renderer.ReactTestRenderer, title: string) {
  return root.root.findAllByType(Button).find(b => b.props.title === title)!;
}
async function fill(
  root: Renderer.ReactTestRenderer,
  label: string,
  value: string,
) {
  await act(async () => {
    root.root
      .findAllByType(TextInput)
      .find(f => f.props.accessibilityLabel === label)!
      .props.onChangeText(value);
  });
}
test('journal requires user input and saves the entered reflection', async () => {
  const props = { route: { params: undefined } } as ScreenProps<'EntryForm'>;
  const root = await render(<EntryForm {...props} />);
  expect(button(root, 'Save entry ✓').props.disabled).toBe(true);
  await fill(root, 'Entry title', 'A considered response');
  await fill(root, 'My situation', 'I paused before replying.');
  await fill(root, 'What I learned', 'Listening gave me context.');
  await fill(root, 'What I will do differently', 'Ask one question first.');
  expect(button(root, 'Save entry ✓').props.disabled).toBe(false);
  await act(async () => button(root, 'Save entry ✓').props.onPress());
  expect(store.state.entries).toHaveLength(1);
  expect(store.state.entries[0].action).toBe('Ask one question first.');
  expect(mockNav.replace).toHaveBeenCalledWith('EntryDetail', {
    id: store.state.entries[0].id,
  });
  await act(async () => root.unmount());
});
test('decision validation rejects empty and duplicate options', async () => {
  const props = { route: { params: undefined } } as ScreenProps<'DecisionFlow'>;
  const root = await render(<DecisionFlow {...props} />);
  expect(button(root, 'Analyze situation  →').props.disabled).toBe(true);
  await fill(
    root,
    'Describe your situation',
    'How should I approach this conversation?',
  );
  await fill(root, 'Option A', 'Listen first');
  await fill(root, 'Option B', 'Listen first');
  expect(button(root, 'Analyze situation  →').props.disabled).toBe(true);
  await fill(root, 'Option B', 'Ask for time');
  expect(button(root, 'Analyze situation  →').props.disabled).toBe(false);
  await act(async () => root.unmount());
});
test('breathing timer pauses, resumes, and completes exactly once', async () => {
  jest.useFakeTimers();
  const props = {
    route: { params: { type: 'Mindful Breathing' } },
  } as ScreenProps<'Practice'>;
  const root = await render(<PracticeScreen {...props} />);
  await act(async () => button(root, '▷ Start').props.onPress());
  await act(async () => jest.advanceTimersByTime(10000));
  await act(async () => button(root, 'Ⅱ Pause').props.onPress());
  await act(async () => jest.advanceTimersByTime(90000));
  expect(mockNav.replace).not.toHaveBeenCalled();
  await act(async () => button(root, '▷ Resume').props.onPress());
  await act(async () => jest.advanceTimersByTime(50000));
  expect(mockNav.replace).toHaveBeenCalledTimes(1);
  expect(mockNav.replace).toHaveBeenCalledWith('PracticeComplete', {
    session: expect.objectContaining({
      type: 'Mindful Breathing',
      seconds: 60,
    }),
  });
  await act(async () => root.unmount());
  jest.useRealTimers();
});
