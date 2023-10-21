import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Switch, type SwitchProps, Text, type TextProps } from "react-native-paper";


export type LabeledSwitchProps = {
    onText: string,
    offText: string,
    condition: boolean,
    switchProps?: SwitchProps,
    textProps?: TextProps<never>
};

export const LabeledSwitch = (props: LabeledSwitchProps): JSX.Element => {
    return <>
        <View style={labeledSwitchStyles.switchContainer}>
            <Text {...props.textProps}>{props.condition ? props.onText : props.offText}</Text>
            <Switch style={labeledSwitchStyles.switch} {...props.switchProps} />
        </View>
    </>;
};


const labeledSwitchStyles = StyleSheet.create({
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
