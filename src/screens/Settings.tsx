/**
 *
 * @format
 */


import { Button, Switch, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react';
import { useStorageHolder } from "../StorageHandler";
import { StyleSheet, View } from "react-native";
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Autocomplete, Dropdown } from "../components";
import { SystemColorSchemeName, useSystemColorScheme } from "../hooks";


export const Settings = () => {
    const [storage, setStorage] = useStorageHolder();
    const [{ color, isSystem }, setColor] = useSystemColorScheme();


    console.log('rendered');

    const awaitNotification = async () => {
        const channelId = await notifee.createChannel({
            id: 'test2',
            name: 'test Channel2',
            importance: AndroidImportance.HIGH,
        });

        await notifee.displayNotification({
            title: 'Notification Title',
            body: 'Main body content of the notification',
            android: {
                channelId,
                pressAction: {
                    id: 'default',
                },
                importance: AndroidImportance.HIGH,
            },
        });
    }


    return (
        <SafeAreaView style={styles.container}>
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
            <View style={styles.switchContainer}>
                <Text>{storage.darkMode ? "Darkmode" : "Lightmode"}</Text>
                <Switch style={styles.switch} value={storage.darkMode} onValueChange={() => { setStorage({ darkMode: !storage.darkMode }); }} />

                <Button onPress={() => { awaitNotification(); }}> Display Notification </Button>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    switch: {
        marginLeft: 10,
    },
});
