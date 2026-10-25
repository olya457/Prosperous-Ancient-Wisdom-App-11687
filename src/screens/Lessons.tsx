import React, { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import {
  ResponsiveRow,
  Page,
  Hero,
  Content,
  Card,
  Button,
  Row,
  Progress,
  Stats,
} from '../components/UI';
import { assets, lessons, modules, moduleDescriptions, quizzes } from '../data';
import { s, colors } from '../theme';
import { useStore } from '../store/AppStore';
import { ScreenProps, useNav } from '../navigation/types';
export function LessonsHome() {
  const nav = useNav();
  const { state } = useStore();
  const next = lessons.find(l => !state.completed.includes(l.id));
  return (
    <Page title="Confucius Lessons" subtitle="Study and practice">
      <Hero
        image={assets.temple}
        label="A path of learning"
        title="Learn through reflection and practice."
        description="Twenty-five concise lessons connect historical ideas with modern life."
      />
      <Content>
        <Card>
          <Text style={s.label}>Learning progress</Text>
          <Text style={s.heading}>{state.completed.length} of 25 lessons</Text>
          <Progress value={state.completed.length / 25} />
          <Text style={s.body}>
            {Object.keys(state.quizResults).length} module quizzes completed
          </Text>
          {next && (
            <Button
              title="Continue learning  →"
              onPress={() => nav.navigate('Lesson', { id: next.id })}
            />
          )}
        </Card>
        <Text style={s.heading}>Learning path</Text>
        {modules.map((module, index) => {
          const count = lessons.filter(
            l => l.module === index && state.completed.includes(l.id),
          ).length;
          return (
            <Card
              key={module}
              onPress={() => nav.navigate('Module', { index })}
            >
              <Text style={s.label}>
                0{index + 1} · Module {index + 1}
              </Text>
              <Text style={s.heading}>{module}</Text>
              <Text style={s.body}>{moduleDescriptions[index]}</Text>
              <Progress value={count / 5} />
              <View style={s.between}>
                <Text style={s.body}>{count}/5 lessons</Text>
                <Text style={s.label}>Open module →</Text>
              </View>
              {state.quizResults[index] && (
                <Text style={s.body}>
                  Quiz result: {state.quizResults[index].score}/5
                </Text>
              )}
            </Card>
          );
        })}
      </Content>
    </Page>
  );
}
export function ModuleScreen({ route }: ScreenProps<'Module'>) {
  const { index } = route.params;
  const { state } = useStore();
  const nav = useNav();
  const list = lessons.filter(l => l.module === index);
  const count = list.filter(l => state.completed.includes(l.id)).length;
  return (
    <Page title={`Module ${index + 1}`} subtitle={modules[index]} back>
      <Hero
        image={assets.mountain}
        label={`${count} of 5 complete`}
        title={modules[index]}
        description={moduleDescriptions[index]}
      />
      <Content>
        <Progress value={count / 5} />
        {list.map((l, i) => (
          <Row
            key={l.id}
            title={`${state.completed.includes(l.id) ? '✓' : i + 1}   ${
              l.title
            }`}
            subtitle={`Lesson ${l.id} · Explore through history, reflection, and a contemporary scenario.`}
            onPress={() => nav.navigate('Lesson', { id: l.id })}
          />
        ))}
        <Card>
          <Text style={s.heading}>Test your knowledge</Text>
          <Text style={s.body}>
            Five questions to revisit the ideas in this module.
          </Text>
          {state.quizResults[index] && (
            <Text style={s.label}>
              Last result · {state.quizResults[index].score}/5
            </Text>
          )}
          <Button
            title={state.quizResults[index] ? 'Retry quiz' : 'Start quiz'}
            onPress={() => nav.navigate('Quiz', { index })}
          />
        </Card>
      </Content>
    </Page>
  );
}
const labels = [
  'Introduction',
  'Core principle',
  'Historical context',
  'Modern example',
  'Interactive question',
  'Lesson summary',
];
export function LessonScreen({ route }: ScreenProps<'Lesson'>) {
  const lesson = lessons.find(l => l.id === route.params.id)!;
  const { state, update } = useStore();
  const nav = useNav();
  const [step, setStep] = useState(
    Math.min(state.lessonSteps[lesson.id] || 0, 4),
  );
  const [answer, setAnswer] = useState<number | null>(null);
  const move = (value: number) => {
    setStep(value);
    update(v => ({
      ...v,
      lessonSteps: { ...v.lessonSteps, [lesson.id]: value },
    }));
  };
  return (
    <Page
      title={lesson.title}
      subtitle={`Section ${step + 1} of 6`}
      scrollKey={step}
      back
    >
      <View style={{ padding: 18 }}>
        <Progress value={(step + 1) / 6} />
      </View>
      <Hero
        image={assets.wisdom}
        label={`Lesson ${lesson.id}`}
        title={`0${step + 1}`}
      />
      <Content>
        <Text style={s.label}>{labels[step]}</Text>
        <Text style={s.title}>{labels[step]}</Text>
        <Text
          style={[s.body, { fontSize: 17, lineHeight: 29, color: colors.text }]}
        >
          {lesson.sections[step]}
        </Text>
        {step === 4 && (
          <>
            {lesson.options.map((option, i) => (
              <Pressable
                key={option}
                accessibilityRole="radio"
                accessibilityState={{ checked: answer === i }}
                onPress={() => setAnswer(i)}
                style={[
                  s.card,
                  { borderColor: answer === i ? colors.accent : colors.border },
                ]}
              >
                <Text style={s.body}>
                  {String.fromCharCode(65 + i)} {option}
                </Text>
              </Pressable>
            ))}
            {answer !== null && (
              <Card>
                <Text style={s.heading}>
                  {answer === lesson.answer
                    ? 'A thoughtful response'
                    : 'Consider another angle'}
                </Text>
                <Text style={s.body}>{lesson.explanation}</Text>
              </Card>
            )}
          </>
        )}
        {step === 5 && (
          <Button
            secondary
            title="Write a lesson reflection"
            onPress={() =>
              nav.navigate('EntryForm', {
                prefill: {
                  title: lesson.title,
                  category: 'Lesson Insight',
                  philosophy: 'Confucianism',
                },
              })
            }
          />
        )}
        <ResponsiveRow>
          <View style={{ flex: 1 }}>
            <Button
              title="← Previous"
              secondary
              disabled={step === 0}
              onPress={() => move(step - 1)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title={step === 5 ? 'Complete lesson ✓' : 'Next →'}
              disabled={step === 4 && answer === null}
              onPress={() => {
                if (step === 5) {
                  update(v => ({
                    ...v,
                    completed: [...new Set([...v.completed, lesson.id])],
                    lessonSteps: { ...v.lessonSteps, [lesson.id]: 5 },
                  }));
                  nav.goBack();
                } else move(step + 1);
              }}
            />
          </View>
        </ResponsiveRow>
      </Content>
    </Page>
  );
}
export function QuizScreen({ route }: ScreenProps<'Quiz'>) {
  const index = route.params.index;
  const { update } = useStore();
  const nav = useNav();
  const questions = quizzes[index];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const answer = answers[step];
  const q = questions[step];
  const score = answers.filter((a, i) => a === questions[i].answer).length;
  return (
    <Page
      title={done ? 'Quiz Results' : 'Knowledge Quiz'}
      scrollKey={`${step}-${done}`}
      subtitle={modules[index]}
      back
    >
      <Content>
        {done ? (
          <>
            <Text style={s.title}>A moment to reflect</Text>
            <Stats
              items={[
                { label: 'Correct', value: score },
                { label: 'Percent', value: score * 20 },
              ]}
            />
            <Text style={s.body}>
              Review your answers to reinforce the key concepts.
            </Text>
            {questions.map((question, i) => (
              <Card key={question.question}>
                <Text style={s.heading}>
                  {answers[i] === question.answer ? '✓' : 'Revisit'} ·{' '}
                  {question.question}
                </Text>
                <Text style={s.body}>
                  Your answer: {question.options[answers[i]]}
                </Text>
                <Text style={s.body}>
                  Best answer: {question.options[question.answer]}
                </Text>
                {answers[i] !== question.answer && (
                  <Button
                    secondary
                    title="Review related lesson"
                    onPress={() =>
                      nav.navigate('Lesson', { id: String(index * 5 + i + 1) })
                    }
                  />
                )}
              </Card>
            ))}
            <Button
              title="Retry quiz"
              onPress={() => {
                setStep(0);
                setAnswers([]);
                setDone(false);
              }}
            />
            <Button
              title="Back to module"
              secondary
              onPress={() => nav.goBack()}
            />
          </>
        ) : (
          <>
            <Text style={s.label}>Question {step + 1} of 5</Text>
            <Progress value={(step + 1) / 5} />
            <Text style={s.title}>{q.question}</Text>
            {q.options.map((option, i) => (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{
                  checked: answer === i,
                  disabled: answer !== undefined,
                }}
                disabled={answer !== undefined}
                key={option}
                onPress={() => setAnswers(v => [...v, i])}
                style={[
                  s.card,
                  { borderColor: answer === i ? colors.accent : colors.border },
                ]}
              >
                <Text style={s.body}>
                  {String.fromCharCode(65 + i)} {option}
                </Text>
              </Pressable>
            ))}
            {answer !== undefined && (
              <Card>
                <Text style={s.heading}>
                  {answer === q.answer ? 'Correct' : 'Review this idea'}
                </Text>
                <Text style={s.body}>
                  The best answer in this lesson is “{q.options[q.answer]}”.{' '}
                  {lessons[index * 5 + step].sections[5]}
                </Text>
              </Card>
            )}
            <Button
              title={step === 4 ? 'See results' : 'Next question →'}
              disabled={answer === undefined}
              onPress={() => {
                if (step < 4) setStep(step + 1);
                else {
                  update(v => ({
                    ...v,
                    quizResults: {
                      ...v.quizResults,
                      [index]: { score, answers },
                    },
                  }));
                  setDone(true);
                }
              }}
            />
          </>
        )}
      </Content>
    </Page>
  );
}
