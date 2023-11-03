import React from 'react';
import { Stack } from './NavigationStack';
import { Home, MedicationForm } from '../screens';
import { useTheme as useNavTheme } from '@react-navigation/native';

export const Navigator = () => {
  const navTheme = useNavTheme();

  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true, statusBarColor: navTheme.colors.card, statusBarStyle: "dark", navigationBarColor: 'transparent' }} >
      <Stack.Screen name="Home" component={Home} options={{ headerTitle: "Don't forget your meds" }} />
      <Stack.Screen name="MedicationForm" component={MedicationForm} />
    </Stack.Navigator>
  );
};
