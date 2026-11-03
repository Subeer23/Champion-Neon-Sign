import { RevealScrollView } from './ScrollReveal';
import React, { useContext, type PropsWithChildren } from 'react';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../design-system/tokens/colors';
import { spacing } from '../../design-system/tokens/spacing';
export function Screen({
  children,
  revealOnScroll = false,
}: PropsWithChildren<{ revealOnScroll?: boolean }>) {
  const Content = revealOnScroll ? RevealScrollView : ScrollView;
  const tabBarHeight = useContext(BottomTabBarHeightContext);
  return (
    <SafeAreaView
      style={styles.safe}
      edges={
        tabBarHeight === undefined
          ? ['left', 'right', 'bottom']
          : ['left', 'right']
      }
    >
      <Content
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.content}
      >
        {children}
      </Content>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: 20,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    flexGrow: 1,
  },
});
