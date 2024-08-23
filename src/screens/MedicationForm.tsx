import React from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { StyleSheet, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useForm, Controller, FormProvider, ControllerProps, FieldPath, FieldValues, FieldPathByValue, ControllerRenderProps } from "react-hook-form";
import { TimePickerModal } from 'react-native-paper-dates';
import { RootStackScreenProps } from '../navigation';
import { useMD3Theme, useMedStore } from '../providers';
import { useMedicationStore } from '../hooks';
import { DiscriminatedOmit, Medication } from '../interfaces';
import { Autocomplete, Dropdown } from '../components';

export type MedicationFormProps = {
    formData: Medication
};
export type FormData = DiscriminatedOmit<Medication, 'id'>



type ControlledTimePickerProps<TFieldValues extends FieldValues, TPath extends FieldPathByValue<TFieldValues, Medication['timeSlot']>> = Parameters<ControllerProps<TFieldValues, TPath>["render"]>[0]


const ControlledTimePicker = <TFieldValues extends FieldValues, TPath extends FieldPathByValue<TFieldValues, Medication['timeSlot']>>(props: ControlledTimePickerProps<TFieldValues, TPath>): React.ReactElement => {
    const [visible, setVisible] = React.useState(false);
    const onDismiss = React.useCallback(() => {
        setVisible(false);
    }, [setVisible]);

    const onConfirm = React.useCallback(
        (confirmValues: { hours: number, minutes: number }) => {
            setVisible(false);
            props.field.onChange(confirmValues);
        },
        [props]
    );

    return <View>
        <Button ref={props.field.ref} style={[styles.controller]} onPress={() => setVisible(true)}>Time to take</Button>
        <TimePickerModal
            use24HourClock
            locale="de"
            visible={visible}
            onDismiss={onDismiss}
            onConfirm={onConfirm}
            hours={props.field.value?.hours}
            minutes={props.field.value?.minutes}
        />
    </View>;
};

export const MedicationForm = ({ route: { params }, navigation }: RootStackScreenProps<"MedicationForm">) => {
    const theme = useMD3Theme();
    const form = useForm<FormData>({ defaultValues: params?.formData });
    const [medication, setStore] = useMedStore(s => s.medication);

    const onSubmit = (data: FormData) => {
        if (params?.formData) {
            setStore(store => {
                const index = store.medication.findIndex(v => v.id === params.formData.id);
                store.medication[index] = { ...data, id: params.formData.id };
                return store;
            });
        }
        else {
            setStore((store) => ({
                medication: [...store.medication, { ...data, id: `${++medication.length}` }],
            }));
        }

        navigation.navigate('Home');
    };

    const onError = (errors: any) => {
        console.log(errors);
    };

    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.safeAreaview, { backgroundColor: theme.colors.background, paddingBottom: insets.bottom }]}>
            <KeyboardAvoidingView enabled>
                <FormProvider {...form}>
                    <ScrollView contentContainerStyle={{}}>
                        <Controller control={form.control} name="title" rules={{ required: true }}
                            render={({ field: { onChange, onBlur, value, ref } }) => {
                                return (
                                    <View style={[styles.controller]}>
                                        <TextInput ref={ref} onSubmitEditing={() => form.setFocus('dosage')} returnKeyType="next" label={"Enter Medication Name"} theme={theme} mode="outlined" placeholder="Enter Medication Name" onBlur={onBlur} onChangeText={onChange} value={value} />
                                    </View >
                                );
                            }}
                        />
                        <Controller control={form.control} name="dosage" rules={{ required: true }}
                            render={({ field: { onChange, onBlur, value, ref } }) => {
                                return (
                                    <View style={[styles.controller]}>
                                        <TextInput ref={ref} onSubmitEditing={() => form.setFocus('timeSlot')} returnKeyType="next" label={"Dosage"} theme={theme} keyboardType="numeric" mode="outlined" placeholder="Dosage" onBlur={onBlur} onChangeText={onChange} value={value?.toString()} />
                                    </View >
                                );
                            }}
                        />
                        <View>
                            <Controller control={form.control} name="timeSlot" rules={{ required: true }}
                                render={ControlledTimePicker}
                            />
                        </View>
                        <View>
                            <Controller control={form.control} name="repeat" rules={{ required: true }}
                                render={({ field: { onChange, value } }) => {
                                    return (
                                        <Dropdown mode='outlined' defaultValue={'daily'} onChange={onChange}>
                                            {
                                                ['daily', 'weekly'].map(answer => <Dropdown.Item key={answer} title={answer} value={answer} />)
                                            }

                                        </Dropdown>
                                    );
                                }}
                            />
                        </View>
                        <View>
                            <Controller control={form.control} name="weekDay" rules={{ required: true }}
                                render={({ field: { onChange, value } }) => {
                                    return (
                                        <Dropdown mode='outlined' defaultValue={0} onChange={onChange}>
                                            {
                                                [0, 1, 2, 3, 4, 5, 6].map(answer => <Dropdown.Item key={answer} title={answer} value={answer} />)
                                            }

                                        </Dropdown>
                                    );
                                }}
                            />
                        </View>
                        <View style={{ margin: 32 }}>
                            <Controller control={form.control} name='takenWithMeal' rules={{ required: true }}
                                render={({ field: { onChange, value } }) => {
                                    const choices = [{ ans: 'Yes', v: true }, { ans: 'No', v: false }];
                                    return (
                                        <Dropdown mode="outlined" value={choices.find(p => p.v === value)?.ans ?? "Yes"} onChange={onChange}>
                                            {
                                                choices.map(answer => <Dropdown.Item key={answer.ans} title={answer.ans} value={answer.v} />)
                                            }

                                        </Dropdown>
                                    )
                                }}
                            />
                        </View>
                        <Button style={styles.controller} mode="elevated" onPress={form.handleSubmit(onSubmit, onError)}>Submit</Button>
                    </ScrollView>
                </FormProvider>
            </KeyboardAvoidingView>
        </View>


    );
};

const styles = StyleSheet.create({
    safeAreaview: {
        flex: 1,
        justifyContent: 'space-around',
        height: "100%",
    },

    controller: {
        margin: 16,
    },
});
