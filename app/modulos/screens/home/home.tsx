import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { RootStackParamList } from "../../../../App";
import { Poll } from "../browsePolls/browsePolls";
import BrowsePollsView from "../../Components/browsePollsView/browsePollsView";
import { supabase } from "../../../../backend/server/supabase";


type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

type User = {
  name: string;
  lastName: string;
  email: string;
  registration_date: Date;
  active: boolean;
};

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<User | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error obteniendo usuario:", error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        const { user_metadata, email } = data.user;
        setUser({
          name: user_metadata?.name || "Usuario",
          lastName: user_metadata?.lastName || "",
          email: email || "",
          registration_date: new Date(user_metadata?.registration_date || Date.now()),
          active: true,
        });
      }

      setLoading(false);
    };

    getUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando usuario...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>No hay sesión activa</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Login")}
          style={{ marginTop: 16 }}
        >
          Ir al login
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.view}>
      <View style={styles.center}>
        <Avatar.Text
          size={120}
          label={user.name.slice(0, 1)}
          style={{ marginTop: 32, marginBottom: 16 }}
        />
        <View style={{ marginBottom: 16 }}>
          <Text variant="displayMedium" style={{ textAlign: "center" }}>
            {`${user.name} ${user.lastName}`}
          </Text>
          <Text variant="headlineSmall">{user.email}</Text>
        </View>
      </View>

      <Button
        mode="contained"
        icon="plus-circle-outline"
        style={{ marginBottom: 16 }}
        onPress={() => navigation.navigate("CreatePoll")}
      >
        Crear votación
      </Button>

      <Button
        mode="elevated"
        icon="chart-box-outline"
        style={{ marginBottom: 16 }}
        onPress={() => navigation.navigate("BrowsePoll")}
      >
        Explorar encuestas
      </Button>

      <Text variant="headlineSmall" style={[styles.margin, { textAlign: "center" }]}>
        Mis Encuestas
      </Text>

      <ScrollView style={styles.container}>
        <BrowsePollsView polls={polls} navigation={navigation} />
      </ScrollView>

      <Button
        mode="outlined"
        icon="logout"
        style={{ marginVertical: 24 }}
        onPress={async () => {
          await supabase.auth.signOut();
          navigation.navigate("Login");
        }}
      >
        Cerrar sesión
      </Button>
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
  center: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  margin: {
    marginBottom: 16,
  },
});
