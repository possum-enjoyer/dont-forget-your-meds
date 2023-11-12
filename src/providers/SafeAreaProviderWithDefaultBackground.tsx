import React from 'react';
import { SafeAreaProvider, SafeAreaProviderProps } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';


type SafeAreaProviderWithDefaultBackgroundProps = {
    children: React.ReactNode
} & SafeAreaProviderProps

export const SafeAreaProviderWithDefaultBackground = ({ children, ...restProps }: SafeAreaProviderWithDefaultBackgroundProps) => {
    const theme = useTheme();
    const styled = StyleSheet.compose(styles.safeArea, { backgroundColor: theme.colors.background });
    return <SafeAreaProvider {...restProps} style={StyleSheet.compose(styled, restProps.style)}>
        {children}
    </SafeAreaProvider>;
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
});
