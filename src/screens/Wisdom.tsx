import React, { useEffect, useState } from 'react';
import { Text, View, Image, Pressable, AppState } from 'react-native';
import {
  ResponsiveRow,
  Page,
  Hero,
  Content,
  Card,
  Button,
  Stats,
  Empty,
  Row,
  Chips,
  Field,
} from '../components/UI';
import { Icon } from '../components/Icon';
import { assets, principles, categories, backgrounds } from '../data';
import { colors, s } from '../theme';
import { useStore } from '../store/AppStore';
import { ScreenProps, useNav } from '../navigation/types';
import { dateKey, displayDate, todayIndex } from '../utils/date';
export function WisdomHome() {
  const nav = useNav();
  const { state, update } = useStore();
  const [today, setToday] = useState(dateKey());
  useEffect(() => {
    const timer = setInterval(() => setToday(dateKey()), 30000);
    const sub = AppState.addEventListener('change', () => setToday(dateKey()));
    return () => {
      clearInterval(timer);
      sub.remove();
    };
  }, []);
  const p =
    principles[todayIndex(principles.length, new Date(`${today}T12:00:00`))];
  return (
    <Page
      title="Ancient Mind Garden"
      subtitle="A daily practice"
      action={
        <Pressable
          accessibilityLabel="Your statistics"
          onPress={() => nav.navigate('Statistics')}
        >
          <Icon name="layers" />
        </Pressable>
      }
    >
      <Hero
        image={assets.wisdom}
        label="Wisdom for today"
        title="A quieter mind sees farther."
        description="Begin with one considered idea, then carry it into your day."
      />
      <Content>
        <View style={s.between}>
          <Text style={[s.label, { color: colors.muted, flex: 1 }]}>
            {displayDate(today)}
          </Text>
          <Text style={s.label}>
            {state.practiced.filter(x => x.date === today).length} practiced
          </Text>
        </View>
        <Card>
          <Image
            source={assets.temple}
            style={{ width: '100%', height: 145, borderRadius: 10 }}
          />
          <Text style={s.label}>Today's principle · {p.tradition}</Text>
          <Text style={s.heading}>{p.title}</Text>
          <Text style={s.body}>{p.meaning}</Text>
          <View style={[s.card, { backgroundColor: colors.raised }]}>
            <Text style={s.label}>Today's practice</Text>
            <Text style={s.body}>{p.practice}</Text>
          </View>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Button
                title="Explore wisdom  →"
                onPress={() => nav.navigate('WisdomDetail', { id: p.id })}
              />
            </View>
            <Pressable
              accessibilityLabel={
                state.saved.includes(p.id) ? 'Unsave wisdom' : 'Save wisdom'
              }
              onPress={() =>
                update(v => ({
                  ...v,
                  saved: v.saved.includes(p.id)
                    ? v.saved.filter(id => id !== p.id)
                    : [...v.saved, p.id],
                }))
              }
              style={{ padding: 13 }}
            >
              <Icon
                name="bookmark"
                color={state.saved.includes(p.id) ? colors.accent : colors.text}
              />
            </Pressable>
          </View>
        </Card>
        <ResponsiveRow>
          <View style={{ flex: 1 }}>
            <Card onPress={() => nav.navigate('Library')}>
              <Icon name="layers" />
              <Text style={s.heading}>Browse wisdom</Text>
              <Text style={s.body}>36 principles →</Text>
            </Card>
          </View>
          <View style={{ flex: 1 }}>
            <Card onPress={() => nav.navigate('History')}>
              <Icon name="clock" />
              <Text style={s.heading}>Wisdom history</Text>
              <Text style={s.body}>Your daily path →</Text>
            </Card>
          </View>
        </ResponsiveRow>
        <View style={s.between}>
          <Text style={s.heading}>Saved wisdom</Text>
          <Pressable onPress={() => nav.navigate('Library', { saved: true })}>
            <Text style={s.label}>View all</Text>
          </Pressable>
        </View>
        {state.saved.length ? (
          principles
            .filter(x => state.saved.includes(x.id))
            .slice(0, 3)
            .map(x => (
              <Card
                key={x.id}
                onPress={() => nav.navigate('WisdomDetail', { id: x.id })}
              >
                <Text style={s.label}>{x.tradition}</Text>
                <Text style={s.heading}>{x.title}</Text>
                <Text style={s.body}>{x.category}</Text>
              </Card>
            ))
        ) : (
          <Empty
            title="Your collection begins here"
            description="Save a principle to revisit it later."
          />
        )}
        <Text style={s.heading}>Daily progress</Text>
        <Stats
          items={[
            { label: 'Practices', value: state.practiced.length },
            { label: 'Saved', value: state.saved.length },
            {
              label: 'Categories',
              value: new Set(
                principles
                  .filter(x => state.viewed.some(v => v.id === x.id))
                  .map(x => x.category),
              ).size,
            },
          ]}
        />
      </Content>
    </Page>
  );
}
export function WisdomDetail({ route }: ScreenProps<'WisdomDetail'>) {
  const { id } = route.params;
  const p = principles.find(x => x.id === id)!;
  const { state, update } = useStore();
  const nav = useNav();
  const done = state.practiced.some(x => x.id === id && x.date === dateKey());
  const saved = state.saved.includes(id);
  useEffect(() => {
    update(v =>
      v.viewed.some(x => x.id === id && x.date === dateKey())
        ? v
        : { ...v, viewed: [{ id, date: dateKey() }, ...v.viewed] },
    );
  }, [id, update]);
  return (
    <Page title="Today's Wisdom" subtitle={p.tradition} back>
      <Hero
        image={assets.detail}
        label={p.category}
        title={p.title}
        description="A principle for thoughtful practice."
      />
      <Content>
        {[
          ['Philosophical principle', p.meaning],
          ['Historical background', backgrounds[p.tradition]],
          [
            'Meaning explained',
            `${p.title} is an invitation to examine your response in context. ${p.question}`,
          ],
          ['Modern life example', p.example],
        ].map(([title, text], i) => (
          <View
            key={title}
            style={{
              gap: 12,
              paddingBottom: 20,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <Text style={s.heading}>
              <Text style={{ color: colors.accent, fontSize: 14 }}>
                0{i + 1}{' '}
              </Text>
              {title}
            </Text>
            <Text style={s.body}>{text}</Text>
          </View>
        ))}
        <Card>
          <Text style={s.label}>Today's practice</Text>
          <Text style={s.heading}>A pause with purpose</Text>
          <Text style={s.body}>{p.practice}</Text>
        </Card>
        <Card>
          <Text style={s.label}>Reflection question</Text>
          <Text style={s.heading}>{p.question}</Text>
        </Card>
        <Button
          title={done ? 'Practice completed' : 'Mark as practiced'}
          icon="check"
          onPress={() => {
            if (!done)
              update(v => ({
                ...v,
                practiced: [...v.practiced, { id, date: dateKey() }],
              }));
          }}
        />
        <Button
          secondary
          title={saved ? 'Saved to collection' : 'Save wisdom'}
          icon="bookmark"
          onPress={() =>
            update(v => ({
              ...v,
              saved: saved ? v.saved.filter(x => x !== id) : [...v.saved, id],
            }))
          }
        />
        <Button
          secondary
          title="Write reflection"
          icon="journal"
          onPress={() =>
            nav.navigate('EntryForm', {
              prefill: {
                category: 'Daily Wisdom',
                philosophy: p.tradition,
                title: p.title,
                notes: p.question,
              },
            })
          }
        />
      </Content>
    </Page>
  );
}
export function Library({ route }: ScreenProps<'Library'>) {
  const { state } = useStore();
  const nav = useNav();
  const saved = route.params?.saved;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const list = principles.filter(
    p =>
      (!saved || state.saved.includes(p.id)) &&
      (filter === 'All' || p.tradition === filter) &&
      `${p.title} ${p.meaning}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <Page
      title={saved ? 'Saved Wisdom' : 'Wisdom Library'}
      subtitle="36 practical principles"
      back
    >
      <Content>
        <Field
          label="Search principles"
          value={search}
          onChange={setSearch}
          placeholder="Search principles"
        />
        <Chips
          items={['All', 'Confucianism', 'Daoism', 'Mohism']}
          value={filter}
          onChange={setFilter}
        />
        {categories.map(category => {
          const items = list.filter(p => p.category === category);
          return items.length ? (
            <Card key={category}>
              <Text style={s.heading}>{category}</Text>
              {items.map(p => (
                <Row
                  key={p.id}
                  title={p.title}
                  subtitle={p.tradition}
                  onPress={() => nav.navigate('WisdomDetail', { id: p.id })}
                />
              ))}
            </Card>
          ) : null;
        })}
        {!list.length && (
          <Empty
            title={saved ? 'No saved principles' : 'No matching principles'}
            description="Try another search or explore the wisdom library."
          />
        )}
      </Content>
    </Page>
  );
}
export function History() {
  const { state } = useStore();
  const nav = useNav();
  const [filter, setFilter] = useState('All Wisdom');
  const list = state.viewed.filter(
    v =>
      filter === 'All Wisdom' ||
      (filter === 'Saved'
        ? state.saved.includes(v.id)
        : state.practiced.some(p => p.id === v.id && p.date === v.date)),
  );
  return (
    <Page title="Wisdom History" subtitle="Your daily archive" back>
      <Content>
        <Card>
          <Text style={s.label}>
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {Array.from(
              {
                length: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() + 1,
                  0,
                ).getDate(),
              },
              (_, i) => {
                const key = dateKey(
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    i + 1,
                  ),
                );
                const active = state.viewed.some(x => x.date === key);
                return (
                  <View
                    key={i}
                    style={{
                      width: '14.28%',
                      paddingVertical: 10,
                      paddingHorizontal: 2,
                      alignItems: 'center',
                      backgroundColor:
                        key === dateKey() ? colors.selected : 'transparent',
                      borderRadius: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: active ? colors.accent : colors.muted,
                        fontSize: 12,
                      }}
                    >
                      {i + 1}
                    </Text>
                  </View>
                );
              },
            )}
          </View>
        </Card>
        <Chips
          items={['All Wisdom', 'Completed', 'Saved']}
          value={filter}
          onChange={setFilter}
        />
        {list.map((v, i) => {
          const p = principles.find(x => x.id === v.id)!;
          return (
            <Row
              key={`${v.id}-${v.date}-${i}`}
              title={p.title}
              subtitle={`${displayDate(v.date)} · ${
                state.practiced.some(x => x.id === v.id && x.date === v.date)
                  ? 'Practice completed'
                  : 'Explored'
              }`}
              onPress={() => nav.navigate('WisdomDetail', { id: v.id })}
            />
          );
        })}
        {!list.length && (
          <Empty
            title="No wisdom history yet"
            description="Your explored principles will appear here."
            button="Explore today's wisdom"
            onPress={() =>
              nav.navigate('WisdomDetail', {
                id: principles[todayIndex(principles.length)].id,
              })
            }
          />
        )}
      </Content>
    </Page>
  );
}
