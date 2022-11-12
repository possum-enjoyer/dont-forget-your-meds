/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

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
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AnimatedFAB, FAB } from 'react-native-paper';


const Stack = createNativeStackNavigator();

const Section: React.FC<
  PropsWithChildren<{
    title: string;
  }>
> = ({ children, title }) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const HomeScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isExtended, setIsExtended] = React.useState(true);

  const onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    console.log("Ich ändere meinen Wert", currentScrollPosition);
    setIsExtended(currentScrollPosition <= 0);
  };
  console.log(isExtended);
  console.log("Ich habe mich neugeladen");
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
      <AnimatedFAB style={styles.fab} extended={isExtended} label="Add Medication" icon={"plus"} onPress={() => console.log('Pressed')} />
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
