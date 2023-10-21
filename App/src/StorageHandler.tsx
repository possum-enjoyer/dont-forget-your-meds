import React from "react";
import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage";
import { Medication } from "./interfaces";

interface SettingsStorage {
    darkMode: boolean
}

interface MedicationStorage {
    medications: Medication[]
}

type useStorageHolderReturnValue = [SettingsStorage, ((newSettings: Partial<SettingsStorage>) => void)];
type useMedStorageHolderReturnValue = [MedicationStorage, ((newSettings: Partial<MedicationStorage>) => void)];

const MMKV = new MMKVLoader().withEncryption().initialize();

export const useStorageHolder = (): useStorageHolderReturnValue => {

    const [settings, setSettings] = useMMKVStorage<SettingsStorage>('settings', MMKV, { darkMode: true });

    const updateSettings = React.useCallback((newSettings: Partial<SettingsStorage>) => {
        console.log('updateSettings Triggered');
        setSettings(oldSettings => ({ ...oldSettings, ...newSettings }));
    }, [setSettings]);

    return [settings, updateSettings];
};

export const useMedStorageHolder = (): useMedStorageHolderReturnValue => {

    const [medications, setMedications] = useMMKVStorage<MedicationStorage>('medications', MMKV, {medications: []});

    const updateMedications = React.useCallback((newMedications: Partial<MedicationStorage>) => {
        console.log('updateSettings Triggered');
        setMedications(oldMedications => ({ ...oldMedications, ...newMedications }));
    }, [setMedications]);

    return [medications, updateMedications];
};
