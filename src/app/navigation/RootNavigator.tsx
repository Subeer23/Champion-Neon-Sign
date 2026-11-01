import React from 'react';
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
export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        header: StackHeader,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
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
        options={{ title: 'Get a Quote' }}
      />
      <Stack.Screen
        name="GalleryViewer"
        component={GalleryViewerScreen}
        options={{
          title: 'Gallery',
          presentation: 'fullScreenModal',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
