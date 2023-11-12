import { configureStore } from '@reduxjs/toolkit';
import MedicationReducer from './MedicationSlice';

export const store = configureStore({
    reducer: {
        medication: MedicationReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
