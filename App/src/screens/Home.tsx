import React from 'react';
import { AnimatedFAB } from 'react-native-paper';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { NativeSyntheticEvent, NativeScrollEvent, StyleSheet } from 'react-native/types';
import { useMD3Theme } from '../providers';
import { useNavigation } from '@react-navigation/native';


export function Home(): JSX.Element {
    const [isExtended, setIsExtended] = React.useState(true);
    const onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
        setIsExtended(currentScrollPosition <= 0);
    };

    const navigation = useNavigation();

    const theme = useMD3Theme();

    const insets = useSafeAreaInsets();
    console.log(insets);

    return (
        <SafeAreaView style={{ backgroundColor: theme.colors.primary, flex: 1 }}>
            <AnimatedFAB style={styles.fab} extended={isExtended} label="Add Medication" icon="plus" onPress={() => {
                navigation.navigate("MedicationForm");
            }} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 64,
    },
});
