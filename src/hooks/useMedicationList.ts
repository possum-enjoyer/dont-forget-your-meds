import { useCallback, useState } from "react";
import { type Medication } from "../interfaces";

export type UseMedicationSetter = {
    addMedicationToList: (newMedication: Omit<Medication, "id">) => void,
    removeMedicationById: (id: string) => void
}

export const useMedicationList = (): [Medication[], UseMedicationSetter] => {
    const [medicationList, setMedicationList] = useState<Medication[]>([]);

    const addMedicationToList = useCallback((newMedication: Omit<Medication, "id">) => {
        setMedicationList(old => [...old, {id:`medicationList.length - 1`, ...newMedication}]);
    }, []);

    const removeMedicationById = useCallback((id: string) => {
        setMedicationList(old => old.filter(medication => medication.id !== id));
    }, [setMedicationList]);


    return [medicationList, { addMedicationToList, removeMedicationById }];
};
