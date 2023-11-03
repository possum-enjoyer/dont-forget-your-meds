/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Material3ThemeProvider, MedicationStoreProvider } from './providers';
import { NavContainer, Navigator } from './navigation';


const App = () => {
  return (
    <>
      <SafeAreaProvider >
        <Material3ThemeProvider>
          <NavContainer >
            <MedicationStoreProvider>
              <Navigator />
            </MedicationStoreProvider>
          </NavContainer>
        </Material3ThemeProvider>
      </SafeAreaProvider>
    </>
  );
};


export default App;
