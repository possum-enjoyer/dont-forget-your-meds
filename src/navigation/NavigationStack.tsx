import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import { MedicationFormProps } from "../screens";

export type RootStackParamList = {
  Home: undefined,
  MedicationForm: MedicationFormProps | undefined,
}

export type RootStackScreenProps<K extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, K>;

export type RootStackRouteProp<K extends keyof RootStackParamList> = RootStackScreenProps<K>["route"]

export const Stack = createNativeStackNavigator<RootStackParamList>();

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

