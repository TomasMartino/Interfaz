import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { RootStackParamList } from "../../../../App";
import { Poll } from "../browsePolls/browsePolls";
import BrowsePollsView from "../../Components/browsePollsView/browsePollsView";
import { pollsStart } from "../browsePolls/data";

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
  const [polls, setPolls] = useState<Poll[]>([]);

  return (
    <View style={styles.view}>
      <View style={{justifyContent: "center", width: "100%", alignItems: "center"}}>
        <Avatar.Text
          size={120}
          label={user.name.slice(0, 1)}
          style={{ marginTop: 32, marginBottom: 16 }}
        />
        <View style={{ marginBottom: 16 }}>
          <Text
            variant="displayMedium"
            style={{ textAlign: "center" }}
          >{`${user.name} ${user.lastName}`}</Text>
          <Text variant="headlineSmall">{user.email}</Text>
        </View>
      </View>
      <Button
        mode="contained"
        icon="plus-circle-outline"
        style={{
          marginBottom: 16,
        }}
        onPress={() => navigation.navigate("CreatePoll")}
      >
        Crear votación
      </Button>
      <Button
        mode="elevated"
        icon="chart-box-outline"
        style={{
          marginBottom: 16,
        }}
        onPress={() => navigation.navigate("BrowsePoll")}
      >
        Explorar encuestas
      </Button>
      <Text variant="headlineSmall" style={[styles.margin, { textAlign: "center"}]}>Mis Encuestas</Text>
      <ScrollView style={styles.container}>
        <BrowsePollsView polls={polls} navigation={navigation} />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: "100%",
  },
  view: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
    alignItems: "stretch",
  },
  margin: {
    marginBottom: 16
  }
});
