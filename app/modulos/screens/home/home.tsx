import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View } from "react-native";
import {
  Text,
  Button,
  ActivityIndicator,
  HelperText,
  Avatar,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { RootStackParamList } from "../../../../App";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

type User = {
  name: string;
  lastName: string;
  email: string;
  registration_date: Date;
  active: boolean;
};

const userExample: User = {
  name: "Juez",
  lastName: "Lopez",
  email: "juezlopez@hotmail.com",
  registration_date: new Date(),
  active: false,
};

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<User>(userExample);

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Avatar.Text
        size={120}
        label={user.name.slice(0, 1)}
        style={{marginTop: 32, marginBottom: 16 }}
      />
      <View style={{marginBottom: 16}}>
      <Text variant="displayMedium" style={{textAlign : 'center'}}>{`${user.name} ${user.lastName}`}</Text>
      <Text variant="headlineSmall">{user.email}</Text>

      </View>
      <Button
        mode="contained"
        icon='plus-circle-outline'
        style={{
          width: "80%",
          marginBottom: 16,
        }}
        onPress={() => navigation.navigate('CreatePoll')}
      >
        Crear votación
      </Button>
      <Button
        mode="elevated"
        icon='chart-box-outline'
        style={{
          width: "80%",
          marginBottom: 16,
        }}
      >
        Explorar encuestas
      </Button>
    </View>
  );
};

export default HomeScreen;
