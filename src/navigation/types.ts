import { useNavigation } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Decision, Entry, Session } from '../store/types';
export type Routes = {
  Home: undefined;
  WisdomDetail: { id: string };
  Library: { saved?: boolean } | undefined;
  History: undefined;
  DecisionFlow: { decision?: Decision; category?: string } | undefined;
  Module: { index: number };
  Lesson: { id: string };
  Quiz: { index: number };
  Practice: { type: string };
  PracticeComplete: { session: Session };
  EntryForm: { entry?: Entry; prefill?: Partial<Entry> } | undefined;
  EntryDetail: { id: string };
  Compare: undefined;
  Statistics: undefined;
};
export type ScreenProps<T extends keyof Routes> = NativeStackScreenProps<
  Routes,
  T
>;
export const useNav = () => useNavigation<NativeStackNavigationProp<Routes>>();
