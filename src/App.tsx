/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import "react-native";
import { Material3ThemeProvider, MedicationStoreProvider, SafeAreaProviderWithDefaultBackground } from './providers';
import { NavContainer, Navigator } from './navigation';


const App = () => {
  return (
    <>
      <Material3ThemeProvider>
        <MedicationStoreProvider>
          <NavContainer>
            <SafeAreaProviderWithDefaultBackground>
              <Navigator />
            </SafeAreaProviderWithDefaultBackground>
          </NavContainer>
        </MedicationStoreProvider>
      </Material3ThemeProvider>
    </>
  );
};


export default App;
