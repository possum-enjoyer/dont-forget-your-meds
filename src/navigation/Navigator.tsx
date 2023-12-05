import React from 'react';
import { Stack } from './NavigationStack';
import { Home, MedicationForm } from '../screens';
import { useTheme as useNavTheme } from '@react-navigation/native';
import { useMD3Theme } from '../providers';

export const Navigator = () => {
  const navTheme = useNavTheme();
  const theme = useMD3Theme();



  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true, statusBarColor: 'transparent', statusBarStyle: navTheme.dark ? "light" : "dark", navigationBarColor: 'transparent' }} >
      <Stack.Screen name="Home" component={Home} options={{ headerTitle: "Don't forget your meds" }} />
      <Stack.Screen name="MedicationForm" component={MedicationForm} options={{ statusBarColor: navTheme.colors.card }} />
    </Stack.Navigator>
  );
};
