import { FounderJourneyScreen } from '../../features/founder/screens/FounderJourneyScreen';
import { useStackMotion } from './useStackMotion';
import {
  EditProfileScreen,
  ChangePasswordScreen,
} from '../../features/account/screens/ProfileFormScreens';
import {
  SavedProjectsScreen,
  MyQuotationsScreen,
  QuotationDetailsScreen,
  NotificationsScreen,
} from '../../features/account/screens/AccountCollectionScreens';
import {
  AppSettingsScreen,
  HelpSupportScreen,
  LegalDocumentScreen,
} from '../../features/account/screens/AccountSettingsScreens';
import { Alert } from 'react-native';
import { MoreScreen } from '../../features/company/screens/MoreScreen';
import { ProfileScreen } from '../../features/profile/screens/ProfileScreen';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  useAuthRepository,
  useDemoSelector,
} from '../../features/auth/data/AuthRepositoryProvider';
import { guestQuoteHandoff } from '../../features/quote/state/guestQuoteHandoff';
import {
  createNativeStackNavigator,
  type NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import { Header } from '../../design-system/components';
import { colors } from '../../design-system/tokens/colors';
import { SolutionDetailsScreen } from '../../features/solutions/screens/SolutionDetailsScreen';
import { ProjectDetailsScreen } from '../../features/projects/screens/ProjectDetailsScreen';
import { GalleryViewerScreen } from '../../features/projects/screens/GalleryViewerScreen';
import {
  AboutUsScreen,
  ClientsScreen,
  TestimonialsScreen,
  FAQsScreen,
} from '../../features/company/screens/CompanyScreens';
import { ContactUsScreen } from '../../features/contact/screens/ContactUsScreen';
import { GetQuoteScreen } from '../../features/quote/screens/GetQuoteScreen';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';
const Stack = createNativeStackNavigator<RootStackParamList>();
function StackHeader({
  navigation,
  options,
  route,
  back,
}: NativeStackHeaderProps) {
  return (
    <Header
      title={options.title ?? route.name}
      onBack={back ? navigation.goBack : undefined}
    />
  );
}
function QuoteResumeHome() {
  const navigation =
    useNavigation<
      import('./types').RootScreenProps<'GetQuote'>['navigation']
    >();
  const repo = useAuthRepository();
  const profile = useDemoSelector(snapshot => snapshot.profile);
  const accountId = profile?.id;
  const name = profile?.name ?? '';
  const email = profile?.email ?? '';
  const phone = profile?.phone ?? '';
  useEffect(() => {
    if (!accountId) return;
    let active = true;
    let resuming = false;
    const resume = () => {
      if (resuming || !active) return;
      resuming = true;
      return guestQuoteHandoff
        .restore(accountId)
        .then(async value => {
          if (!value || !active) return;
          const form = {
            ...value.form,
            name: value.form.name || name,
            email: value.form.email || email,
            phone: value.form.phone || phone,
          };
          await guestQuoteHandoff.claim(accountId, value.id);
          if (!active || repo.getSnapshot().profile?.id !== accountId) return;
          // A retry after failed cleanup must not overwrite an already adopted draft.
          const existing = repo
            .getSnapshot()
            .quotations.find(q => q.id === value.id);
          if (!existing) await repo.saveQuoteDraft(form, value.id, value.step);
          await guestQuoteHandoff.clear(value.id);
          if (active && repo.getSnapshot().profile?.id === accountId) {
            if (existing && existing.status !== 'Draft')
              navigation.navigate('QuotationDetails', {
                quotationId: value.id,
              });
            else navigation.navigate('GetQuote', { draftId: value.id });
          }
        })
        .catch(() => {
          resuming = false;
          if (active)
            Alert.alert(
              'Draft restoration failed',
              'Your guest draft is preserved. Retry to restore it to this account.',
              [{ text: 'Retry', onPress: resume }],
            );
        })
        .finally(() => {
          resuming = false;
        });
    };
    resume();
    return () => {
      active = false;
    };
  }, [navigation, accountId, name, email, phone, repo]);
  return <MainTabs />;
}
export function RootNavigator() {
  const motion = useStackMotion();
  return (
    <Stack.Navigator
      screenOptions={{
        ...motion,
        statusBarStyle: 'light',
        contentStyle: { backgroundColor: colors.background },
        header: StackHeader,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={QuoteResumeHome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SolutionDetails"
        component={SolutionDetailsScreen}
        options={{ title: 'Solution Details' }}
      />
      <Stack.Screen
        name="ProjectDetails"
        component={ProjectDetailsScreen}
        options={{ title: 'Project Details' }}
      />
      <Stack.Screen
        name="AboutUs"
        component={AboutUsScreen}
        options={{ title: 'About Us' }}
      />
      <Stack.Screen
        name="FounderJourney"
        component={FounderJourneyScreen}
        options={{ title: 'Founder Journey' }}
      />
      <Stack.Screen name="More" component={MoreScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyQuotations"
        component={MyQuotationsScreen}
        options={{ title: 'My Quotations' }}
      />
      <Stack.Screen
        name="QuotationDetails"
        component={QuotationDetailsScreen}
        options={{ title: 'Quotation Details' }}
      />
      <Stack.Screen
        name="SavedProjects"
        component={SavedProjectsScreen}
        options={{ title: 'Saved Projects' }}
      />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen
        name="AppSettings"
        component={AppSettingsScreen}
        options={{ title: 'App Settings' }}
      />
      <Stack.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
        options={{ title: 'Help & Support' }}
      />
      <Stack.Screen
        name="LegalDocument"
        component={LegalDocumentScreen}
        options={{ title: 'Company Documents' }}
      />
      <Stack.Screen name="Clients" component={ClientsScreen} />
      <Stack.Screen name="Testimonials" component={TestimonialsScreen} />
      <Stack.Screen name="FAQs" component={FAQsScreen} />
      <Stack.Screen
        name="ContactUs"
        component={ContactUsScreen}
        options={{ title: 'Contact Us' }}
      />
      <Stack.Screen
        name="GetQuote"
        component={GetQuoteScreen}
        options={{ title: 'Get a Quote', headerShown: false }}
      />
      <Stack.Screen
        name="GalleryViewer"
        component={GalleryViewerScreen}
        options={{
          title: 'Gallery',
          presentation: 'fullScreenModal',
          animation: motion.animation === 'none' ? 'none' : 'slide_from_bottom',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
