import React, { useEffect } from "react";
import { MMKV, useMMKVObject } from 'react-native-mmkv';
import { ColorSchemeName, Appearance } from "react-native";

export const storage = new MMKV();
interface SettingsStorage {
    color?: ColorSchemeName,
    isSystem?: boolean
}

type useSettingsReturnValue = [SettingsStorage | undefined, ((newSettings: Partial<SettingsStorage>) => void)];

if (!storage.getString('settings')) {
    console.log('empty')
    const defaultSettings: SettingsStorage = {
        color: Appearance.getColorScheme(),
        isSystem: true,
    };
    storage.set('settings', JSON.stringify(defaultSettings))
}

export const useSettings = (): useSettingsReturnValue => {
    const [settings, setSettings] = useMMKVObject<SettingsStorage>('settings', storage);

    const updateSettings = React.useCallback((newSettings: Partial<SettingsStorage>) => {
        if (settings) {
            setSettings({ ...settings, ...newSettings });
        }
        else {
            setSettings(newSettings);
        }
    }, [setSettings, settings]);

    return [settings, updateSettings];
};
