import React from 'react';

import { Text, HStack, Switch, useColorMode, NativeBaseProvider, IconButton } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { atom, RecoilRoot, useRecoilState } from 'recoil';

import HomeScreen from './src/screens/HomeScreen';
import QuizScreen, { QuizScreenProps } from './src/screens/QuizScreen';
import SplashScreen from './src/screens/SplashScreen';
import ResultsScreen, { ResultsScreenProps } from './src/screens/ResultsScreen';

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
  Splash: undefined;
  Home: undefined;
  Quiz: QuizScreenProps;
  Results: ResultsScreenProps;
};

const App = () => {
  return (
    <RecoilRoot>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Quiz"
              component={QuizScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Results"
              component={ResultsScreen}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </RecoilRoot>
  );
};

export default App;
