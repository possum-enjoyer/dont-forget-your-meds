import React from 'react';
import { AnimatedFAB, Button, Text, Chip, IconButton, PaperProvider, Card, Menu, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeScrollEvent, NativeSyntheticEvent, StyleSheet, FlatList, View } from 'react-native';
import { useMD3Theme, useMedStore } from '../providers';
import { RootStackScreenProps } from '../navigation';
import { Calendar } from 'react-native-paper-dates';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming, } from 'react-native-reanimated';
import { Medication } from '../interfaces';
import { buildSyncedStore } from '../hooks/SyncedStoreBuilder';
import { DateTime } from 'luxon';

type DateStoreType = {
    date: Date
}

const DateStore = buildSyncedStore({ date: new Date() } as DateStoreType);

const useDateStore = DateStore.useStore;
const DateStoreProvider = DateStore.StoreProvider;


const getAllMonthDatesByDate = (date: Date): DateTime[] => {
    const parsedDate = DateTime.fromJSDate(date);

    return Array.from(Array(parsedDate.daysInMonth), (_, x: number) => {
        return DateTime.local(parsedDate.year, parsedDate.month, x + 1);
    });
};

const calculateStartofWeek = (date: Date): number => {
    const parsed = DateTime.fromJSDate(date);
    return parsed.startOf('week').day;
};

const ChipSelectedWeek = () => {
    const flatRef = React.useRef<FlatList<DateTime>>(null);
    const [date, setDate] = useDateStore(s => s.date);

    React.useEffect(() => {
        flatRef.current?.scrollToIndex({ index: calculateStartofWeek(date) - 1 });
    }, [date])

    const week = React.useMemo(() => getAllMonthDatesByDate(date), [date]);
    return <FlatList onScrollToIndexFailed={({ index }) => { console.log(index) }} ref={flatRef} scrollEnabled showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ alignItems: "center", justifyContent: 'space-between', flexDirection: 'row' }} data={week} renderItem={({ item: weekDay }) => {
        return <Chip key={weekDay.toJSDate().toUTCString()} onPress={() => { setDate({ date: weekDay.toJSDate() }); }} mode={date.getUTCDate() === weekDay.toJSDate().getUTCDate() ? 'flat' : 'outlined'}>
            {weekDay.toFormat('EEEEE')}
            {weekDay.toFormat('dd')}
        </Chip>;
    }} />;

};

const OwnCalendar = () => {

    const [date, setDate] = useDateStore(s => s.date);


    return <Calendar date={date} onChange={(newDate) => { setDate({ date: newDate.date || new Date() }); }} locale='de' mode='single' startMonday={true} />;

};

const CalendarComponent = () => {
    const theme = useMD3Theme();
    const flex = useSharedValue(0);
    const rotationX = useSharedValue<string>('0deg');
    const rotationStyle = useAnimatedStyle(() => ({
        transform: [{ rotateX: withTiming(rotationX.value, { duration: 100 }) }],
    }));

    const bgColor = theme.colors.surfaceContainer;

    const clickOpenButton = React.useCallback(() => {
        const isExpand = flex.value > 0;
        flex.value = withSpring(isExpand ? 0 : 1.5);
        rotationX.value = isExpand ? '0deg' : '180deg';
    }, [flex, rotationX]);

    return (
        <Animated.View style={{ flex, display: 'flex', backgroundColor: bgColor, margin: 8 }}>
            <Animated.View style={{ alignItems: "center", justifyContent: 'space-between', flexDirection: 'row' }}>
                <ChipSelectedWeek />
            </Animated.View>
            <PaperProvider theme={{ ...theme, colors: { ...theme.colors, surface: bgColor } }}>
                <OwnCalendar />
            </PaperProvider>
            <View style={{ alignItems: 'center' }}>
                <Animated.View style={[rotationStyle]}>
                    <IconButton icon={'chevron-down'} onPress={() => clickOpenButton()} />
                </Animated.View>
            </View>

        </Animated.View>
    );
};

