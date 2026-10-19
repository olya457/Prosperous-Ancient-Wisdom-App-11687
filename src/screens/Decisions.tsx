import React, { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import {
  Page,
  Hero,
  Content,
  Card,
  Button,
  Empty,
  Row,
  Field,
  Chips,
  Select,
  Progress,
} from '../components/UI';
import { Icon } from '../components/Icon';
import { useResponsive } from '../hooks/useResponsive';
import { assets } from '../data';
import { s, colors } from '../theme';
import { useStore } from '../store/AppStore';
import { Decision } from '../store/types';
import { ScreenProps, useNav } from '../navigation/types';
import { dateKey, uid } from '../utils/date';
const situations = [
  'Work & Career',
  'Relationships',
  'Personal Growth',
  'Conflict Resolution',
  'Time & Priorities',
  'Difficult Choices',
];
const descriptions = [
  'Responsibilities and workplace challenges.',
  'Communication, trust, and boundaries.',
  'Learning, habits, and priorities.',
  'Difficult conversations and repair.',
  'Balance commitments with what matters.',
  'Competing values and uncertainty.',
];
const values = [
  'Harmony',
  'Honesty',
  'Responsibility',
  'Freedom',
  'Stability',
  'Growth',
];
const perspectives = [
  {
    name: 'Confucianism',
    title: 'Confucian perspective',
    principle: 'Responsible relationships',
    interpretation:
      'Consider the duties created by your role, and how honesty can be expressed without diminishing respect.',
    action:
      'Have a private, specific conversation that makes room for mutual responsibility.',
    question: 'What response preserves both candor and the relationship?',
  },
  {
    name: 'Daoism',
    title: 'Daoist perspective',
    principle: 'Clear action without force',
    interpretation:
      'Notice which parts of the situation can unfold naturally and where additional pressure may create resistance.',
    action:
      'Choose the smallest useful intervention, then observe what changes before adding more effort.',
    question: 'What could you stop forcing while still acting responsibly?',
  },
  {
    name: 'Mohism',
    title: 'Mohist perspective',
    principle: 'Practical and impartial care',
    interpretation:
      'Consider everyone affected, including people whose interests are easy to overlook.',
    action:
      'Compare the likely benefits, burdens, and avoidable harm for each person involved.',
    question:
      'Who benefits, who carries the cost, and whose needs are missing?',
  },
];
export function DecisionsHome() {
  const { stacked } = useResponsive();
  const nav = useNav();
  const { state } = useStore();
  return (
    <Page title="Decision Guide" subtitle="Clarity, not prescriptions">
      <Hero
        image={assets.decisions}
        title="Find clarity in your decisions."
        label="Three perspectives"
        description="Examine the path from more than one point of view."
      >
        <Button
          title="Analyze a situation  →"
          onPress={() => nav.navigate('DecisionFlow')}
        />
      </Hero>
      <Content>
        <Text style={s.heading}>What are you navigating?</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {situations.map((category, i) => (
            <View
              key={category}
              style={{ width: stacked ? '100%' : '48%', flexGrow: 1 }}
            >
              <Card onPress={() => nav.navigate('DecisionFlow', { category })}>
                <Icon
                  name={
                    [
                      'decisions',
                      'heart',
                      'balance',
                      'layers',
                      'clock',
                      'wisdom',
                    ][i]
                  }
                />
                <Text style={[s.heading, { fontSize: 17 }]}>{category}</Text>
                <Text style={[s.body, { fontSize: 12, lineHeight: 18 }]}>
                  {descriptions[i]}
                </Text>
              </Card>
            </View>
          ))}
        </View>
        <Text style={s.heading}>Recent decisions</Text>
        {state.decisions.length ? (
          state.decisions.map(d => (
            <Row
              key={d.id}
              title={d.situation}
              subtitle={`${d.category} · ${d.date}`}
              onPress={() => nav.navigate('DecisionFlow', { decision: d })}
            />
          ))
        ) : (
          <Empty
            title="No saved decisions yet"
            description="Your completed analyses will appear here."
          />
        )}
        <Text style={[s.body, { fontSize: 12 }]}>
          This guide offers structured questions, not directives or guaranteed
          outcomes.
        </Text>
      </Content>
    </Page>
  );
}
export function DecisionFlow({ route }: ScreenProps<'DecisionFlow'>) {
  const nav = useNav();
  const { state, update } = useStore();
  const existing = route.params?.decision;
  const [step, setStep] = useState(existing ? 3 : 0);
  const [data, setData] = useState<Decision>(
    existing || {
      id: uid(),
      date: dateKey(),
      category: route.params?.category || situations[0],
      situation: '',
      values: [],
      urgency: 'Medium',
      options: ['', ''],
      selected: '',
      philosophy: 'Confucianism',
      next: '',
    },
  );
  const [expanded, setExpanded] = useState(0);
  const [saved, setSaved] = useState(!!existing);
  const set = <K extends keyof Decision>(key: K, value: Decision[K]) => {
    setData(v => ({
      ...v,
      [key]: value,
      ...(key === 'options' ? { selected: '' } : {}),
    }));
    setSaved(false);
  };
  const valid =
    data.situation.trim().length > 0 &&
    data.options.filter(x => x.trim()).length >= 2 &&
    new Set(data.options.filter(x => x.trim()).map(x => x.trim())).size ===
      data.options.filter(x => x.trim()).length;
  const titles = [
    'Describe Your Situation',
    'Philosophical Perspectives',
    'Compare Your Options',
    'Your Decision Summary',
  ];
  const save = () => {
    const clean = {
      ...data,
      options: data.options.map(x => x.trim()).filter(Boolean),
      situation: data.situation.trim(),
      next: data.next.trim(),
    };
    update(v => ({
      ...v,
      decisions: [clean, ...v.decisions.filter(x => x.id !== data.id)],
    }));
    setSaved(true);
  };
  return (
    <Page
      title={titles[step]}
      subtitle={`Step ${step + 1} of 4`}
      scrollKey={step}
      back
    >
      <Content>
        <Progress value={(step + 1) / 4} />
        {step === 0 ? (
          <>
            <Select
              label="Situation category"
              value={data.category}
              items={situations}
              onChange={v => set('category', v)}
            />
            <Field
              label="Describe your situation"
              value={data.situation}
              onChange={v => set('situation', v)}
              multiline
              placeholder="What is happening, who is involved, and what feels uncertain?"
              maxLength={1500}
            />
            <Text style={s.body}>What matters most?</Text>
            <Chips
              items={values}
              value={data.values}
              onChange={v =>
                set(
                  'values',
                  data.values.includes(v)
                    ? data.values.filter(x => x !== v)
                    : [...data.values, v],
                )
              }
            />
            <Text style={s.body}>Decision urgency</Text>
            <Chips
              items={['Low', 'Medium', 'High']}
              value={data.urgency}
              onChange={v => set('urgency', v)}
            />
            {data.options.map((option, i) => (
              <View key={i} style={s.row}>
                <View style={{ flex: 1 }}>
                  <Field
                    label={`Option ${String.fromCharCode(65 + i)}`}
                    value={option}
                    onChange={v =>
                      set(
                        'options',
                        data.options.map((x, j) => (j === i ? v : x)),
                      )
                    }
                    placeholder="Describe a possible action"
                    maxLength={300}
                  />
                </View>
                {i === 2 && (
                  <Pressable
                    accessibilityLabel="Remove third option"
                    onPress={() => {
                      set('options', data.options.slice(0, 2));
                      set('selected', '');
                    }}
                  >
                    <Icon name="close" />
                  </Pressable>
                )}
              </View>
            ))}
            {data.options.length < 3 && (
              <Button
                title="Add a third option"
                secondary
                icon="plus"
                onPress={() => set('options', [...data.options, ''])}
              />
            )}
            <Button
              title="Analyze situation  →"
              disabled={!valid}
              onPress={() => {
                set('options', data.options.map(x => x.trim()).filter(Boolean));
                setStep(1);
              }}
            />
          </>
        ) : step === 1 ? (
          <>
            <Card>
              <Text style={s.label}>
                {data.category} · {data.urgency} urgency
              </Text>
              <Text style={s.body}>{data.situation}</Text>
              {data.values.length > 0 && (
                <Text style={s.label}>{data.values.join(' · ')}</Text>
              )}
            </Card>
            {perspectives.map((p, i) => (
              <Card key={p.name}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded: expanded === i }}
                  onPress={() => setExpanded(expanded === i ? -1 : i)}
                >
                  <Text style={s.label}>{p.principle}</Text>
                  <Text style={[s.heading, { marginTop: 8 }]}>{p.title} ⌄</Text>
                </Pressable>
                {expanded === i && (
                  <>
                    <Text style={s.label}>Interpretation</Text>
                    <Text style={s.body}>{p.interpretation}</Text>
                    <Text style={s.label}>Possible action</Text>
                    <Text style={s.body}>
                      {p.action}{' '}
                      {data.urgency === 'High'
                        ? 'Identify the real deadline and one reversible action you can take now.'
                        : 'Allow time to check your assumptions before committing.'}
                    </Text>
                    {data.values.length > 0 && (
                      <Text style={s.body}>
                        You named {data.values.join(', ').toLowerCase()} as
                        priorities. Where does this approach support them, and
                        where might they conflict?
                      </Text>
                    )}
                    <Card>
                      <Text style={s.label}>Reflection question</Text>
                      <Text style={s.body}>{p.question}</Text>
                    </Card>
                  </>
                )}
              </Card>
            ))}
            <Button title="Compare options  →" onPress={() => setStep(2)} />
          </>
        ) : step === 2 ? (
          <>
            <Text style={s.body}>
              These prompts describe possibilities to consider, not predicted
              outcomes. Explore each option.
            </Text>
            {data.options.map((option, i) => (
              <Card key={i}>
                <Text style={s.label}>
                  Option {String.fromCharCode(65 + i)}
                </Text>
                <Text style={s.heading}>{option}</Text>
                {[
                  [
                    'Potential benefits',
                    `If you choose “${option}”, which of your priorities could it support?`,
                  ],
                  [
                    'Potential challenges',
                    `What time, resources, uncertainty, or discomfort could this require in ${data.category.toLowerCase()}?`,
                  ],
                  [
                    'Relationships impact',
                    'Who should be consulted, and how could you communicate this choice respectfully?',
                  ],
                  [
                    'Long-term perspective',
                    'Would this choice still align with your responsibilities a month from now?',
                  ],
                  [
                    'Philosophical questions',
                    'Is it respectful? Is it unnecessarily forceful? Who shares the benefit?',
                  ],
                ].map(([label, text]) => (
                  <View key={label} style={{ gap: 6 }}>
                    <Text style={[s.label, { letterSpacing: 0.5 }]}>
                      {label}
                    </Text>
                    <Text style={s.body}>{text}</Text>
                  </View>
                ))}
              </Card>
            ))}
            <Button title="Reflect and choose  →" onPress={() => setStep(3)} />
          </>
        ) : (
          <>
            <Text style={s.body}>What option feels most appropriate?</Text>
            {data.options.map(option => (
              <Pressable
                key={option}
                accessibilityRole="radio"
                accessibilityState={{ checked: data.selected === option }}
                onPress={() => set('selected', option)}
                style={[
                  s.card,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderColor:
                      data.selected === option ? colors.orange : colors.border,
                  },
                ]}
              >
                <Icon name={data.selected === option ? 'check' : 'decisions'} />
                <Text style={[s.body, { flex: 1 }]}>{option}</Text>
              </Pressable>
            ))}
            <Select
              label="Which perspective influenced you?"
              value={data.philosophy}
              items={perspectives.map(x => x.name)}
              onChange={v => set('philosophy', v)}
            />
            <Field
              label="What is your next practical step?"
              value={data.next}
              onChange={v => set('next', v)}
              multiline
              placeholder="Name one small, concrete action…"
            />
            <Card>
              <Text style={s.label}>Decision summary</Text>
              <Text style={s.heading}>{data.situation}</Text>
              <Text style={s.body}>
                Selected path: {data.selected || 'Still considering'}
              </Text>
              <Text style={s.body}>Guiding perspective: {data.philosophy}</Text>
              <Text style={s.body}>
                Next step: {data.next || 'Not added yet'}
              </Text>
            </Card>
            <Button
              title={saved ? 'Decision saved' : 'Save decision'}
              icon="bookmark"
              disabled={!data.selected || !data.next.trim() || saved}
              onPress={save}
            />
            <Button
              title="Add to journal"
              secondary
              disabled={!data.selected || !data.next.trim()}
              onPress={() => {
                if (!saved) save();
                nav.navigate('EntryForm', {
                  prefill: {
                    title: data.situation.slice(0, 100),
                    situation: data.situation,
                    learned: data.selected,
                    action: data.next,
                    philosophy: data.philosophy,
                    category: 'Decision Reflection',
                  },
                });
              }}
            />
            <Button
              title="Reconsider options"
              secondary
              onPress={() => setStep(0)}
            />
          </>
        )}
        {step > 0 && step < 3 && (
          <Button
            title="Previous step"
            secondary
            onPress={() => setStep(step - 1)}
          />
        )}
        <Text style={[s.body, { fontSize: 11 }]}>
          {state.decisions.some(x => x.id === data.id)
            ? 'This analysis is saved on your device.'
            : 'Your decision remains yours to make.'}
        </Text>
      </Content>
    </Page>
  );
}
