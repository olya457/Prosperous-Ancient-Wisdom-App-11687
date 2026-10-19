import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { State } from './types';
export const initialState: State = {
  onboarded: false,
  saved: [],
  viewed: [],
  practiced: [],
  completed: [],
  lessonSteps: {},
  quizResults: {},
  entries: [],
  decisions: [],
  sessions: [],
  comparisons: [],
};
const KEY = '@ancient-wisdom/state/v1';
const Context = createContext<{
  state: State;
  ready: boolean;
  error: boolean;
  retry: () => void;
  update: (fn: (previous: State) => State) => void;
}>({
  state: initialState,
  ready: false,
  error: false,
  retry: () => {},
  update: () => {},
});
export function AppStore({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const queue = useRef(Promise.resolve());
  const warned = useRef(false);
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(KEY)
      .then(raw => {
        if (!active) return;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (
            !parsed ||
            typeof parsed !== 'object' ||
            !Array.isArray(parsed.entries)
          )
            throw Error('Invalid storage');
          setState({ ...initialState, ...parsed });
        }
        setError(false);
        setReady(true);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  useEffect(() => {
    if (!ready) return;
    const snapshot = JSON.stringify(state);
    queue.current = queue.current
      .then(() => AsyncStorage.setItem(KEY, snapshot))
      .then(() => {
        warned.current = false;
      })
      .catch(() => {
        if (!warned.current) {
          warned.current = true;
          Alert.alert(
            'Could not save changes',
            'Your changes are still available in this session. Please free device storage and try again.',
            [{ text: 'Retry', onPress: () => setState(v => ({ ...v })) }],
          );
        }
      });
  }, [state, ready]);
  const update = useCallback(
    (fn: (previous: State) => State) => setState(fn),
    [],
  );
  return (
    <Context.Provider
      value={{
        state,
        ready,
        error,
        retry: () => setAttempt(v => v + 1),
        update,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useStore = () => useContext(Context);
