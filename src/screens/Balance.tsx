import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View, Animated, AppState, Image, Pressable } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
  ResponsiveRow,
  Page,
  Hero,
  Content,
  Card,
  Button,
  Stats,
  Row,
  Field,
  Chips,
  Progress,
} from '../components/UI';
import { Icon } from '../components/Icon';
import { useResponsive } from '../hooks/useResponsive';
import { useReducedMotion } from '../components/Motion';
import { assets } from '../data';
import { s, colors, serif } from '../theme';
import { useStore } from '../store/AppStore';
import { ScreenProps, useNav } from '../navigation/types';
import { dateKey, uid } from '../utils/date';
const types = [
  'Mindful Breathing',
  'Reflection Practice',
  'Wu Wei Practice',
  'Nature Observation',
];
const topics = [
  'Letting Go of Control',
  'Accepting Change',
  'Finding Simplicity',
  'Acting with Patience',
];
const prompts: Record<string, string[]> = {
  'Letting Go of Control': [
    'What part of this situation asks for your attention?',
    'What have you been trying to control unnecessarily?',
    'What is one patient, useful response you can choose?',
  ],
  'Accepting Change': [
    'What change feels difficult to accept?',
    'What remains within your influence?',
    'How could you adapt while respecting your values?',
  ],
  'Finding Simplicity': [
    'What feels unnecessarily complicated today?',
    'What could you remove or simplify?',
    'What small change would make room for what matters?',
  ],
  'Acting with Patience': [
    'Where do you feel pressured to act quickly?',
    'What could you understand better by pausing?',
    'What is one considered next step?',
  ],
};
const natureThemes = [
  'Bamboo Flexibility',
  'Flowing Water',
  'Mountain Stillness',
  'Seasonal Change',
];
const natureTexts = [
  'Stand tall without necessarily breaking. Notice how flexibility can preserve a sense of direction.',
  'Observe movement without trying to hold it still. What can proceed with less resistance?',
  'Notice what remains steady while thoughts and circumstances move around it.',
  'Notice what is changing around you. What might be ready to begin, grow, or end?',
];
export function BalanceHome() {
  const nav = useNav();
  const { state } = useStore();
  return (
    <Page title="Tao Balance" subtitle="Small practices, steady attention">
      <Hero
        image={assets.balance}
        title="Find your inner balance."
        label="A pause to notice"
        description="Short reflective practices inspired by themes in Daoist philosophy."
      />
      <Content>
        <Text style={s.heading}>Choose a practice</Text>
        {types.map((type, i) => (
          <Card key={type} onPress={() => nav.navigate('Practice', { type })}>
            <View style={s.row}>
              <Image
                source={i % 2 ? assets.mountain : assets.balance}
                style={{ width: 70, height: 80, borderRadius: 8 }}
              />
              <View style={{ flex: 1, gap: 8 }}>
                <Text style={s.heading}>{type}</Text>
                <Text style={[s.body, { fontSize: 12 }]}>
                  {
                    [
                      'A gentle rhythm for returning attention to the present.',
                      'Thoughtful questions for a quieter perspective.',
                      'A small useful action, without unnecessary force.',
                      'Observe the patterns around you.',
                    ][i]
                  }
                </Text>
                <Text style={s.label}>Start practice →</Text>
              </View>
            </View>
          </Card>
        ))}
        <Text style={s.heading}>Practice activity</Text>
        <Stats
          items={[
            { label: 'Sessions', value: state.sessions.length },
            {
              label: 'Minutes',
              value: Math.floor(
                state.sessions.reduce((n, x) => n + x.seconds, 0) / 60,
              ),
            },
            {
              label: 'Days',
              value: new Set(state.sessions.map(x => x.date)).size,
            },
          ]}
        />
        <Text style={[s.body, { fontSize: 12 }]}>
          These are reflective practices for personal attention, not medical
          treatment.
        </Text>
      </Content>
    </Page>
  );
}
function Timer({
  nature,
  onFinish,
}: {
  nature: boolean;
  onFinish: (seconds: number, notes: string[]) => void;
}) {
  const { orbSize } = useResponsive();
  const reduced = useReducedMotion();
  const [minutes, setMinutes] = useState(1);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [theme, setTheme] = useState(natureThemes[0]);
  const scale = useRef(new Animated.Value(1)).current;
  const deadline = useRef(0);
  const focused = useIsFocused();
  const finished = useRef(false);
  const elapsed = minutes * 60 - remaining;
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setRunning(false);
    onFinish(
      elapsed,
      nature ? [theme, natureTexts[natureThemes.indexOf(theme)]] : [],
    );
  }, [elapsed, nature, onFinish, theme]);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(
      () =>
        setRemaining(
          Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)),
        ),
      200,
    );
    return () => clearInterval(timer);
  }, [running]);
  useEffect(() => {
    if (started && remaining === 0) finish();
  }, [remaining, started, finish]);
  useEffect(() => {
    if (!focused) setRunning(false);
    const sub = AppState.addEventListener('change', value => {
      if (value !== 'active') setRunning(false);
    });
    return () => sub.remove();
  }, [focused]);
  useEffect(() => {
    if (!running || reduced) {
      scale.stopAnimation();
      scale.setValue(1);
      return;
    }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [running, scale, reduced]);
  return (
    <>
      {nature && (
        <>
          <Hero
            image={assets.balance}
            title={theme}
            label="Observe with attention"
          />
          <Chips
            items={natureThemes}
            value={theme}
            onChange={v => {
              if (!started) setTheme(v);
            }}
          />
          <Card>
            <Text style={s.label}>Reflection prompt</Text>
            <Text style={s.heading}>
              {natureTexts[natureThemes.indexOf(theme)]}
            </Text>
          </Card>
        </>
      )}
      <Chips
        items={['1 min', '3 min', '5 min', '10 min']}
        value={`${minutes} min`}
        onChange={v => {
          if (!started) {
            const n = parseInt(v, 10);
            setMinutes(n);
            setRemaining(n * 60);
          }
        }}
      />
      <View
        style={{
          height: orbSize + 60,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={{
            height: orbSize,
            width: orbSize,
            borderRadius: 90,
            borderWidth: 1,
            borderColor: '#81502E',
            backgroundColor: '#34231D',
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ scale }],
          }}
        >
          <View
            style={{
              height: orbSize - 22,
              width: orbSize - 22,
              borderRadius: 80,
              borderWidth: 1,
              borderColor: '#604026',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <Icon name="balance" size={27} />
            <Text style={{ color: colors.gold, fontSize: 13 }}>
              {!started
                ? 'When you’re ready'
                : !running
                ? 'Paused'
                : nature
                ? 'Observe gently'
                : elapsed % 8 < 4
                ? 'Breathe in'
                : 'Breathe out'}
            </Text>
          </View>
        </Animated.View>
      </View>
      <Text
        style={{
          fontFamily: serif,
          fontSize: 40,
          color: colors.text,
          textAlign: 'center',
        }}
      >
        {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
      </Text>
      <Text style={[s.body, { textAlign: 'center', fontSize: 12 }]}>
        Let the rhythm be a gentle invitation. Breathe naturally, without
        holding your breath or forcing the pace.
      </Text>
      <Progress value={elapsed / (minutes * 60)} />
      <ResponsiveRow>
        <View style={{ flex: 1 }}>
          <Button
            title={running ? 'Ⅱ Pause' : started ? '▷ Resume' : '▷ Start'}
            onPress={() => {
              setStarted(true);
              if (!running) deadline.current = Date.now() + remaining * 1000;
              setRunning(!running);
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title="Finish"
            secondary
            disabled={elapsed === 0}
            onPress={finish}
          />
        </View>
      </ResponsiveRow>
    </>
  );
}
export function PracticeScreen({ route }: ScreenProps<'Practice'>) {
  const type = route.params.type;
  const nav = useNav();
  const [topic, setTopic] = useState('');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(['', '', '']);
  const [situation, setSituation] = useState('');
  const [within, setWithin] = useState(['']);
  const [outside, setOutside] = useState(['']);
  const [action, setAction] = useState('');
  const [release, setRelease] = useState('');
  const started = useRef(Date.now());
  const complete = (seconds: number, notes: string[], name = type) =>
    nav.replace('PracticeComplete', {
      session: {
        id: uid(),
        date: dateKey(),
        type: name,
        seconds,
        answers: notes,
        feeling: '',
      },
    });
  return (
    <Page
      title={topic || type}
      scrollKey={`${topic}-${step}`}
      subtitle="A practice of attention"
      back
    >
      <Content>
        {type === 'Mindful Breathing' || type === 'Nature Observation' ? (
          <Timer nature={type === 'Nature Observation'} onFinish={complete} />
        ) : type === 'Reflection Practice' ? (
          !topic ? (
            <>
              <Text style={s.body}>
                Choose a theme. You may skip any question.
              </Text>
              {topics.map(t => (
                <Row
                  key={t}
                  title={t}
                  subtitle="Three questions for a clearer perspective"
                  onPress={() => setTopic(t)}
                />
              ))}
            </>
          ) : (
            <>
              <Text style={s.label}>Pause and consider · {step + 1} of 3</Text>
              <Progress value={(step + 1) / 3} />
              <Text style={s.title}>{prompts[topic][step]}</Text>
              <Field
                label="Your reflection"
                value={answers[step]}
                onChange={v =>
                  setAnswers(a => a.map((x, i) => (i === step ? v : x)))
                }
                multiline
                placeholder="Write whatever comes to mind…"
              />
              <Button
                title={step === 2 ? 'Complete reflection →' : 'Next question →'}
                onPress={() =>
                  step === 2
                    ? complete(
                        Math.floor((Date.now() - started.current) / 1000),
                        answers.map(
                          (a, i) => `${prompts[topic][i]}\n${a || 'Skipped'}`,
                        ),
                        topic,
                      )
                    : setStep(step + 1)
                }
              />
              <Button
                secondary
                title="Skip this question"
                onPress={() => {
                  const next = answers.map((a, i) => (i === step ? '' : a));
                  setAnswers(next);
                  if (step === 2)
                    complete(
                      Math.floor((Date.now() - started.current) / 1000),
                      next.map(
                        (a, i) => `${prompts[topic][i]}\n${a || 'Skipped'}`,
                      ),
                      topic,
                    );
                  else setStep(step + 1);
                }}
              />
              {step > 0 && (
                <Button
                  secondary
                  title="Previous question"
                  onPress={() => setStep(step - 1)}
                />
              )}
            </>
          )
        ) : (
          <>
            <Card>
              <Text style={s.body}>
                A contemporary reflection inspired by Daoist ideas: distinguish
                useful action from unnecessary control.
              </Text>
            </Card>
            <Field
              label="Describe your situation"
              value={situation}
              onChange={setSituation}
              multiline
              placeholder="What are you trying to navigate?"
            />
            {[
              [within, setWithin, 'Within my influence'],
              [outside, setOutside, 'Outside my control'],
            ].map(([items, setter, label]) => {
              const list = items as string[];
              const set = setter as React.Dispatch<
                React.SetStateAction<string[]>
              >;
              return (
                <View key={label as string} style={{ gap: 10 }}>
                  <Text style={s.heading}>{label as string}</Text>
                  {list.map((item, i) => (
                    <View key={i} style={s.row}>
                      <View style={{ flex: 1 }}>
                        <Field
                          label={`Item ${i + 1}`}
                          value={item}
                          onChange={v =>
                            set(a => a.map((x, j) => (j === i ? v : x)))
                          }
                          placeholder="Add one item"
                        />
                      </View>
                      {list.length > 1 && (
                        <Pressable
                          accessibilityLabel="Remove item"
                          onPress={() => set(a => a.filter((_, j) => j !== i))}
                        >
                          <Icon name="close" />
                        </Pressable>
                      )}
                    </View>
                  ))}
                  {list.length < 8 && (
                    <Button
                      title="＋ Add item"
                      secondary
                      onPress={() => set(a => [...a, ''])}
                    />
                  )}
                </View>
              );
            })}
            <Field
              label="What is one useful action you can take?"
              value={action}
              onChange={setAction}
              multiline
            />
            <Field
              label="What can you stop trying to control?"
              value={release}
              onChange={setRelease}
              multiline
            />
            <Button
              title="Complete exercise →"
              disabled={
                !situation.trim() ||
                !action.trim() ||
                !release.trim() ||
                !within.some(x => x.trim()) ||
                !outside.some(x => x.trim())
              }
              onPress={() =>
                complete(Math.floor((Date.now() - started.current) / 1000), [
                  situation,
                  `Within my influence: ${within
                    .filter(x => x.trim())
                    .join('; ')}`,
                  `Outside my control: ${outside
                    .filter(x => x.trim())
                    .join('; ')}`,
                  `My next action: ${action}`,
                  `I can release: ${release}`,
                ])
              }
            />
          </>
        )}
      </Content>
    </Page>
  );
}
export function PracticeComplete({ route }: ScreenProps<'PracticeComplete'>) {
  const { session } = route.params;
  const { state, update } = useStore();
  const nav = useNav();
  const [feeling, setFeeling] = useState('');
  const saved = state.sessions.some(x => x.id === session.id);
  const save = () =>
    update(v => ({
      ...v,
      sessions: [
        { ...session, feeling },
        ...v.sessions.filter(x => x.id !== session.id),
      ],
    }));
  useEffect(() => {
    update(v =>
      v.sessions.some(x => x.id === session.id)
        ? v
        : { ...v, sessions: [session, ...v.sessions] },
    );
  }, [session, update]);
  return (
    <Page title="Practice Complete" subtitle="A moment of attention" back>
      <Content>
        <View style={{ alignItems: 'center', padding: 20, gap: 20 }}>
          <View
            style={[
              s.card,
              { borderRadius: 80, padding: 25, backgroundColor: '#5B241E' },
            ]}
          >
            <Icon name="check" size={32} />
          </View>
          <Text style={s.title}>{session.type}</Text>
        </View>
        <Card>
          <Text style={s.label}>Your practice</Text>
          <Text style={s.body}>
            Duration: {Math.floor(session.seconds / 60)} min{' '}
            {session.seconds % 60} sec
          </Text>
          <Text style={s.body}>Date: {session.date}</Text>
          {session.answers.map((answer, i) => (
            <Text key={i} style={s.body}>
              {answer}
            </Text>
          ))}
        </Card>
        <Text style={s.heading}>How do you feel now?</Text>
        <Chips
          items={['Calm', 'Neutral', 'Restless', 'Reflective']}
          value={feeling}
          onChange={v => {
            setFeeling(v);
            update(p => ({
              ...p,
              sessions: p.sessions.map(x =>
                x.id === session.id ? { ...x, feeling: v } : x,
              ),
            }));
          }}
        />
        <Text style={[s.body, { fontSize: 12 }]}>
          A personal observation, without judgment.
        </Text>
        <Button
          title={saved ? 'Practice saved ✓' : 'Save reflection'}
          onPress={save}
        />
        <Button
          title="Save to journal"
          secondary
          onPress={() => {
            save();
            nav.navigate('EntryForm', {
              prefill: {
                title: session.type,
                category: 'Tao Balance',
                philosophy: 'Daoism',
                notes: [
                  ...session.answers,
                  feeling ? `Feeling: ${feeling}` : '',
                ]
                  .filter(Boolean)
                  .join('\n\n'),
              },
            });
          }}
        />
        <Button
          title="Repeat practice"
          secondary
          onPress={() =>
            nav.replace('Practice', {
              type: topics.includes(session.type)
                ? 'Reflection Practice'
                : session.type,
            })
          }
        />
        <Button
          title="Back to Balance"
          secondary
          onPress={() => nav.popToTop()}
        />
      </Content>
    </Page>
  );
}
