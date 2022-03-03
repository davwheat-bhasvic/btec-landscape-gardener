import React from 'react';

import { Text, HStack, Switch, useColorMode, NativeBaseProvider, IconButton } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { atom, RecoilRoot, useRecoilState } from 'recoil';

import HomeScreen from './src/screens/HomeScreen';
import AddScreen from './src/screens/AddScreen';

// function ToggleDarkMode() {
//   const { colorMode, toggleColorMode } = useColorMode();
//   return (
//     <HStack space={2} alignItems="center">
//       <Text>Dark</Text>
//       <Switch
//         isChecked={colorMode === 'light'}
//         onToggle={toggleColorMode}
//         aria-label={colorMode === 'light' ? 'switch to dark mode' : 'switch to light mode'}
//       />
//       <Text>Light</Text>
//     </HStack>
//   );
// }

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Home: undefined;
  Add: undefined;
};

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
              }}
            />
            <Stack.Screen
              name="Add"
              component={AddScreen}
              options={{
                title: 'Add gardening service',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </RecoilRoot>
  );
};

export default App;
