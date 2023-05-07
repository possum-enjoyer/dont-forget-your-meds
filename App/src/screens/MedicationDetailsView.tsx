import React from "react";
import { useMedicationList } from "../hooks";
import { Text } from "react-native";

export const MedicationDetailsView = (): JSX.Element => {
    const [meds, medicationFuncs] = useMedicationList();

    return (<>
        {meds.map(med => {
            return <Text key={med.id}>
                {med.title}
            </Text>;
        })}
    </>);
};
