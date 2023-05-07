/**
 * @format
 */
import React from "react";
import { AppRegistry } from 'react-native';
import App from './src/App';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { name as appName } from './app.json';

export default function Main() {
    return (
        <PaperProvider>
            <App />
        </PaperProvider>
    );
}


AppRegistry.registerComponent(appName, () => Main);
