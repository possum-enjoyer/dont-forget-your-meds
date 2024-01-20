import React, { createContext, useContext } from 'react';
import { useMaterial3Theme as usePCHMMaterial3Theme, type Material3Theme, Material3Scheme } from '@pchmn/expo-material3-theme';
import { MD3DarkTheme, MD3LightTheme, MD3Theme, PaperProvider, ProviderProps, useTheme } from 'react-native-paper';
import { useSystemColorScheme } from '../hooks';

type Material3ThemeContextProps = {
    theme: Material3Theme;
    updateTheme: (sourceColor: string) => void;
    resetTheme: () => void;
};

type UseMaterial3ThemeParams = Parameters<typeof usePCHMMaterial3Theme>[0]

export type Material3ThemeProviderProps = ProviderProps & UseMaterial3ThemeParams;

const Material3ThemeProviderContext = createContext<Material3ThemeContextProps>({} as Material3ThemeContextProps);

export function Material3ThemeProvider({
    children,
    sourceColor,
    fallbackSourceColor,
    ...otherProps
}: Material3ThemeProviderProps) {
    const [{ color }] = useSystemColorScheme();

    const { theme, updateTheme, resetTheme } = usePCHMMaterial3Theme({
        sourceColor,
        fallbackSourceColor,
    });

    const paperTheme = React.useMemo(() => color === 'dark' ? { ...MD3DarkTheme, colors: theme.dark } : { ...MD3LightTheme, colors: theme.light }, [color, theme.dark, theme.light]);

    return (
        <Material3ThemeProviderContext.Provider value={{ theme, updateTheme, resetTheme }}>
            <PaperProvider theme={paperTheme} {...otherProps}>
                {children}
            </PaperProvider>
        </Material3ThemeProviderContext.Provider>
    );
}

export function useMaterial3ThemeContext() {
    const ctx = useContext(Material3ThemeProviderContext);
    if (!ctx) {
        throw new Error('useMaterial3Theme must be used inside Material3ThemeProvider');
    }
    return ctx;
}


export const useMD3Theme = useTheme<MD3Theme & { colors: Material3Scheme }>;
