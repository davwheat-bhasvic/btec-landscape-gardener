import React from 'react';
import { Link, Text, HStack, Center, Heading, Switch, useColorMode, NativeBaseProvider, VStack, Code, Button, IconButton, Icon } from 'native-base';
import { atom, RecoilRoot, useRecoilState } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Entypo } from '@native-base/icons';

import HomeScreen from './src/screens/HomeScreen';

function ToggleDarkMode() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack space={2} alignItems="center">
      <Text>Dark</Text>
      <Switch
        isChecked={colorMode === 'light'}
        onToggle={toggleColorMode}
        aria-label={colorMode === 'light' ? 'switch to dark mode' : 'switch to light mode'}
      />
      <Text>Light</Text>
    </HStack>
  );
}

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <RecoilRoot>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'Landscape gardening',
                headerRight: () => (
                  <IconButton icon={<Icon as={Entypo} name="emoji-happy" />} onPress={() => alert('This is a button!')} title="Info" color="#fff" />
                ),
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </RecoilRoot>
  );
};

export default App;
