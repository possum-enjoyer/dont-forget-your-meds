import React from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { StyleSheet, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useForm, Controller, FormProvider, ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { TimePickerModal } from 'react-native-paper-dates';
import { RootStackScreenProps } from '../navigation';
import { useMD3Theme, useMedStore } from '../providers';
import { useMedicationStore } from '../hooks';
import { Medication } from '../interfaces';

export type MedicationFormProps = {
    formData: Medication
};

export type FormData = Omit<Medication, 'id'>


const ControlledTimePicker = (props: Parameters<ControllerProps<FormData, "timeSlot">["render"]>[0]): React.ReactElement => {
    const [visible, setVisible] = React.useState(false);
    const onDismiss = React.useCallback(() => {
        setVisible(false);
    }, [setVisible]);

    const onConfirm = React.useCallback(
        (confirmValues: { hours: number, minutes: number }) => {
            setVisible(false);
            props.field.onChange(confirmValues);
        },
        [props.field]
    );

    return <View>
        <Button style={[styles.controller]} onPress={() => setVisible(true)}>Pick Time</Button>
        <TimePickerModal
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

        navigation.replace('Home');
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
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <View style={[styles.controller]}>
                                        <TextInput label={"Enter Medication Name"} theme={theme} mode="outlined" placeholder="Enter Medication Name" onBlur={onBlur} onChangeText={onChange} value={value} />
                                    </View >
                                );
                            }}
                        />
                        <Controller control={form.control} name="dosage" rules={{ required: true }}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <View style={[styles.controller]}>
                                        <TextInput label={"Dosage"} theme={theme} keyboardType="numeric" mode="outlined" placeholder="Dosage" onBlur={onBlur} onChangeText={onChange} value={value?.toString()} />
                                    </View >
                                );
                            }}
                        />
                        <View>
                            <Controller control={form.control} name="timeSlot" rules={{ required: true }}
                                render={ControlledTimePicker}
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
