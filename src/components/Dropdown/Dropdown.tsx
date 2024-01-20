import React, { useState } from 'react';
import DropdownBase, { DropdownBaseContext, Props as DropdownbaseProps } from './DropdownBase';
import DropdownItem from './DropdownItem';

type DropdownExport = typeof DropdownComponent & {
    Item: typeof DropdownItem;
};

const DropdownComponent = <TValue,>(props: DropdownbaseProps<TValue>) => {
    const [width, setWidth] = useState(0);
    const [open, setOpen] = useState(false);

    return (
        <DropdownBaseContext.Provider value={{
            open,
            setOpen,
            setWidth,
            width,
        }}>
            <DropdownBase {...props} />
        </DropdownBaseContext.Provider>
    );
};

export const Dropdown: DropdownExport = Object.assign(
    DropdownComponent,
    {
        Item: DropdownItem,
    }
);
