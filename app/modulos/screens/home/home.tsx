import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { RootStackParamList } from "../../../../App";
import { Poll } from "../browsePolls/browsePolls";
import BrowsePollsView from "../../Components/browsePollsView/browsePollsView";
import { supabase } from "../../../../backend/server/supabase";
import GradientBackground from "../../Components/gradientBackground/gradientBackground";


type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

type User = {
  username: string;
  email: string;
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
        // Obtener username de la tabla Users
        const { data: userData } = await supabase
          .from("Users")
          .select("username, email")
          .eq("id", data.user.id)
          .maybeSingle();

        setUser({
          username: userData?.username || "Usuario",
          email: userData?.email || data.user.email || "",
        });
      }

      setLoading(false);
    };

    getUser();
  }, []);

  if (loading) {
    return (
      <GradientBackground>
        <View style={styles.center}>
          <Text>Cargando usuario...</Text>
        </View>
      </GradientBackground>
    );
  }

  if (!user) {
    return (
      <GradientBackground>
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
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <View style={styles.view}>
        <View style={styles.center}>
          <Avatar.Text
            size={120}
            label={user.username[0]?.toUpperCase() || "U"}
            style={{ marginTop: 32, marginBottom: 16 }}
          />
          <View style={{ marginBottom: 16 }}>
            <Text variant="headlineMedium" style={{ textAlign: "center" }}>
              {user.username}
            </Text>
            <Text variant="bodyLarge" style={{ textAlign: "center" }}>{user.email}</Text>
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
    </GradientBackground>
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
