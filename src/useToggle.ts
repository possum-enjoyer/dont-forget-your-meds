import { useState } from "react";

export const useToggle = (initialValue: boolean): [toggle: boolean, switchToggle: () => void] => {
    const [toggle, setToggle] = useState<boolean>(initialValue);
    return [
        toggle,
        () => setToggle((oldToggle) => !oldToggle),
    ];
};
