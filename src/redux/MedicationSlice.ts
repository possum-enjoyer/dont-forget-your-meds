import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AtLeast, Medication } from '../interfaces';
import { RootState } from './configureStore';


type MedicationState = {
    medication: Medication[]
};

const initialState: MedicationState = {
    medication: [],
};

export const MedicationSlice = createSlice({
    name: 'medication',
    initialState,
    reducers: {
        addMedication: {
            reducer: (state, action: PayloadAction<Medication>) => {
                state.medication.push(action.payload);
            },
            prepare: (payload: Omit<Medication, 'id'>) => {
                const id = `${payload.title}_${nanoid()}`;
                return {payload: {...payload, id}};
            },
        },
        removeMedicationById: (state, action: PayloadAction<Medication['id']>) => {
            state.medication = state.medication.filter(s => s.id !== action.payload);
        },
        modifyMedicationById: (state, action: PayloadAction<AtLeast<Medication, 'id'>>) => {
            const ind = state.medication.findIndex(m => m.id === action.payload.id);
            if (ind > -1) {
                state.medication[ind] = {...state.medication[ind], ... action.payload};
            }
        },
    },
});



export const { addMedication, modifyMedicationById, removeMedicationById } = MedicationSlice.actions;


export const  medicationSelector = (state: RootState) => state.medication.medication;


export default MedicationSlice.reducer;
