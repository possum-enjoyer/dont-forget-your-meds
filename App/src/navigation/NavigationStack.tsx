import { StackScreenProps, createStackNavigator } from "@react-navigation/stack";

export type RootStackParamList = {
  Home: undefined,
  MedicationForm: undefined,
}

export type RootStackScreenProps<K extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, K>;

export type RootStackRouteProp<K extends keyof RootStackParamList> = RootStackScreenProps<K>["route"]

export const Stack = createStackNavigator<RootStackParamList>();

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

