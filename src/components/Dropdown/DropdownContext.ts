import { createContext } from "react";

export interface DropdownContextData<TValue> {
  onChange?: (value: TValue) => void;
}

const DropdownContext = createContext<DropdownContextData<unknown>>({});

export default DropdownContext;
