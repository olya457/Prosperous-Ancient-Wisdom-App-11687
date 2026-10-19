import principlesData from './principles.json';
import lessonsData from './lessons.json';
import quizzesData from './quizzes.json';
export const principles = principlesData;
export const lessons = lessonsData;
export const quizzes = quizzesData;
export const categories = [...new Set(principles.map(p => p.category))];
export const philosophies = [
  'Confucianism',
  'Daoism',
  'Mohism',
  'General Reflection',
];
export const modules = [
  'Foundations of Confucianism',
  'Respect & Relationships',
  'Virtue & Character',
  'Learning & Self-Improvement',
  'Leadership & Responsibility',
];
export const moduleDescriptions = [
  'Context, ideas, and a life of cultivated character.',
  'Build thoughtful, reciprocal relationships.',
  'Explore integrity, benevolence, and moral courage.',
  'Turn study and reflection into lifelong practice.',
  'Lead ethically through example and service.',
];
export const assets = {
  splash: require('../assets/wisdom-sunrise-temple.png'),
  logo: require('../assets/wisdom-prosperity-emblem.png'),
  onboarding: [
    require('../assets/onboarding-ancient-wisdom.png'),
    require('../assets/onboarding-daily-reflection.png'),
    require('../assets/onboarding-clear-decisions.png'),
    require('../assets/onboarding-confucian-learning.png'),
    require('../assets/onboarding-wisdom-journal.png'),
  ],
  wisdom: require('../assets/wisdom-calligraphy-banner.png'),
  detail: require('../assets/wisdom-principle-scroll.png'),
  decisions: require('../assets/decision-mountain-sanctuary.png'),
  mountain: require('../assets/lessons-misty-mountains.png'),
  balance: require('../assets/balance-bamboo-forest.png'),
  temple: require('../assets/wisdom-mountain-temple.png'),
};
export const backgrounds: Record<string, string> = {
  Confucianism:
    'Confucian teaching connects learning and self-cultivation with humaneness, appropriate conduct, and responsibility in relationships. This is a contemporary reflection inspired by that tradition, not an ancient quotation.',
  Daoism:
    'Daoist texts explore naturalness, simplicity, flexibility, and action without unnecessary force. This is a contemporary reflection inspired by those themes, not an ancient quotation.',
  Mohism:
    'Mohist thought emphasizes impartial concern, practical benefit, and the effects of actions on others. This is a contemporary reflection inspired by that tradition, not an ancient quotation.',
};
