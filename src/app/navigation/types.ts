import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
export type MainTabParamList = {
  Home: undefined;
  Solutions: undefined;
  Projects: undefined;
  More: undefined;
};
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  SolutionDetails: { solutionId: string };
  ProjectDetails: { projectId: string };
  AboutUs: undefined;
  Clients: undefined;
  FAQs: undefined;
  ContactUs: undefined;
  GetQuote: { solutionId?: string; projectId?: string } | undefined;
  GalleryViewer: { projectId: string; initialIndex?: number };
};
export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
export type TabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;
