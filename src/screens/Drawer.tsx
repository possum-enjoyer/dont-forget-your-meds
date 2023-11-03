import React from 'react';
import { Drawer as PaperDrawer } from 'react-native-paper';

export const Drawer = () => {
  const [active, setActive] = React.useState('');

  return (
    <PaperDrawer.Section title="Some title">
      <PaperDrawer.Item
        label="First Item"
        active={active === 'first'}
        onPress={() => setActive('first')}
      />
      <PaperDrawer.Item
        label="Second Item"
        active={active === 'second'}
        onPress={() => setActive('second')}
      />
    </PaperDrawer.Section>
  );
};
