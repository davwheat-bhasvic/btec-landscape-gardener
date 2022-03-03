import React, { useState } from 'react';
import { Button, FormControl, HStack, IconButton, Input, Select, Stack, Text, TextArea, View, VStack } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { globalStateAtom, pricingStateAtom } from '../atoms/GlobalStateAtom';

import type Good from '../models/Good';

import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import { useRecoilValue, useSetRecoilState } from 'recoil';

dayjs.extend(dayjsDuration);

interface IFormState {
  selectedService: undefined | 'lawnmowing' | 'gardening' | 'paving' | 'planting';
  notes: string;
  durationHrs: string;
  durationMins: string;
  duration: number;
  goods: Good[];
}

const AddScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Add'>) => {
  React.useLayoutEffect(() => {
    if (navigation.canGoBack()) {
      navigation.setOptions({
        headerLeft: () => (
          <IconButton
            icon={<Icon name="arrow-left" size={24} />}
            onPress={() => {
              Alert.alert('Discard changes?', "If you leave this page, you'll lose all progress you've made so far.", [
                { text: "Don't leave", style: 'cancel', onPress: () => {} },
                {
                  text: 'Leave & discard',
                  style: 'destructive',
                  // If the user confirmed, then we dispatch the action we blocked earlier
                  // This will continue the action that had triggered the removal of the screen
                  onPress: () => navigation.goBack(),
                },
              ]);
            }}
            title="Back"
            color="#fff"
          />
        ),
      });
    }
  }, [navigation]);

  const [formState, setFormState] = useState<IFormState>({
    selectedService: undefined,
    notes: '',
    durationHrs: '0',
    durationMins: '0',
    duration: 0,
    goods: [],
  });

  const setGlobalState = useSetRecoilState(globalStateAtom);
  const pricing = useRecoilValue(pricingStateAtom);

  function updateFormValue<T extends keyof IFormState>(key: T, value: IFormState[T]) {
    setFormState((form) => ({ ...form, [key]: value }));
  }

  function updateGood(index: number, data: Partial<Good>) {
    setFormState((form) => {
      const { goods } = form;
      goods[index] = { ...goods[index], ...data };
      return { ...form, goods };
    });
  }

  function getTotalCost() {
    let cost = 0;

    cost += ((formState.duration || 0) / 60) * (pricing[formState.selectedService ?? ''] || 0);

    formState.goods.forEach((good) => {
      const val = parseFloat(good.cost);
      if (!isNaN(val)) cost += val;
    });

    return cost.toFixed(2);
  }

  return (
    <VStack my="4" mx="2" space="4">
      <FormControl isRequired>
        <Stack mx="4">
          <FormControl.Label>Service provided</FormControl.Label>
          <Select
            size="lg"
            selectedValue={formState.selectedService}
            onValueChange={(itemValue) => updateFormValue('selectedService', itemValue as IFormState['selectedService'])}
          >
            <Select.Item value="lawnmowing" label="Lawnmowing" />
            <Select.Item value="gardening" label="Gardening" />
            <Select.Item value="paving" label="Paving" />
            <Select.Item value="planting" label="Planting" />
          </Select>
        </Stack>
      </FormControl>

      <FormControl>
        <Stack mx="4">
          <FormControl.Label>Notes</FormControl.Label>
          <TextArea size="lg" numberOfLines={3} value={formState.notes} onChange={(e) => updateFormValue('notes', e.currentTarget.value)} />
        </Stack>
      </FormControl>

      <FormControl>
        <Stack mx="4">
          <FormControl.Label>Duration</FormControl.Label>

          <HStack space="2" alignItems="center">
            <Input
              flexGrow={1}
              size="lg"
              type="number"
              keyboardType="number-pad"
              value={formState.durationHrs}
              onChangeText={(e) => {
                updateFormValue('durationHrs', e);
                updateFormValue('duration', parseInt(e) * 60 + parseInt(formState.durationMins));
              }}
            />
            <Text fontSize="lg">h</Text>
            <Input
              flexGrow={1}
              size="lg"
              type="number"
              keyboardType="number-pad"
              value={formState.durationMins}
              onChangeText={(e) => {
                updateFormValue('durationMins', e);
                updateFormValue('duration', parseInt(formState.durationHrs) * 60 + parseInt(e));
              }}
            />
            <Text fontSize="lg">m</Text>
          </HStack>
        </Stack>
      </FormControl>

      <FormControl>
        <Stack mx="4" borderWidth="1" borderRadius="8" borderColor="#ccc" p="4">
          <FormControl.Label>Goods</FormControl.Label>

          <VStack space="2">
            {formState.goods.map((good, i) => (
              <VStack space="2" borderWidth="1" borderRadius="8" borderColor="#ccc" p="4" key={i}>
                <FormControl>
                  <Stack>
                    <FormControl.Label>Description</FormControl.Label>
                    <Input size="lg" type="text" value={good.description} onChangeText={(e) => updateGood(i, { description: e })} />
                  </Stack>
                </FormControl>

                <FormControl>
                  <Stack>
                    <FormControl.Label>Price</FormControl.Label>

                    <HStack space="2">
                      <Input
                        flexGrow={1}
                        size="lg"
                        type="number"
                        keyboardType="number-pad"
                        value={good.cost}
                        onChangeText={(e) => updateGood(i, { cost: e, costNum: parseFloat(e) })}
                      />

                      <Button
                        colorScheme="red"
                        onPress={() => {
                          setFormState((form) => {
                            form.goods.splice(i, 1);
                            console.log(form);

                            return { ...form };
                          });
                        }}
                      >
                        Remove
                      </Button>
                    </HStack>
                  </Stack>
                </FormControl>
              </VStack>
            ))}
          </VStack>

          <Button
            mt="4"
            onPress={() => {
              setFormState((form) => {
                console.log(form);

                const { goods } = form;
                return { ...form, goods: [...goods, { name: '', cost: '0', costNum: 0 }] };
              });
            }}
          >
            Add good
          </Button>
        </Stack>

        <Stack mx="4" mt="4">
          <Text fontSize="lg">Total cost: £{getTotalCost()}</Text>
        </Stack>

        <Stack mx="4" mt="4">
          <Button
            colorScheme="success"
            size="lg"
            onPress={() => {
              if (formState.selectedService === undefined) {
                alert('Please select a service.');
                return;
              } else if (formState.duration < 1) {
                alert('Please set a valid duration.');
                return;
              } else if (formState.goods.find((g) => g.description.trim() === '')) {
                alert('Please enter a valid name for all goods.');
                return;
              }

              setGlobalState((state) => {
                const { services } = state;

                services.push({
                  serviceName: formState.selectedService!,
                  durationMins: formState.duration,
                  goods: formState.goods,
                  notes: formState.notes,
                });

                return { ...state, services };
              });

              navigation.goBack();
            }}
          >
            Save service
          </Button>
        </Stack>
      </FormControl>
    </VStack>
  );
};

export default AddScreen;
