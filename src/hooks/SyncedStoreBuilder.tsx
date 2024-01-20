import React, { createContext, ReactNode, useCallback, useContext, useRef, useSyncExternalStore } from "react";
import { produce, Draft } from "immer";

export type Subscribe = () => void;

export type Unsubscribe = () => void;

export type Subscriber = (callback: Subscribe) => Unsubscribe;

export type SetterValue<Store> = Partial<Store> | ((store: Draft<Store>) => Draft<Store>)

export type UseStoreDataReturnValue<Store> = {
    getter: () => Store,
    setter: (value: SetterValue<Store>) => void
    subscribe: Subscriber
}

export type UseStoreReturnValue<Store, SelectorOutput = Store> = [selector: SelectorOutput, setter: UseStoreDataReturnValue<Store>['setter']];

/**
 * ⚠️ EXPERIMENTAL AND UNTESTED ⚠️
 * @param initialStoreState the initial State of the Store
 * @returns a synced Store
 */
export const buildSyncedStore = <Store,>(initialStoreState: Store) => {
    const StoreContext = createContext<UseStoreDataReturnValue<Store> | undefined>(undefined);

    function useStoreData(): UseStoreDataReturnValue<Store> {
        const store = useRef<Store>(initialStoreState);

        const subscribers = useRef<Set<Subscribe>>(new Set<Subscribe>());

        const getter: UseStoreDataReturnValue<Store>["getter"] = useCallback(() => store.current, []);

        const setter: UseStoreDataReturnValue<Store>["setter"] = useCallback((value: SetterValue<Store>) => {
            if (typeof value === "function") {
                store.current = produce(store.current, value);
            }
            else {
                store.current = produce(store.current, draft => ({ ...draft, ...value }));
            }
            subscribers.current.forEach((callback) => callback());
        }, []);

        const subscribe: UseStoreDataReturnValue<Store>["subscribe"] = useCallback((callback) => {
            subscribers.current.add(callback);
            return () => subscribers.current.delete(callback);
        }, []);

        return {
            getter,
            setter,
            subscribe,
        };
    }

    function StoreProvider({ children }: { children: ReactNode }): JSX.Element {
        return (
            <StoreContext.Provider value={useStoreData()}>
                {children}
            </StoreContext.Provider>
        );
    }

    function useStore<SelectorOutput = Store>(selector?: (store: Store) => SelectorOutput): UseStoreReturnValue<Store, SelectorOutput> {
        const store = useContext(StoreContext);
        if (!store) {
            throw new Error("Store not found. Maybe the Store was not inside it's corresponding Provider");
        }

        const selectFunction = React.useMemo(() => selector ? selector : (currentStore: Store) => currentStore as unknown as SelectorOutput, [selector]);

        const memorized = React.useCallback(() => selectFunction(store.getter()), [selectFunction, store]);

        const state = useSyncExternalStore(
            store.subscribe,
            memorized,
            () => selectFunction(initialStoreState),
        );

        return [state, store.setter];
    }

    return {
        useStore,
        StoreProvider,
    };
};
