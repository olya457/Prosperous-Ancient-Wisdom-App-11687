# Prosperous Ancient Wisdom

React Native + TypeScript application based on the supplied designs and educational texts. All images are bundled from `src/assets`. Personal records start empty and are stored locally with AsyncStorage.

## Run

```sh
npm install
npm start
```

In a second terminal:

```sh
npm run ios
```

Or:

```sh
npm run android
```

After changing native dependencies, install iOS pods from `ios` with `pod install` using the installed Ruby and Node toolchains. This environment has CocoaPods at `/opt/homebrew/bin/pod`.

## Checks

```sh
npm run typecheck
npm test -- --runInBand
npm run lint
```

## Structure

- `src/components`: shared controls, typography, cards, SVG icons, forms, and responsive screen layout.
- `src/navigation`: typed React Navigation stacks and five bottom tabs.
- `src/screens`: onboarding, wisdom, decisions, lessons, balance, and journal flows.
- `src/data`: 36 supplied wisdom principles, 25 lessons, 25 module quiz questions, and local asset references.
- `src/store`: hydration, serialized AsyncStorage writes, and personal data types.
- `src/theme`: colors and shared styles.
- `src/utils`: local calendar dates and identifiers.

## Behavior

The opening screen displays local artwork with a four-second WebView animation. First-time users see five onboarding steps. Returning users open the main tabs.

Wisdom rotates by local calendar date. Saved principles, viewing history, and completed daily practices are stored separately. Decision guidance uses fixed philosophical prompts and the user's own situation, priorities, urgency, and options.

Lessons include six sections and an interactive question. Module quizzes display results and explanations. Progress is saved locally. Balance offers breathing, guided reflections, Wu Wei exercises, and nature observation. Timers pause when the app is backgrounded or the tab loses focus.

The journal supports creating, editing, marking, revisiting, and deleting reflections. Comparisons require two entries from different days. Statistics are calculated from actual activity. No account, server, external image service, or generated personal data is required.

## Validation

Nine automated tests cover content completeness, date handling, onboarding, storage hydration and failure protection, journal creation, decision validation, timer pause/resume/completion, and compact-screen layout rules. The iOS simulator Release target and Android ARM64 Debug target build successfully. Interactive verification on a simulator or physical device has not been completed.

Screen transitions, staggered content reveals, scenic image motion, golden accents, and button feedback respect the system Reduce Motion setting. Compact layouts adapt to 320-point widths, short screens, and enlarged text. Asset filenames describe their role in the wisdom app.
