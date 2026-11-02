import { Platform } from 'react-native';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useReducedMotion } from '../../shared/hooks/useReducedMotion';

/** Keep custom JS headers and content on one slide, including back gestures. */
export function useStackMotion(): Pick<
  NativeStackNavigationOptions,
  'animation' | 'animationMatchesGesture'
> {
  const reducedMotion = useReducedMotion();
  return {
    // iOS's default transition also animates the native navigation bar. Our
    // headers are React views, so use the screen-only native slide instead.
    animation: reducedMotion
      ? 'none'
      : Platform.OS === 'ios'
      ? 'simple_push'
      : 'slide_from_right',
    animationMatchesGesture: true,
  };
}
