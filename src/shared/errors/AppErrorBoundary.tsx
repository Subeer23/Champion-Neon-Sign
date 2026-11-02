import React, { Component, type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button } from '../../design-system/components';
import { colors } from '../../design-system/tokens/colors';

/** Catch render/lifecycle failures without logging profile data or deleting storage. */
export class AppErrorBoundary extends Component<
  PropsWithChildren,
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <View style={styles.page}>
        <AppText variant="title" accessibilityRole="alert">
          Let’s try that again
        </AppText>
        <AppText muted>
          The app could not display this screen. Your saved local data is
          preserved. Unsaved changes may be lost when you restart the view.
        </AppText>
        <Button
          label="Restart app view"
          onPress={() => this.setState({ failed: false })}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 32,
    gap: 20,
  },
});
