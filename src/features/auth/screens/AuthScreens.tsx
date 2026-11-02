import { useStackMotion } from '../../../app/navigation/useStackMotion';
import { useAsyncAction as useDemoAction } from '../../../shared/hooks/useAsyncAction';
import React, { useRef, useState } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  AppText,
  BrandLogo,
  Button,
  Card,
} from '../../../design-system/components';
import { colors } from '../../../design-system/tokens/colors';
import { images } from '../../../assets/images';
import { CinematicBackdrop } from '../../../shared/components/CinematicBackdrop';
import { ContentMedia } from '../../../shared/components/ContentMedia';
import {
  AuthFrame,
  AuthEmblem,
  DemoNotice,
  FormInput,
  TextLink,
  authStyles as s,
} from '../components/AuthPrimitives';
import {
  useAuthRepository,
  useDemoSnapshot,
} from '../data/AuthRepositoryProvider';
import { passwordRules, type DemoChallenge } from '../domain/AuthRepository';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { setDemoAccess } from '../state/authSlice';
export type AuthRoutes = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string; challenge: DemoChallenge };
  CreateNewPassword: { challengeId: string };
  PasswordChanged: undefined;
  LoginSuccess: undefined;
};
type Props<T extends keyof AuthRoutes> = NativeStackScreenProps<AuthRoutes, T>;
const Stack = createNativeStackNavigator<AuthRoutes>();
export function WelcomeScreen({ navigation }: Props<'Welcome'>) {
  const dispatch = useAppDispatch();
  const { saving, error } = useAppSelector(state => state.auth);
  return (
    <View style={styles.page}>
      <CinematicBackdrop source={images.experience} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.welcome}>
          <BrandLogo large />
          <View style={s.space} />
          <AppText variant="title">
            Welcome to{'\n'}
            <AppText variant="title" style={s.accent}>
              Champion Group
            </AppText>
          </AppText>
          <AppText muted>
            Let’s bring your vision to life with visual communication solutions.
          </AppText>
          <View style={s.space} />
          <Button
            label="Get Started"
            onPress={() => navigation.navigate('SignUp')}
          />
          <TextLink
            label="Already have a demo account? Login"
            onPress={() => navigation.navigate('Login')}
          />
          <Button
            label="Continue as guest"
            variant="secondary"
            loading={saving}
            onPress={() => dispatch(setDemoAccess('guest'))}
          />
          {error && <AppText accessibilityRole="alert">{error}</AppText>}
          <DemoNotice />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
function Credentials({
  navigation,
  signup,
}: {
  navigation: Pick<
    Props<'Login'>['navigation'],
    'navigate' | 'replace' | 'goBack' | 'canGoBack'
  >;
  signup: boolean;
}) {
  const repository = useAuthRepository();
  const action = useDemoAction();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [consent, setConsent] = useState(false);
  const submit = () =>
    action.run(async () => {
      Keyboard.dismiss();
      if (signup && (password !== confirm || !consent))
        throw new Error('Match both passwords and acknowledge demo mode.');
      if (signup) await repository.signUp(name, email, password, phone);
      else await repository.login(email, password);
      setPassword('');
      setConfirm('');
      navigation.replace('LoginSuccess');
    });
  return (
    <AuthFrame
      title={signup ? 'Sign Up' : 'Login'}
      onBack={() =>
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.replace('Welcome')
      }
    >
      <AppText variant="title" style={s.heading}>
        {signup ? 'Create Your' : 'Welcome Back!'}
        {signup && (
          <AppText variant="title" style={s.accent}>
            {'\n'}Demo Account
          </AppText>
        )}
      </AppText>
      <AppText muted>
        {signup
          ? 'Let’s get your preview started.'
          : 'Please login to continue in demo mode.'}
      </AppText>
      <DemoNotice />
      {signup && (
        <FormInput
          label="Full Name"
          icon="user"
          placeholder="Demo Visitor"
          value={name}
          onChangeText={setName}
          editable={!action.busy}
        />
      )}
      <FormInput
        label="Email Address"
        placeholder="demo@example.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        editable={!action.busy}
      />
      {signup && (
        <FormInput
          label="Phone Number"
          icon="phone"
          keyboardType="phone-pad"
          placeholder="+971 50 000 0000"
          value={phone}
          onChangeText={setPhone}
          editable={!action.busy}
        />
      )}
      <FormInput
        label="Password"
        icon="lock"
        secret
        placeholder="Use a sample password"
        value={password}
        onChangeText={setPassword}
        editable={!action.busy}
      />
      {signup ? (
        <>
          <FormInput
            label="Confirm Password"
            icon="lock"
            secret
            value={confirm}
            onChangeText={setConfirm}
            editable={!action.busy}
          />
          <AppText variant="caption" muted>
            8–128 characters, uppercase, number and special character.
          </AppText>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityLabel="I understand this is a demo account"
            accessibilityState={{ checked: consent }}
            onPress={() => setConsent(!consent)}
            style={s.row}
          >
            <AppText style={s.accent}>{consent ? '☑' : '□'}</AppText>
            <AppText variant="caption" style={s.flex}>
              I understand this is a demo account with no real account security.
            </AppText>
          </Pressable>
        </>
      ) : (
        <TextLink
          label="Forgot Password?"
          onPress={() => navigation.navigate('ForgotPassword')}
        />
      )}
      {action.error && (
        <AppText accessibilityRole="alert" style={s.error}>
          {action.error}
        </AppText>
      )}
      <Button
        label={
          action.busy
            ? signup
              ? 'Creating account…'
              : 'Checking password…'
            : signup
            ? 'Sign Up'
            : 'Login'
        }
        loading={action.busy}
        onPress={submit}
      />
      {action.busy && (
        <AppText accessibilityLiveRegion="polite" muted>
          Password processing is running on this device. This may take a few
          seconds.
        </AppText>
      )}
      <View style={s.space} />
      <TextLink
        label={
          signup
            ? 'Already have a demo account? Login'
            : 'Don’t have an account? Sign Up'
        }
        onPress={() => navigation.replace(signup ? 'Login' : 'SignUp')}
      />
    </AuthFrame>
  );
}
export function LoginScreen({ navigation }: Props<'Login'>) {
  return <Credentials navigation={navigation} signup={false} />;
}
export function SignUpScreen({ navigation }: Props<'SignUp'>) {
  return <Credentials navigation={navigation} signup />;
}
export function ForgotPasswordScreen({ navigation }: Props<'ForgotPassword'>) {
  const [email, setEmail] = useState('');
  const repository = useAuthRepository();
  const action = useDemoAction();
  return (
    <AuthFrame title="Forgot Password" onBack={navigation.goBack}>
      <AuthEmblem />
      <AppText variant="title" style={s.centered}>
        Forgot Password?
      </AppText>
      <AppText muted style={s.centered}>
        Enter your registered demo email. Your verification code appears here
        only; no SMS or email is sent.
      </AppText>
      <FormInput
        label="Email Address"
        placeholder="demo@example.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {action.error && (
        <AppText accessibilityRole="alert">{action.error}</AppText>
      )}
      <Button
        label="Generate Demo Code"
        loading={action.busy}
        onPress={() =>
          action.run(async () => {
            const challenge = await repository.requestReset(email);
            navigation.navigate('OTPVerification', { email, challenge });
          })
        }
      />
      <View style={s.space} />
      <TextLink
        label="Remember your password? Login"
        onPress={() => navigation.replace('Login')}
      />
    </AuthFrame>
  );
}
export function OTPVerificationScreen({
  navigation,
  route,
}: Props<'OTPVerification'>) {
  const repository = useAuthRepository();
  const action = useDemoAction();
  const [challenge, setChallenge] = useState(route.params.challenge);
  const [code, setCode] = useState('');
  const inputs = useRef<(React.ComponentRef<typeof TextInput> | null)[]>([]);
  return (
    <AuthFrame title="OTP Verification" onBack={navigation.goBack}>
      <AuthEmblem />
      <AppText variant="heading" style={s.centered}>
        Verify the demo code
      </AppText>
      <AppText muted style={s.centered}>
        No message was sent to {route.params.email}.
      </AppText>
      <AppText style={s.centered}>
        Demo code: {challenge.code} · valid for 5 minutes
      </AppText>
      <View style={styles.otp}>
        {Array.from({ length: 6 }, (_, index) => (
          <TextInput
            key={index}
            ref={ref => {
              inputs.current[index] = ref;
            }}
            accessibilityLabel={`Code digit ${index + 1}`}
            keyboardType="number-pad"
            maxLength={6}
            selectTextOnFocus
            value={code[index] ?? ''}
            style={styles.digit}
            onChangeText={value => {
              const digits = value.replace(/\D/g, '');
              if (digits.length > 1) {
                setCode(digits.slice(0, 6));
                inputs.current[5]?.focus();
              } else {
                const chars = code.padEnd(6, ' ').split('');
                chars[index] = digits || ' ';
                setCode(chars.join('').trimEnd());
                if (digits) inputs.current[Math.min(5, index + 1)]?.focus();
              }
            }}
          />
        ))}
      </View>
      {action.error && (
        <AppText accessibilityRole="alert">{action.error}</AppText>
      )}
      <TextLink
        label="Generate a new demo code"
        onPress={() =>
          action.run(async () => {
            setChallenge(await repository.requestReset(route.params.email));
            setCode('');
            inputs.current[0]?.focus();
          })
        }
      />
      <View style={s.space} />
      <Button
        label="Verify Demo Code"
        loading={action.busy}
        onPress={() =>
          action.run(async () => {
            await repository.verifyCode(challenge.id, code);
            navigation.replace('CreateNewPassword', {
              challengeId: challenge.id,
            });
          })
        }
      />
    </AuthFrame>
  );
}
export function CreateNewPasswordScreen({
  navigation,
  route,
}: Props<'CreateNewPassword'>) {
  const repository = useAuthRepository();
  const action = useDemoAction();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const rules = passwordRules(password);
  return (
    <AuthFrame title="Create New Password" onBack={navigation.goBack}>
      <AuthEmblem />
      <AppText variant="title" style={s.centered}>
        Create New Password
      </AppText>
      <DemoNotice />
      <FormInput
        label="New Password"
        icon="lock"
        secret
        value={password}
        onChangeText={setPassword}
      />
      {[
        'At least 8 characters',
        'One uppercase letter',
        'One number',
        'One special character',
      ].map((label, index) => (
        <AppText
          key={label}
          variant="caption"
          style={rules[index] ? s.accent : undefined}
        >
          {rules[index] ? '✓' : '○'} {label}
        </AppText>
      ))}
      <FormInput
        label="Confirm New Password"
        icon="lock"
        secret
        value={confirm}
        onChangeText={setConfirm}
      />
      {action.error && (
        <AppText accessibilityRole="alert">{action.error}</AppText>
      )}
      <Button
        label="Update Demo Password"
        loading={action.busy}
        onPress={() =>
          action.run(async () => {
            if (password !== confirm) throw new Error('Passwords must match.');
            await repository.resetPassword(route.params.challengeId, password);
            setPassword('');
            setConfirm('');
            navigation.reset({
              index: 0,
              routes: [{ name: 'PasswordChanged' }],
            });
          })
        }
      />
    </AuthFrame>
  );
}
export function PasswordChangedScreen({
  navigation,
}: Props<'PasswordChanged'>) {
  return (
    <AuthFrame title="Demo Reset Complete">
      <View style={s.space} />
      <AuthEmblem success />
      <AppText variant="title" style={s.centered}>
        Password Changed{'\n'}Demo Complete
      </AppText>
      <AppText muted style={s.centered}>
        Your local demo password has been updated. Login using the new password.
        No external account was changed.
      </AppText>
      <View style={s.space} />
      <Button
        label="Go to Login"
        onPress={() =>
          navigation.reset({
            index: 1,
            routes: [{ name: 'Welcome' }, { name: 'Login' }],
          })
        }
      />
    </AuthFrame>
  );
}
export function LoginSuccessScreen() {
  const { profile } = useDemoSnapshot();
  const dispatch = useAppDispatch();
  const { saving, error } = useAppSelector(state => state.auth);
  return (
    <AuthFrame title="Demo Home Preview">
      <BrandLogo />
      <AppText variant="title">
        Hello,{' '}
        <AppText variant="title" style={s.accent}>
          {profile?.name ?? 'Demo Visitor'}.
        </AppText>
      </AppText>
      <AppText muted>
        Your demo account is ready. Your session is saved on this device.
      </AppText>
      <ContentMedia
        imageId="exhibition"
        title="Champion Group exhibition showcase"
        resizeMode="cover"
      />
      <Card>
        <AppText variant="heading">Signage. Displays. Experiences.</AppText>
        <AppText muted>
          Explore all 16 solutions and our verified project photography.
        </AppText>
      </Card>
      <DemoNotice />
      {error && <AppText accessibilityRole="alert">{error}</AppText>}
      <View style={s.space} />
      <Button
        label="Explore Demo Home"
        loading={saving}
        onPress={() => dispatch(setDemoAccess('demo'))}
      />
    </AuthFrame>
  );
}
export function AuthNavigator() {
  const motion = useStackMotion();
  const entry = useAppSelector(state => state.auth.entry);
  return (
    <Stack.Navigator
      initialRouteName={entry}
      screenOptions={{
        ...motion,
        statusBarStyle: 'light',
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen
        name="CreateNewPassword"
        component={CreateNewPasswordScreen}
      />
      <Stack.Screen name="PasswordChanged" component={PasswordChangedScreen} />
      <Stack.Screen name="LoginSuccess" component={LoginSuccessScreen} />
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.dark },
  safe: { flex: 1 },
  welcome: {
    flexGrow: 1,
    padding: 24,
    gap: 16,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  otp: { flexDirection: 'row', gap: 6 },
  digit: {
    flex: 1,
    minWidth: 0,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    color: colors.text,
    textAlign: 'center',
    fontFamily: 'Manrope-SemiBold',
    fontSize: 20,
  },
});