const MedicationCardMenu = ({ visible, closeMenu, openMenu, medication, deleteMedication }: {
    visible: boolean,
    closeMenu: () => void,
    openMenu: () => void,
    medication: Medication,
    deleteMedication: (id: Medication['id']) => void
}) => {
    const navigation = useNavigation<RootStackScreenProps<"MedicationForm">["navigation"]>();

    return (
        <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={<IconButton icon={"dots-vertical"} onPress={openMenu} />}>
            <Menu.Item onPress={() => { closeMenu(); navigation.navigate('MedicationForm', { formData: medication }); }} title="Edit" />
            <Menu.Item onPress={() => { deleteMedication(medication.id) }} title="Delete" />
        </Menu>
    );
};

const MedicationCard = ({ medicationId }: { medicationId: string }) => {

    const [medication, setMedication] = useMedStore(s => s.medication.find(m => m.id === medicationId) || s.medication[0]);
    const [date] = useDateStore(s => s.date);


    const updateSelectedMedication = React.useCallback(() => {
        setMedication(old => {
            old.medication = old.medication.map(m => {
                if (m.id !== medication.id) {
                    return m;
                }
                m.lastTakenTimeStamps.push(date);
                return m;
            });
            return old;
        });
    }, [date, medication.id, setMedication]);

    const deleteMedicationFromStore = React.useCallback((id: Medication['id']) => {
        setMedication(old => {
            old.medication = old.medication.filter(m => m.id !== id);
            return old;
        })
    }, [setMedication])


    const [isMenuVisible, setMenu] = React.useState<boolean>(false);
    if (medication.repeat === 'weekly' && medication.weekDay !== date.getDate()) {
        return <></>
    }
    return (
        <Card key={medication.id} style={{ margin: 32 }}>
            <Card.Title title={medication.title} right={
                (props) =>
                    <MedicationCardMenu
                        visible={isMenuVisible}
                        closeMenu={() => setMenu(false)}
                        openMenu={() => setMenu(true)}
                        medication={medication} deleteMedication={deleteMedicationFromStore} />}
            />

            {medication.takenWithMeal &&
                <Card.Content>
                    <Text> Taken with Meal </Text>
                </Card.Content>
            }
            <Card.Actions>
                <Text>
                    {medication.timeSlot.hours}:{medication.timeSlot.minutes}
                </Text>
                {medication.lastTakenTimeStamps?.some(d => d.toDateString() === date.toDateString()) ? <IconButton icon="check" /> : <Button onPress={() => updateSelectedMedication()}>Done</Button>}

            </Card.Actions>
        </Card>
    );
};

export const Home = (): Element => {
    const [isExtended, setIsExtended] = React.useState(true);
    const onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
        setIsExtended(currentScrollPosition <= 0);
    };
    const [medication] = useMedStore(s => s.medication);

    const navigation = useNavigation<RootStackScreenProps<"MedicationForm">["navigation"]>();

    const theme = useMD3Theme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.surfaceContainer }} mode='margin' edges={{ bottom: "off", top: 'off', right: 'additive', left: 'additive' }}>
            <DateStoreProvider>
                <CalendarComponent />
                <View style={{ flex: 1, }} >
                    <Surface style={{ backgroundColor: theme.colors.surface, width: '100%', borderTopLeftRadius: 36, borderTopRightRadius: 36 }} elevation={5}>
                        <FlatList
                            data={medication.map(m => m.id)}
                            renderItem={m => <MedicationCard medicationId={m.item} />}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            onScroll={onScroll}
                        />
                        {/* <ScrollView onScroll={onScroll} contentContainerStyle={{ width: '50%' }}>
                    {
                        medication.map(m => <MedicationCard medication={m} />)
                    }
                </ScrollView> */}
                    </Surface>

                </View>



                <AnimatedFAB style={styles.fab} extended={isExtended} label="Add Medication" icon="plus" onPress={() => {
                    navigation.navigate("MedicationForm");
                }} />
            </DateStoreProvider>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 64,
    },
});
