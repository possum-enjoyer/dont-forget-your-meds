import { View, TextInput as NativeTextInput } from "react-native";
import React, { ReactElement, useEffect, useState } from "react";
import DropdownContext from "./DropdownContext";
import { Props as DropdownItemProps } from "./DropdownItem";
import { Menu, TextInputProps, TouchableRipple, TextInput, Text } from "react-native-paper";

export interface Props extends Omit<TextInputProps, 'value' | 'onChange'> {
    children?: ReactElement<DropdownItemProps> | Array<ReactElement<DropdownItemProps>>;
    onChange?: (value: string | null) => void;
    value?: string | null;
    valueText?: string;
    defaultValue?: string;
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

const DropdownBase = ({
    value: valueFromProps,
    valueText: valueTextFromProps,
    required,
    onChange,
    defaultValue,
    children,
    textRef,
    ...textInputProps
}: Props) => {
    const isControlled = typeof valueFromProps !== "undefined";
    const {
        width,
        setWidth,
        open,
        setOpen,
    } = React.useContext(DropdownBaseContext);
    const [internalValue, setInternalValue] = useState<string | null>(defaultValue ?? null);

    useEffect(() => {
        if (typeof valueFromProps !== "undefined") {
            setInternalValue(valueFromProps);
        }
    }, [valueFromProps]);

    const value = isControlled ? valueFromProps : internalValue;
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
                                    value && !required ?
                                        <TextInput.Icon icon="close-circle-outline" onPress={() => {
                                            onChange?.(null);
                                            setInternalValue(null);
                                        }} />
                                        : undefined
                                }
                                value={valueText ?? ""}
                                ref={textRef}
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
                        setInternalValue(newValue);
                        onChange?.(newValue);
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

