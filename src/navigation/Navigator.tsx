import React from 'react';
import { Stack } from './NavigationStack';
import { Home, MedicationForm } from '../screens';
import { useTheme as useNavTheme } from '@react-navigation/native';

export const Navigator = () => {
  const navTheme = useNavTheme();

  console.log(navTheme.dark);

  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true, statusBarColor: navTheme.colors.card, statusBarStyle: navTheme.dark ? "light" : "dark", navigationBarColor: 'transparent' }} >
      <Stack.Screen name="Home" component={Home} options={{ headerTitle: "Don't forget your meds" }} />
      <Stack.Screen name="MedicationForm" component={MedicationForm} />
    </Stack.Navigator>
  );
};
