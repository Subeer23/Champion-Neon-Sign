import React from 'react';
import {
  createBottomTabNavigator,
  type BottomTabHeaderProps,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';
import { Header } from '../../design-system/components';
import { colors } from '../../design-system/tokens/colors';
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
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.muted,
    tabBarLabelStyle: typography.caption,
    tabBarIcon: ({ color, size }) => (
      <TabIcon name={route.name} color={color} size={size} />
    ),
    tabBarStyle: {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
    },
  };
}
export function MainTabs() {
  return (
    <Tabs.Navigator screenOptions={screenOptions}>
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
