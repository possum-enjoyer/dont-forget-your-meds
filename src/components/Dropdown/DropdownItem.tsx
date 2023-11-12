import React, { useContext } from "react";
import { Menu, MenuItemProps } from "react-native-paper";
import DropdownContext from "./DropdownContext";

export interface Props extends Omit<MenuItemProps, 'onPress'> {
    value: string;
}

const DropdownItem = (props: Props) => {
    const dropdownContext = useContext(DropdownContext);

    return <Menu.Item style={{ maxWidth: undefined }} onPress={() => dropdownContext.onChange?.(props.value)} {...props} />;
};


export default DropdownItem;
