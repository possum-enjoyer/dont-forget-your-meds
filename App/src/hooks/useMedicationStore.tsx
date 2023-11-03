import React, { createContext, ReactNode, useCallback, useContext, useRef, useSyncExternalStore } from "react";
import { Medication } from "../interfaces";

export type Store = { medication: Medication[] };

export type Subscribe = () => void;

export type Unsubscribe = () => void;

export type Subscriber = (callback: Subscribe) => Unsubscribe;

export type UseStoreDataReturnValue = {
    getter: () => Store,
    setter: (value: Partial<Store>) => void
    subscribe: Subscriber
}

export type UseStoreReturnValue<SelectorOutput = Store> = [selector: SelectorOutput, setter: (value: Partial<SelectorOutput>) => void];

function useStoreData(): UseStoreDataReturnValue {
    const store = useRef<Store>({ medication: [] });

    const subscribers = useRef<Set<Subscribe>>(new Set<Subscribe>());

    const getter: UseStoreDataReturnValue["getter"] = useCallback(() => store.current, []);

    const setter: UseStoreDataReturnValue["setter"] = useCallback((value: Partial<Store>) => {
        store.current = { ...store.current, ...value };
        subscribers.current.forEach((callback) => callback());
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

export function MedicationProvider({ children }: { children: ReactNode }): JSX.Element {
    return (
        <StoreContext.Provider value={useStoreData()}>
            {children}
        </StoreContext.Provider>
    );
}

export function useMedicationStore<SelectorOutput = Store>(selector: (store: Store) => SelectorOutput): UseStoreReturnValue<SelectorOutput | Store> {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error("Store not found");
    }

    // const selectFunction = selector ? selector : (currentStore: Store) => currentStore;

    const state = useSyncExternalStore(
        store.subscribe,
        () => selector(store.getter()),
        () => selector({ medication: [] }),
    );

    return [state, store.setter];
}



export default function createFastContext<TStore>(initialState: TStore) {
    function useGenericStoreData(): {
        get: () => TStore;
        set: (value: Partial<TStore>) => void;
        subscribe: (callback: () => void) => () => void;
    } {
        const store = useRef(initialState);

        const get = useCallback(() => store.current, []);

        const subscribers = useRef(new Set<() => void>());

        const set = useCallback((value: Partial<TStore>) => {
            store.current = { ...store.current, ...value };
            subscribers.current.forEach((callback) => callback());
        }, []);

        const subscribe = useCallback((callback: () => void) => {
            subscribers.current.add(callback);
            return () => subscribers.current.delete(callback);
        }, []);

        return {
            get,
            set,
            subscribe,
        };
    }

    type UseStoreDataReturnType = ReturnType<typeof useGenericStoreData>;

    const GenericStoreContext = createContext<UseStoreDataReturnType | null>(null);

    function Provider({ children }: { children: React.ReactNode }) {
        return (
            <GenericStoreContext.Provider value={useGenericStoreData()}>
                {children}
            </GenericStoreContext.Provider>
        );
    }

    function useStore<SelectorOutput>(
        selector: (store: TStore) => SelectorOutput
    ): [SelectorOutput, (value: Partial<TStore>) => void] {
        const store = useContext(GenericStoreContext);
        if (!store) {
            throw new Error("Store not found");
        }

        const state = useSyncExternalStore(
            store.subscribe,
            () => selector(store.get()),
            () => selector(initialState),
        );

        return [state, store.set];
    }

    return {
        Provider,
        useStore,
    };
};

export const foobar = createFastContext<Store>({ medication: [] });
