import React from 'react';
import { Appearance, ColorSchemeName, useColorScheme } from 'react-native';
import { buildSyncedStore } from './SyncedStoreBuilder';
import { useSettings } from '../StorageHandler';

export type SystemColorSchemeName = ColorSchemeName | 'System';

export const useSystemColorScheme = (): [{color: ColorSchemeName, isSystem: boolean}, (value: SystemColorSchemeName) => void] => {
  const [settings, setSettings] = useSettings();

  const setColor = React.useCallback((value: SystemColorSchemeName) => {
    if (value === 'System') {
        setSettings({isSystem: true, color: Appearance.getColorScheme()});
    }
    else {
      setSettings({isSystem: false, color: value});
    }
  }, [setSettings]);

  React.useEffect(() => {
    const remover = Appearance.addChangeListener(() => setColor('System'));
    return () => remover.remove();
  }, [setColor]);

  return [{color: settings?.color, isSystem: Boolean(settings?.isSystem)}, setColor];
};
