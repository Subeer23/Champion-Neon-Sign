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
  ClientsTab: undefined;
  ContactTab: undefined;
};
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  SolutionDetails: { solutionId: string };
  ProjectDetails: { projectId: string };
  AboutUs: undefined;
  FounderJourney: undefined;
  More: undefined;
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  MyQuotations: undefined;
  QuotationDetails: { quotationId: string };
  SavedProjects: undefined;
  Notifications: undefined;
  AppSettings: undefined;
  HelpSupport: undefined;
  LegalDocument: { kind: 'privacy' | 'terms' };
  Clients: undefined;
  Testimonials: undefined;
  FAQs: undefined;
  ContactUs: undefined;
  GetQuote:
    | { solutionId?: string; projectId?: string; draftId?: string }
    | undefined;
  GalleryViewer: { projectId: string; initialIndex?: number };
};
export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
export type TabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type RootNavigation = Pick<
  RootScreenProps<'MainTabs'>['navigation'],
  'navigate'
>;
