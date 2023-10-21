import React from 'react';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationLightTheme } from '@react-navigation/native';
import { adaptNavigationTheme } from 'react-native-paper';
import { useMD3Theme } from '../providers';

export const NavContainer = ({ children }: { children: React.ReactNode }) => {
    const theme = useMD3Theme();
    const { LightTheme, DarkTheme } = adaptNavigationTheme({ reactNavigationDark: NavigationDarkTheme, reactNavigationLight: NavigationLightTheme, materialDark: theme, materialLight: theme });
    return (
        <NavigationContainer theme={theme.dark ? DarkTheme : LightTheme}>
            {children}
        </NavigationContainer>
    );
};
