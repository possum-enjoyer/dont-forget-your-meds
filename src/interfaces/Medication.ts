export interface Medication {
    id: string,
    title: string,
    dosage: number,
    timeSlot: { hours: number, minutes: number }
}
