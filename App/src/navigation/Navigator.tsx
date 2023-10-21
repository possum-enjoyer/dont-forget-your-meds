import React from 'react';
import { Stack } from './NavigationStack';
import { Home, MedicationForm } from '../screens';


export const Navigator = () => {
  return (
    <Stack.Navigator initialRouteName="MedicationForm" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Home" component={Home} options={{ headerTitle: "Don't forget your meds" }} />
      <Stack.Screen name="MedicationForm" component={MedicationForm} />
    </Stack.Navigator>
  );
};
