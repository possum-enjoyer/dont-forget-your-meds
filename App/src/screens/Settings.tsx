import { Switch, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react';
import { useStorageHolder } from "../StorageHandler";
import { StyleSheet, View } from "react-native";

export const Settings = () => {
    const [storage, setStorage] = useStorageHolder();

    console.log('rendered');


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.switchContainer}>
                <Text>{storage.darkMode ? "Darkmode" : "Lightmode"}</Text>
                <Switch style={styles.switch} value={storage.darkMode} onValueChange={() => { setStorage({ darkMode: !storage.darkMode }); }} />
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
