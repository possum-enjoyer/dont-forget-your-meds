import React, { type PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { createNativeStackNavigator, NativeStackNavigationProp,NativeStackScreenProps  } from '@react-navigation/native-stack';
import { useNavigation } from "@react-navigation/native";

import { AnimatedFAB, Card } from 'react-native-paper';

type RootStackParamList = {
  Home: undefined,
  Test: undefined,
  Input: { foo?: number }
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const Section: React.FC<
  PropsWithChildren<{
    title: string;
  }>
> = ({ children, title }) => {
  const color = useColorScheme() === 'dark' ? Colors.black : Colors.white;
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const TestNavElement = () => {
  return <>
    <SafeAreaView>
      <Section title="Test">
        <Text style={testStyles.testText}>
          Hier ist ein Test Text
        </Text>
      </Section>
      <Section title="Meds">
        <Card>
          <Text>
            Test
          </Text>
        </Card>
      </Section>
    </SafeAreaView>
  </>;
};

const testStyles = StyleSheet.create({
  testText: {
    fontSize: 36,
  },
});

const App = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Test" component={TestNavElement} options={{ headerShown: true, animation: 'default' }} />
      <Stack.Screen name="Input" component={Input} options={{ headerShown: true, animation: 'default' }} />
    </Stack.Navigator>
  );
};


const Input = (props: NativeStackScreenProps<RootStackParamList, "Input"> ) => {
  console.log(props)
  return <SafeAreaView>
    <Text>The ID is: {props.route.params.foo}</Text>
  </SafeAreaView>;
};

const HomeScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isExtended, setIsExtended] = React.useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "Home">>();

  const onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <TextInput> Dies ist ein Überfall </TextInput>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        onScroll={onScroll}
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
      <AnimatedFAB style={styles.fab} extended={isExtended} label="Add Medication" icon={"plus"} onPress={() => {
        navigation.navigate("Input", { foo: 10 });
      }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 64,
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
