import { useCallback, useState } from "react";
import { type Medication } from "../interfaces";

export type UseMedicationSetter = {
    addMedicationToList: (newMedication: Medication) => void,
    removeMedicationById: (id: number) => void
}

export const useMedicationList = (): [Medication[], UseMedicationSetter] => {
    const [medicationList, setMedicationList] = useState<Medication[]>([]);

    const addMedicationToList = useCallback((newMedication: Medication) => {
        setMedicationList(old => [...old, newMedication]);
    }, [setMedicationList]);

    const removeMedicationById = useCallback((id: number) => {
        setMedicationList(old => old.filter(medication => medication.id !== id));
    }, [setMedicationList]);


    return [medicationList, { addMedicationToList, removeMedicationById }];
};
