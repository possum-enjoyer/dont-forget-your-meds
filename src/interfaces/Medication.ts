export interface MedicationBase {
    id: string,
    title: string,
    dosage: number,
    timeSlot: { hours: number, minutes: number },
    lastTakenTimeStamps: Date[],
    takenWithMeal: boolean,
}

export interface WeeklyMedication extends MedicationBase {
    repeat: 'weekly',
    weekDay: number
}

export interface DailyMedication extends MedicationBase {
    repeat: 'daily'
}


export type Medication = DailyMedication | WeeklyMedication;
