import React from "react";
import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage";

interface SettingsStorage {
    darkMode: boolean
};

type useStorageHolderReturnValue = [SettingsStorage, ((newSettings: Partial<SettingsStorage>) => void)];

const MMKV = new MMKVLoader().withEncryption().initialize();

export const useStorageHolder = (): useStorageHolderReturnValue => {

    const [settings, setSettings] = useMMKVStorage<SettingsStorage>('settings', MMKV, { darkMode: true });

    const updateSettings = React.useCallback((newSettings: Partial<SettingsStorage>) => {
        console.log('updateSettings Triggered');
        setSettings(oldSettings => ({ ...oldSettings, ...newSettings }));
    }, [setSettings]);

    return [settings, updateSettings];
};
