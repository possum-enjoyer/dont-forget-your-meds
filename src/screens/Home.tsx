import React from 'react';
import { AnimatedFAB, Button, Text, Chip, IconButton, PaperProvider, Card, Menu, Divider, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, FlatList, View } from 'react-native';
import { useMD3Theme, useMedStore } from '../providers';
import { RootStackScreenProps } from '../navigation';
import { Calendar } from 'react-native-paper-dates';
import Animated, { useSharedValue, withSpring, withDelay, withTiming } from 'react-native-reanimated';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { Medication } from '../interfaces';



const getAllWeekDatesByDate = (date: Date): Date[] => {
    let week: Date[] = [];
    const copiedDate = new Date(date);
    const firstDate = copiedDate.getDate() - copiedDate.getDay() + 1;

    copiedDate.setDate(firstDate);
    for (let i = 0; i < 7; i++) {
        week.push(new Date(copiedDate));
        copiedDate.setDate(copiedDate.getDate() + 1);
    }
    return week;
};

const ChipSelectedWeek = () => {
    const currentDate = new Date();

    const week = getAllWeekDatesByDate(currentDate);
    console.log(week);

    return week.map(w => {
        return <Chip key={w.getUTCDate()} onPress={() => { }} mode={currentDate.getUTCDate() === w.getUTCDate() ? 'flat' : 'outlined'}>
            {w.getUTCDate()}
        </Chip>
    })


}

const AnimatedIconButton = Animated.createAnimatedComponent(IconButton);

const CalendarComponent = () => {
    const theme = useMD3Theme();
    const flex = useSharedValue(0);
    const display = useSharedValue<'flex' | 'none'>('flex');
    const display2 = useSharedValue<'flex' | 'none'>('none');

    const bgColor = theme.colors.surfaceContainer;

    const clickOpenButton = React.useCallback(() => {
        const isExpand = flex.value > 0;
        flex.value = withTiming(isExpand ? 0 : 2);
        display.value = isExpand ? 'flex' : 'none'
        display2.value = isExpand ? 'none' : 'flex'
    }, [flex, display, display2]);

    return (
        <Animated.View style={{ flex, display: 'flex', backgroundColor: bgColor, margin: 8 }}>
            <Animated.View style={{ alignItems: "center", justifyContent: 'space-between', flexDirection: 'row' }}>
                <ChipSelectedWeek ></ChipSelectedWeek>
            </Animated.View>
            <PaperProvider theme={{ ...theme, colors: { ...theme.colors, surface: bgColor } }}>
                <Calendar date={new Date()} onChange={(date) => { }} dates={null} locale='de' mode='single' startMonday={true} />
            </PaperProvider>
            <View style={{ alignItems: 'center' }}>
                <AnimatedIconButton icon={'chevron-down'} style={{ display }} onPress={() => clickOpenButton()} />
                <AnimatedIconButton icon={'chevron-up'} style={{ display: display2 }} onPress={() => clickOpenButton()} />
            </View>

        </Animated.View>
    )
}

const MedicationCardMenu = ({ visible, closeMenu, openMenu }: { visible: boolean, closeMenu: () => void, openMenu: () => void }) => {
    return (
        <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={<IconButton icon={"dots-vertical"} onPress={openMenu} />}>
            <Menu.Item onPress={() => { }} title="Edit" />
            <Menu.Item onPress={() => { }} title="Delete" />
        </Menu>
    )
}

const MedicationCard = ({ medication }: { medication: Medication }) => {
    const [isMenuVisible, setMenu] = React.useState<boolean>(false);
    return (
        <Card key={medication.id} style={{ margin: 32 }}>
            <Card.Title title="Card Title" subtitle="Card Subtitle" right={(props) => MedicationCardMenu({
                visible: isMenuVisible,
                closeMenu: () => setMenu(false),
                openMenu: () => setMenu(true)
            })} />

            <Card.Content>
                <Text variant="titleLarge">{medication.title}</Text>
                <Text variant="bodyMedium">Card content</Text>
            </Card.Content>
            <Card.Actions>
                <Button>Cancel</Button>
                <Button>Ok</Button>
            </Card.Actions>
        </Card>
    )
}

export function Home(): JSX.Element {
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
            <CalendarComponent />
            <View style={{ flex: 1, }} >
                <Surface style={{ backgroundColor: theme.colors.surface, width: '100%', borderRadius: 35 }} elevation={5}>
                    <FlatList
                        data={medication}
                        renderItem={m => <MedicationCard medication={m.item} />}
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
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 64,
    },
});
