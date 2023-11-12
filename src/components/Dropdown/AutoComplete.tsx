import React, { useState } from "react";
import { Props as DropdownItemProps } from "./DropdownItem";
import { TextInputProps } from "react-native-paper";
import DropdownBase, { DropdownBaseContext, Props as DropdownBaseProps } from './DropdownBase'
import { TextInput as NativeTextInput } from 'react-native';


export type PaperTextInputRef = NativeTextInput & TextInputProps;

export type Option = string | { title: string, value: string };

export type AutocompleteProps<TOption extends Option = Option> = Omit<DropdownBaseProps, 'onBlur' | 'onFocus' | 'editable' | 'children'> & {
    options: TOption[]
    renderItem: (item: TOption) => React.ReactElement<DropdownItemProps>
};

export const Autocomplete = <TOption extends Option = Option>({
    value: valueFromProps,
    options,
    renderItem,
    onChange: onChangeFromProps,
    ...restProps
}: AutocompleteProps<TOption>) => {
    const textRef: DropdownBaseProps['textRef'] | undefined = React.useRef(null);
    const [textValue, setTextValue] = useState<string>(valueFromProps ?? "");
    const [width, setWidth] = useState(0);
    const [open, setOpen] = useState(false);

    const onChange = React.useCallback((value: AutocompleteProps<TOption>['value']) => {
        onChangeFromProps?.(value || "");
        setTextValue(value ?? "");
    }, [onChangeFromProps]);

    React.useEffect(() => {
        if (valueFromProps !== textValue) {
            setTextValue(valueFromProps ?? "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valueFromProps]);

    return (
        <DropdownBaseContext.Provider value={{
            open,
            setOpen,
            setWidth,
            width,
        }}>
            <DropdownBase editable={true} onChange={onChange} textRef={textRef} {...restProps} defaultValue={valueFromProps ?? ""} onFocus={() => setOpen(true)}
                onBlur={() => { setTextValue(valueFromProps ?? ""); setOpen(false); }} onChangeText={setTextValue}>
                {options.filter(s => {
                    if (typeof s === "string") {
                        return s.includes(textValue);
                    }
                    else {
                        return s.value.includes(textValue);
                    }
                }).map(renderItem)}
            </DropdownBase>
        </DropdownBaseContext.Provider>
    );
};
