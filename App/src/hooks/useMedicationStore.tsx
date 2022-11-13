import React, { createContext, ReactNode, useCallback, useContext, useRef, useSyncExternalStore } from "react";
import { Medication } from "../interfaces";

type Store = { medication: Medication[] };

type Subscribe = () => void;

type Unsubscribe = () => void;

type Subscriber = (callback: Subscribe) => Unsubscribe;

type UseStoreDataReturnValue = {
    getter: () => Store,
    setter: (value: Partial<Store>) => void
    subscribe: Subscriber
}

function useStoreData(): UseStoreDataReturnValue {
    const store = useRef<Store>({ medication: [] });

    const subscribers = useRef<Set<Subscribe>>(new Set<Subscribe>());

    const getter: UseStoreDataReturnValue["getter"] = useCallback(() => store.current, []);

    const setter: UseStoreDataReturnValue["setter"] = useCallback((value: Partial<Store>) => {
        store.current = { ...store.current, ...value };
    }, []);

    const subscribe: UseStoreDataReturnValue["subscribe"] = useCallback((callback) => {
        subscribers.current.add(callback);
        return () => subscribers.current.delete(callback);
    }, []);

    return {
        getter,
        setter,
        subscribe,
    };
}

const StoreContext = createContext<UseStoreDataReturnValue | undefined>(undefined);

export function Provider({ children }: { children: ReactNode }): JSX.Element {
    return (
        <StoreContext.Provider value={useStoreData()}>
            {children}
        </StoreContext.Provider>
    );
}

type UseStoreReturnValue<SelectorOutput> = [selector: SelectorOutput, setter: (value: Partial<Store>) => void]

export function useStore<SelectorOutput = Store>(selector?: (store: Store) => SelectorOutput): UseStoreReturnValue<SelectorOutput | Store> {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error("Store not found");
    }

    const selectFunction = selector ? selector : (currentStore: Store) => currentStore;

    const state = useSyncExternalStore(
        store.subscribe,
        () => selectFunction(store.getter()),
        () => selectFunction({ medication: [] }),
    );

    return [state, store.setter];
}
