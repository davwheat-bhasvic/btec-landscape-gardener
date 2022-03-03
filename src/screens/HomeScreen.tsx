import React from 'react';

import { Button, Heading, VStack, Text, HStack, Switch, useColorMode, NativeBaseProvider, IconButton, Stack, TextArea } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRecoilValue } from 'recoil';
import { globalStateAtom, pricingStateAtom } from '../atoms/GlobalStateAtom';
import Service from '../models/Service';
import ServiceNames from '../data/ServiceNames.json';

const HomeScreen = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <IconButton icon={<Icon name="plus" size={24} />} onPress={() => navigation.navigate('Add')} title="Add new service" color="#fff" />
          <IconButton icon={<Icon name="cog" size={24} />} onPress={() => alert('This is a button!')} title="Settings" color="#fff" />
        </>
      ),
    });
  }, [navigation]);

  const { services } = useRecoilValue(globalStateAtom);
  const pricing = useRecoilValue(pricingStateAtom);

  function getTotalCost(service: Service) {
    let cost = 0;

    cost += (service.durationMins / 60) * (pricing[service.serviceName] || 0);

    service.goods.forEach((good) => {
      const val = parseFloat(good.cost);
      if (!isNaN(val)) cost += val;
    });

    return cost.toFixed(2);
  }

  return (
    <VStack>
      {services.map((service, i) => (
        <HStack
          px="6"
          py="4"
          key={Math.random()}
          alignItems="center"
          space="4"
          background="white"
          borderBottomColor="#ccc"
          borderBottomWidth={i + 1 === services.length ? 0 : 1}
        >
          <Text flexGrow={1} fontSize="lg">
            {ServiceNames[service.serviceName]}
          </Text>
          <Text fontSize="lg">£{getTotalCost(service)}</Text>
          <Button onPress={() => alert('test')}>Edit</Button>
        </HStack>
      ))}
    </VStack>
  );
};

export default HomeScreen;
