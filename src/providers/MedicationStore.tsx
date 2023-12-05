import { buildSyncedStore } from "../hooks/SyncedStoreBuilder";
import { Medication } from "../interfaces";
import { DummyMedicationList } from "../screens/DummyMedicationList";

type MedStoreData = {
    medication: Medication[]
}

const MedicationStore = buildSyncedStore({ medication: DummyMedicationList } as MedStoreData);

export const useMedStore = MedicationStore.useStore;
export const MedicationStoreProvider = MedicationStore.StoreProvider;
