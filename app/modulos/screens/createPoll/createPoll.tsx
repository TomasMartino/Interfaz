import React from 'react'
import {
  Text,
  IconButton,
} from "react-native-paper";
import { View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../App';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

const CreatePollScreen = () => {
      const navigation = useNavigation<NavigationProp>();
    
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <IconButton icon='keyboard-backspace' onPress={() => navigation.goBack()}/>
        <Text variant='displayMedium'>Crear Encuenta</Text>
    </View>
  )
}

export default CreatePollScreen;