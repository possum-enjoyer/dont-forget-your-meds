import { View, TextInput as NativeTextInput } from "react-native";
import React, { ReactElement, useEffect, useState } from "react";
import DropdownContext from "./DropdownContext";
import { Props as DropdownItemProps } from "./DropdownItem";
import { Menu, TextInputProps, TouchableRipple, TextInput, Text } from "react-native-paper";

export interface Props<TValue> extends Omit<TextInputProps, 'value' | 'onChange' | 'defaultValue'> {
    children?: ReactElement<DropdownItemProps<TValue>> | Array<ReactElement<DropdownItemProps<TValue>>>;
    onChange?: (value: TValue) => void;
    value?: TValue;
    valueText?: string;
    defaultValue?: TValue;
    required?: boolean;
    textRef?: React.RefObject<NativeTextInput>
}

export type DropdownBaseContextData = {
    width: number,
    setWidth: React.Dispatch<React.SetStateAction<number>>
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const DropdownBaseContext = React.createContext<DropdownBaseContextData>(
    {
        open: false,
        setOpen: () => { },
        setWidth: () => { },
        width: 0,
    }
);

const DropdownBase = <TValue,>({
    value: valueFromProps,
    valueText: valueTextFromProps,
    required,
    onChange,
    defaultValue,
    children,
    textRef,
    ...textInputProps
}: Props<TValue>) => {
    const isControlled = typeof valueFromProps !== "undefined";
    const {
        width,
        setWidth,
        open,
        setOpen,
    } = React.useContext(DropdownBaseContext);
    const [internalValue, setInternalValue] = useState<TValue | undefined>(defaultValue);

    useEffect(() => {
        if (typeof valueFromProps !== "undefined") {
            setInternalValue(valueFromProps);
        }
    }, [valueFromProps]);

    const value = isControlled ? valueFromProps : internalValue;
    console.log(typeof valueFromProps)
    const valueText = typeof valueTextFromProps !== "undefined" ? valueTextFromProps : value;
    return (
        <View>
            <Menu
                anchor={
                    <View onLayout={(event) => {
                        if (width !== event.nativeEvent.layout.width) {
                            setWidth(event.nativeEvent.layout.width);
                        }
                    }}>
                        <TouchableRipple
                            onPress={() => setOpen(true)}>
                            <TextInput
                                editable={false}
                                right={
                                    value !== undefined && value !== null && !required ?
                                        <TextInput.Icon icon="close-circle-outline" onPress={() => {
                                            onChange?.(undefined as TValue);
                                            setInternalValue(undefined as TValue);
                                        }} />
                                        : undefined
                                }
                                value={valueText?.toString() ?? ""}
                                ref={textRef}
                                onChangeText={textInputProps.onChangeText}
                                {...textInputProps}
                            />
                        </TouchableRipple>
                    </View>
                }
                anchorPosition="bottom"
                contentStyle={{ width: width }}
                style={{ borderRadius: 500 }}
                visible={open}
                onDismiss={() => {
                    setOpen(false);
                    textRef?.current?.blur();
                }}>
                <DropdownContext.Provider value={{
                    onChange: (newValue) => {
                        setInternalValue(newValue as TValue);
                        onChange?.(newValue as TValue);
                        setOpen(false);
                        textRef?.current?.blur();
                    },
                }}>
                    {children}
                </DropdownContext.Provider>
            </Menu>
        </View>
    );
};

export default DropdownBase;

