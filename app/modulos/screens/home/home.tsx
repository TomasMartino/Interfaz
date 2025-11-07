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
import AsyncStorage from "@react-native-async-storage/async-storage";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

type User = {
  id?: string;
  username: string;
  email: string;
};

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<User | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserFromMemory = async () => {
      try {
        setLoading(true);

        // 🔹 Recuperar email y username de memoria
        const email = await AsyncStorage.getItem("userEmail");
        const username = await AsyncStorage.getItem("username");

        if (!email || !username) {
          console.warn("Faltan datos del usuario en memoria. Redirigiendo al login...");
          setLoading(false);
          navigation.navigate("Login");
          return;
        }

        
        const { data: userData, error } = await supabase
          .from("user_ids")
          .select("id")
          .eq("email", email)
          .maybeSingle();

        if (error) console.error("Error buscando ID:", error.message);

        const fullUser: User = {
          id: userData?.id,
          username,
          email,
        };

        setUser(fullUser);

        // 🔹 Traer encuestas del usuario (si tiene ID)
        if (userData?.id) {
          const { data: pollsData, error: pollsError } = await supabase
            .from("poll")
            .select("*")
            .eq("creator_id_new", userData.id);

          if (pollsError) {
            console.error("Error obteniendo encuestas:", pollsError.message);
          } else {
            setPolls(pollsData || []);
          }
        }
      } catch (err) {
        console.error("Error general:", err);
      } finally {
        setLoading(false);
      }
    };

    getUserFromMemory();
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


  return (
    <GradientBackground>
      <View style={styles.view}>
        <View style={styles.center}>
          <Avatar.Text
            size={120}
            label={user?.username[0]?.toUpperCase() || "U"}
            style={{ marginTop: 32, marginBottom: 16 }}
          />
          <View style={{ marginBottom: 16 }}>
            <Text variant="headlineMedium" style={{ textAlign: "center" }}>
              {user?.username}
            </Text>
            <Text variant="bodyLarge" style={{ textAlign: "center" }}>
              {user?.email}
            </Text>
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
            await AsyncStorage.multiRemove(["userEmail", "username"]);
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
