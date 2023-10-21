import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput } from 'react-native-paper';
import { useMD3Theme } from '../providers';
import { StyleSheet } from 'react-native/types';

export type MedicationFormProps = {

};

export const MedicationForm = () => {
    const theme = useMD3Theme();

    return (
        <SafeAreaView mode="margin" edges={['bottom', 'left', 'right', 'top']} style={styles.safeAreaview}>
            <Text>Enter Medication Name</Text>
            <TextInput theme={theme} mode="outlined" placeholder="Enter Medication Name" />
        </SafeAreaView>


    );
};

const styles = StyleSheet.create({
    safeAreaview: {
        flex: 1,
        height: '100%',
        padding: 32,
    },
});
