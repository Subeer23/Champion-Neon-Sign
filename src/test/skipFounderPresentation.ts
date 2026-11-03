import { act, type ReactTestRenderer } from 'react-test-renderer';
import { Button } from '../design-system/components';
/** Existing feature tests explicitly skip the new presentation through its real UI. */
export async function skipFounderPresentation(renderer: ReactTestRenderer) {
  await act(async () => {
    const skip = renderer.root
      .findAllByType(Button)
      .find(
        item => item.props.accessibilityLabel === 'Skip founder presentation',
      );
    if (skip) {
      jest.advanceTimersByTime(3000);
    }
  });
  await act(async () => {
    renderer.root
      .findAllByType(Button)
      .find(
        item => item.props.accessibilityLabel === 'Skip founder presentation',
      )
      ?.props.onPress();
  });
}
