import React from 'react';
import type { TabScreenProps } from '../../../app/navigation/types';
import { Button } from '../../../design-system/components';
import { Screen } from '../../../shared/components/Screen';
export function MoreScreen({ navigation }: TabScreenProps<'More'>) {
  return (
    <Screen>
      <Button
        label="About Us"
        variant="secondary"
        onPress={() => navigation.navigate('AboutUs')}
      />
      <Button
        label="Clients"
        variant="secondary"
        onPress={() => navigation.navigate('Clients')}
      />
      <Button
        label="FAQs"
        variant="secondary"
        onPress={() => navigation.navigate('FAQs')}
      />
      <Button
        label="Contact Us"
        variant="secondary"
        onPress={() => navigation.navigate('ContactUs')}
      />
      <Button
        label="Get a Quote"
        onPress={() => navigation.navigate('GetQuote')}
      />
    </Screen>
  );
}
