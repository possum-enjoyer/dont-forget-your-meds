import React from 'react';
import { AnimatedFAB, Button, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';
import { useMD3Theme, useMedStore } from '../providers';
import { RootStackScreenProps } from '../navigation';
import { SystemColorSchemeName, useSystemColorScheme } from '../hooks';
import { Autocomplete, Dropdown } from '../components';

export function Home(): JSX.Element {
    const [isExtended, setIsExtended] = React.useState(true);
    const [{ color, isSystem }, setColor] = useSystemColorScheme();
    const onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
        setIsExtended(currentScrollPosition <= 0);
    };
    const [medication] = useMedStore(s => s.medication);

    const navigation = useNavigation<RootStackScreenProps<"MedicationForm">["navigation"]>();

    const theme = useMD3Theme();

    return (
        <SafeAreaView style={{ height: "100%", backgroundColor: theme.colors.surface }} mode='margin' edges={{ bottom: "additive", top: 'off' }}>
            <View style={{ margin: 32 }}>
                <Autocomplete label="Pick a Theme" required options={['dark', 'light', 'System']} mode='outlined' value={isSystem ? 'System' : color} onChange={v => setColor(v as SystemColorSchemeName)}
                    renderItem={(s => {
                        return <Dropdown.Item key={s} title={s} value={s} />
                    })} />
            </View>

            <View style={{ margin: 32 }}>
                <Dropdown
                    label="Pick a Theme" required mode='flat' value={isSystem ? 'System' : color} onChange={v => setColor(v as SystemColorSchemeName)} >
                    <Dropdown.Item title='light' value='light' key={'lightD'} />
                    <Dropdown.Item title='dark' value='dark' key={'darkD'} />
                    <Dropdown.Item title='System' value='System' key={'SystemD'} />
                </Dropdown>
            </View>
            <ScrollView onScroll={onScroll} contentContainerStyle={{ height: "100%", flex: 1, alignItems: "center", margin: 32, width: '100%' }} >
                {medication.map((m) => <View style={{ paddingBottom: 24 }} key={m.id}>
                    <Text>{m.title}</Text>
                    <Text>Dosage: {m.dosage}</Text>
                    <Button onPress={() => { navigation.navigate('MedicationForm', { formData: m }) }}>Edit</Button>
                </View>)}
            </ScrollView>
            <AnimatedFAB style={styles.fab} extended={isExtended} label="Add Medication" icon="plus" onPress={() => {
                navigation.navigate("MedicationForm");
            }} />
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 64,
    },
});
