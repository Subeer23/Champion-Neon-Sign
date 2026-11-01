import React from 'react';
import { useWindowDimensions } from 'react-native';
import {
  createBottomTabNavigator,
  type BottomTabHeaderProps,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';
import { Header } from '../../design-system/components';
import { colors } from '../../design-system/tokens/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { typography } from '../../design-system/tokens/typography';
import { HomeScreen } from '../../features/home/screens/HomeScreen';
import { SolutionsScreen } from '../../features/solutions/screens/SolutionsScreen';
import { ProjectsScreen } from '../../features/projects/screens/ProjectsScreen';
import { MoreScreen } from '../../features/company/screens/MoreScreen';
import { TabIcon } from './TabIcon';
import type { MainTabParamList } from './types';
const Tabs = createBottomTabNavigator<MainTabParamList>();
function TabHeader({ route }: BottomTabHeaderProps) {
  return (
    <Header title={route.name === 'Home' ? 'Champion Group' : route.name} />
  );
}
function screenOptions({
  route,
}: {
  route: RouteProp<MainTabParamList>;
}): BottomTabNavigationOptions {
  return {
    header: TabHeader,
    tabBarHideOnKeyboard: true,
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.muted,
    tabBarLabelPosition: 'below-icon',
    tabBarLabelStyle: {
      ...typography.caption,
      fontFamily: 'Manrope-SemiBold',
      fontSize: 11,
      lineHeight: 16,
    },
    tabBarItemStyle: { paddingVertical: 5 },
    tabBarIcon: ({ color, size }) => (
      <TabIcon name={route.name} color={color} size={size} />
    ),
  };
}
export function MainTabs() {
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  return (
    <Tabs.Navigator
      screenOptions={props => ({
        ...screenOptions(props),
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 44 + 16 * Math.max(1, fontScale) + insets.bottom,
          paddingBottom: insets.bottom,
          elevation: 0,
        },
      })}
    >
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tabs.Screen name="Solutions" component={SolutionsScreen} />
      <Tabs.Screen name="Projects" component={ProjectsScreen} />
      <Tabs.Screen name="More" component={MoreScreen} />
    </Tabs.Navigator>
  );
}
