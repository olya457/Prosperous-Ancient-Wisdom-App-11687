import React, { useState } from 'react';
import { Text, View, Alert } from 'react-native';
import {
  ResponsiveRow,
  Page,
  Hero,
  Content,
  Card,
  Button,
  Empty,
  Row,
  Field,
  Select,
  Stats,
  Progress,
} from '../components/UI';
import { assets, philosophies, categories, principles } from '../data';
import { s, colors } from '../theme';
import { useStore } from '../store/AppStore';
import { Entry } from '../store/types';
import { ScreenProps, useNav } from '../navigation/types';
import { dateKey, displayDate, uid, validDate } from '../utils/date';
const entryCategories = [
  'Daily Wisdom',
  'Decision Reflection',
  'Lesson Insight',
  'Tao Balance',
  'Personal Thought',
];
export function JournalHome() {
  const { state } = useStore();
  const nav = useNav();
  return (
    <Page title="Wisdom Journal" subtitle="Your private reflections">
      <Hero
        image={assets.wisdom}
        title="A record of what matters."
        label="Your path to wisdom"
        description="Gather insights from decisions, lessons, and moments of quiet attention."
      >
        <Button
          title="＋ New reflection"
          onPress={() => nav.navigate('EntryForm')}
        />
      </Hero>
      <Content>
        <Stats
          items={[
            { label: 'Reflections', value: state.entries.length },
            { label: 'Principles', value: state.saved.length },
            { label: 'Lessons', value: state.completed.length },
            { label: 'Sessions', value: state.sessions.length },
          ]}
        />
        <ResponsiveRow>
          <View style={{ flex: 1 }}>
            <Button
              title="Compare reflections"
              secondary
              onPress={() => nav.navigate('Compare')}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="View insights"
              secondary
              onPress={() => nav.navigate('Statistics')}
            />
          </View>
        </ResponsiveRow>
        <Text style={s.heading}>Recent entries</Text>
        {state.entries.length ? (
          state.entries.map(entry => (
            <Row
              key={entry.id}
              title={`${entry.important ? '★  ' : ''}${entry.title}`}
              subtitle={`${displayDate(entry.date)} · ${
                entry.category
              }\n${entry.learned.slice(0, 100)}`}
              onPress={() => nav.navigate('EntryDetail', { id: entry.id })}
            />
          ))
        ) : (
          <Empty
            title="Your journal is waiting"
            description="Begin with today's wisdom or a thought of your own."
            button="Write first reflection"
            onPress={() => nav.navigate('EntryForm')}
          />
        )}
      </Content>
    </Page>
  );
}
export function EntryForm({ route }: ScreenProps<'EntryForm'>) {
  const { update } = useStore();
  const nav = useNav();
  const [entry, setEntry] = useState<Entry>(
    route.params?.entry || {
      id: uid(),
      title: '',
      date: dateKey(),
      category: 'Personal Thought',
      philosophy: 'General Reflection',
      situation: '',
      learned: '',
      action: '',
      notes: '',
      important: false,
      ...route.params?.prefill,
    },
  );
  const set = (key: keyof Entry, value: string) =>
    setEntry(v => ({ ...v, [key]: value }));
  const valid =
    entry.title.trim() &&
    entry.situation.trim() &&
    entry.learned.trim() &&
    entry.action.trim() &&
    validDate(entry.date);
  return (
    <Page
      title={route.params?.entry ? 'Edit Reflection' : 'New Reflection'}
      subtitle="Private to this device"
      back
    >
      <Content>
        <Field
          label="Entry title"
          value={entry.title}
          onChange={v => set('title', v)}
          placeholder="Name this reflection"
          maxLength={120}
        />
        <Field
          label="Date (YYYY-MM-DD)"
          value={entry.date}
          onChange={v => set('date', v)}
          maxLength={10}
        />
        {!validDate(entry.date) && (
          <Text style={{ color: colors.orange }}>
            Enter a valid date in YYYY-MM-DD format.
          </Text>
        )}
        <Select
          label="Category"
          value={entry.category}
          items={entryCategories}
          onChange={v => set('category', v)}
        />
        <Select
          label="Related philosophy"
          value={entry.philosophy}
          items={philosophies}
          onChange={v => set('philosophy', v)}
        />
        <Field
          label="My situation"
          value={entry.situation}
          onChange={v => set('situation', v)}
          multiline
          placeholder="What happened or prompted this reflection?"
        />
        <Field
          label="What I learned"
          value={entry.learned}
          onChange={v => set('learned', v)}
          multiline
          placeholder="What became clearer?"
        />
        <Field
          label="What I will do differently"
          value={entry.action}
          onChange={v => set('action', v)}
          multiline
          placeholder="Name one practical future action."
        />
        <Field
          label="Personal notes (optional)"
          value={entry.notes}
          onChange={v => set('notes', v)}
          multiline
          placeholder="Any other observations"
        />
        <Button
          title="Save entry ✓"
          disabled={!valid}
          onPress={() => {
            update(v => ({
              ...v,
              entries: [
                { ...entry, title: entry.title.trim() },
                ...v.entries.filter(e => e.id !== entry.id),
              ],
            }));
            nav.replace('EntryDetail', { id: entry.id });
          }}
        />
      </Content>
    </Page>
  );
}
export function EntryDetail({ route }: ScreenProps<'EntryDetail'>) {
  const { state, update } = useStore();
  const nav = useNav();
  const entry = state.entries.find(x => x.id === route.params.id);
  if (!entry)
    return (
      <Page title="Journal Entry" back>
        <Content>
          <Empty
            title="Entry unavailable"
            description="This reflection has been removed."
          />
        </Content>
      </Page>
    );
  return (
    <Page title="Journal Entry" subtitle={entry.category} back>
      <Content>
        <Text style={s.label}>{displayDate(entry.date)}</Text>
        <Text style={s.title}>{entry.title}</Text>
        <Text style={s.label}>
          {entry.philosophy} · {entry.category}
        </Text>
        {[
          ['My situation', entry.situation],
          ['What I learned', entry.learned],
          ['What I will do differently', entry.action],
          ['Personal notes', entry.notes],
        ]
          .filter(([, text]) => text)
          .map(([label, text]) => (
            <View key={label} style={{ gap: 12, paddingVertical: 12 }}>
              <Text style={s.label}>{label}</Text>
              <Text style={[s.body, { color: colors.text }]}>{text}</Text>
            </View>
          ))}
        <Button
          title="Edit entry"
          icon="journal"
          onPress={() => nav.navigate('EntryForm', { entry })}
        />
        <Button
          secondary
          title={entry.important ? 'Marked as important' : 'Mark as important'}
          icon="bookmark"
          onPress={() =>
            update(v => ({
              ...v,
              entries: v.entries.map(e =>
                e.id === entry.id ? { ...e, important: !e.important } : e,
              ),
            }))
          }
        />
        <Button
          title="Revisit reflection"
          secondary
          onPress={() =>
            nav.navigate('EntryForm', {
              prefill: {
                title: `Revisiting: ${entry.title}`,
                category: entry.category,
                philosophy: entry.philosophy,
                notes: `Earlier reflection (${entry.date}):\n${entry.situation}\n${entry.learned}\n${entry.action}`,
              },
            })
          }
        />
        <Button
          title="Delete entry"
          icon="trash"
          secondary
          onPress={() =>
            Alert.alert(
              'Delete reflection?',
              'This entry and its linked comparisons will be removed from this device.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => {
                    update(v => ({
                      ...v,
                      entries: v.entries.filter(e => e.id !== entry.id),
                      comparisons: v.comparisons.filter(
                        c => c.earlier !== entry.id && c.current !== entry.id,
                      ),
                    }));
                    nav.goBack();
                  },
                },
              ],
            )
          }
        />
      </Content>
    </Page>
  );
}
export function Compare() {
  const { state, update } = useStore();
  const [earlier, setEarlier] = useState('');
  const [current, setCurrent] = useState('');
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const a = state.entries.find(e => e.id === earlier),
    b = state.entries.find(e => e.id === current);
  const options = state.entries.map(
    e => `${e.date} · ${e.title} · ${e.id.slice(-5)}`,
  );
  const choose = (value: string, fn: (id: string) => void) => {
    fn(state.entries[options.indexOf(value)].id);
    setSaved(false);
  };
  return (
    <Page
      title="Compare Reflections"
      subtitle="Earlier and current thinking"
      back
    >
      <Content>
        {state.entries.length < 2 ? (
          <Empty
            title="Two reflections are needed"
            description="Create another journal entry on a different day or revisit an earlier thought."
          />
        ) : (
          <>
            <Select
              label="Earlier reflection"
              value={a ? options[state.entries.indexOf(a)] : ''}
              items={options}
              onChange={v => choose(v, setEarlier)}
            />
            <Select
              label="Current reflection"
              value={b ? options[state.entries.indexOf(b)] : ''}
              items={options.filter((_, i) => state.entries[i].id !== earlier)}
              onChange={v => choose(v, setCurrent)}
            />
            {a && b && (
              <>
                {[a, b].map((e, i) => (
                  <Card key={`${e.id}-${i}`}>
                    <Text style={s.label}>
                      {i ? 'Current' : 'Earlier'} reflection · {e.date}
                    </Text>
                    <Text style={s.heading}>{e.title}</Text>
                    <Text style={s.body}>{e.situation}</Text>
                    <Text style={s.label}>Conclusion</Text>
                    <Text style={s.body}>{e.learned}</Text>
                    <Text style={s.label}>Intended action</Text>
                    <Text style={s.body}>{e.action}</Text>
                  </Card>
                ))}
                {a.date >= b.date && (
                  <Text style={s.body}>
                    Choose an earlier reflection from a day before the current
                    one.
                  </Text>
                )}
              </>
            )}
            <Field
              label="What has changed in your thinking?"
              value={text}
              onChange={v => {
                setText(v);
                setSaved(false);
              }}
              multiline
            />
            <Button
              title={saved ? 'Comparison saved' : 'Save comparison'}
              disabled={
                !a ||
                !b ||
                a.id === b.id ||
                a.date >= b.date ||
                !text.trim() ||
                saved
              }
              onPress={() => {
                update(v => ({
                  ...v,
                  comparisons: [
                    {
                      id: uid(),
                      earlier,
                      current,
                      text: text.trim(),
                      date: dateKey(),
                    },
                    ...v.comparisons,
                  ],
                }));
                setSaved(true);
              }}
            />
          </>
        )}
        {state.comparisons.length > 0 && (
          <Text style={s.heading}>Saved comparisons</Text>
        )}
        {state.comparisons.map(c => (
          <Card key={c.id}>
            <Text style={s.label}>{displayDate(c.date)}</Text>
            <Text style={s.heading}>
              {state.entries.find(e => e.id === c.earlier)?.title} →{' '}
              {state.entries.find(e => e.id === c.current)?.title}
            </Text>
            <Text style={s.body}>{c.text}</Text>
          </Card>
        ))}
      </Content>
    </Page>
  );
}
export function Statistics() {
  const { state } = useStore();
  const counts = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      count: state.entries.filter(e => e.date === dateKey(date)).length,
    };
  });
  const maximum = Math.max(1, ...counts.map(x => x.count));
  return (
    <Page title="Wisdom Statistics" subtitle="From your actual activity" back>
      <Content>
        <Card>
          <Text style={s.label}>Reflection activity · Last 7 days</Text>
          <Text style={s.title}>
            {counts.reduce((sum, x) => sum + x.count, 0)}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              gap: 9,
              height: 125,
              alignItems: 'flex-end',
            }}
          >
            {counts.map((x, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center', gap: 7 }}>
                <Text style={[s.body, { fontSize: 11 }]}>{x.count}</Text>
                <View
                  style={{
                    width: '100%',
                    height: x.count ? Math.max(8, (x.count / maximum) * 70) : 2,
                    backgroundColor: colors.gold,
                    borderRadius: 3,
                  }}
                />
                <Text style={{ fontSize: 9, color: colors.muted }}>
                  {x.day}
                </Text>
              </View>
            ))}
          </View>
        </Card>
        <Text style={s.heading}>Most explored philosophies</Text>
        <Card>
          {philosophies.map(p => {
            const n = state.entries.filter(e => e.philosophy === p).length;
            return (
              <View key={p} style={{ gap: 8 }}>
                <Text style={s.body}>
                  {p} · {n} reflections
                </Text>
                <Progress value={n / Math.max(1, state.entries.length)} />
              </View>
            );
          })}
        </Card>
        <Text style={s.heading}>Favorite wisdom categories</Text>
        <Card>
          {categories.map(c => {
            const n = principles.filter(
              p => p.category === c && state.saved.includes(p.id),
            ).length;
            return (
              <View key={c} style={{ gap: 7 }}>
                <Text style={s.body}>
                  {c} · {n}
                </Text>
                <Progress value={n / Math.max(1, state.saved.length)} />
              </View>
            );
          })}
        </Card>
        <Text style={s.heading}>Learning progress</Text>
        <Card>
          <Text style={s.body}>{state.completed.length}/25 lessons</Text>
          <Progress value={state.completed.length / 25} />
          <Text style={s.body}>
            {Object.keys(state.quizResults).length}/5 quizzes
          </Text>
          <Progress value={Object.keys(state.quizResults).length / 5} />
        </Card>
        <Text style={s.heading}>Practice activity</Text>
        <Card>
          {[
            'Mindful Breathing',
            'Reflection Practice',
            'Wu Wei Practice',
            'Nature Observation',
          ].map(type => (
            <Text key={type} style={s.body}>
              {type} ·{' '}
              {
                state.sessions.filter(
                  x =>
                    x.type === type ||
                    (type === 'Reflection Practice' &&
                      [
                        'Letting Go of Control',
                        'Accepting Change',
                        'Finding Simplicity',
                        'Acting with Patience',
                      ].includes(x.type)),
                ).length
              }
            </Text>
          ))}
        </Card>
        <Stats
          items={[
            { label: 'Saved wisdom', value: state.saved.length },
            { label: 'Decisions', value: state.decisions.length },
            {
              label: 'Important',
              value: state.entries.filter(e => e.important).length,
            },
            {
              label: 'Active days',
              value: new Set([
                ...state.practiced.map(x => x.date),
                ...state.sessions.map(x => x.date),
                ...state.entries.map(x => x.date),
              ]).size,
            },
          ]}
        />
      </Content>
    </Page>
  );
}
