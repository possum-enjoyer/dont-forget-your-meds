import { buildSyncedStore } from "../hooks/SyncedStoreBuilder";
import { Medication } from "../interfaces";

type MedStoreData = {
    medication: Medication[]
}

const MedicationStore = buildSyncedStore({ medication: [] } as MedStoreData);

export const useMedStore = MedicationStore.useStore;
export const MedicationStoreProvider = MedicationStore.StoreProvider;
