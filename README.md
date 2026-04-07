# Native Cycle Tracker

A beautiful, offline-first menstrual cycle tracking app built with React Native and Expo.

## Features

- **Cycle Calendar**: Visual monthly calendar with color-coded days
- **Period & Symptom Logging**: Track flow intensity, symptoms, mood, and discharge
- **Cycle Prediction**: Smart prediction engine for next period and fertile windows
- **Insights & Analytics**: Charts showing cycle patterns and symptom frequency
- **Reminders & Notifications**: Customizable daily logging reminders and cycle alerts
- **Offline-First**: All data stored locally on device
- **Beautiful Design**: Warm, organic aesthetic with smooth animations

## Tech Stack

- React Native + Expo SDK 51
- TypeScript
- React Navigation (Stack + Bottom Tabs)
- AsyncStorage for local persistence
- React Native Reanimated for animations
- Victory Native for charts
- Expo Notifications for reminders
- Date-fns for date calculations

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Run on your preferred platform:
   - iOS: `npx expo start --ios`
   - Android: `npx expo start --android`
   - Web: `npx expo start --web`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # App screens and navigation
├── services/       # Data storage and notifications
├── utils/          # Date calculations and prediction logic
├── types/          # TypeScript type definitions
└── hooks/          # React hooks for state management
```

## Data Model

The app uses AsyncStorage to persist cycle entries and user settings locally. All data remains private and never leaves the device.

## Testing

Run unit tests:
```bash
npx jest
```

## Build & Deploy

Build for production:
```bash
npx expo build:ios
npx expo build:android
```

## License

This project is for educational purposes.