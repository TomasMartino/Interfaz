import React, { useRef, useState, useEffect } from "react";
import { pollsStart } from "./data";
import { View, StyleSheet, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { Button, FAB, Searchbar, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import GradientBackground from "../../Components/gradientBackground/gradientBackground";
import BrowsePollsView from "../../Components/browsePollsView/browsePollsView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../../../backend/server/supabase";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "BrowsePoll"
>;

export type Poll = {
  id: number;
  title: string;
  start_time: Date;
  end_time: Date;
  status: "active" | "closed";
  profiles: {
    id: string;
    username: string;
    email: string;
  };
};

const BrowsePollsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [search, setSearch] = useState<string>("");
  const [username, setUsername] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const getUsername = async () => {
      const savedUsername = await AsyncStorage.getItem("username");
      if (savedUsername) {
        setUsername(savedUsername);
        console.log("Usuario actual:", savedUsername);
      } else {
        console.warn("No se encontró el username en memoria");
      }
    };
    getUsername();
    changeSearch();
  }, []);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const changeSearch = async () => {
    if (search === "") {
      try {
        const { data: pollsData, error: pollsError } = await supabase
          .from("poll")
          .select("id, title, start_time, end_time, status, profiles(username, id)")

        if (pollsError) {
          console.error("Error obteniendo encuestas:", pollsError.message);
        } else {
          console.log(pollsData);
          setPolls(pollsData || []);
        }
      } catch (err) {
        console.log(err);
      }
    }

    const text = search.toLowerCase();

    try {
      const { data: pollsData, error: pollsError } = await supabase
        .from("poll")
        .select("id, title, start_time, end_time, status, profiles(username, id)")
        .ilike("title", `%${text}%`)

      if (pollsError) {
        console.error("Error obteniendo encuestas:", pollsError.message);
      } else {
        setPolls(pollsData || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <GradientBackground>
      <View style={styles.form}>
        <ScrollView
          contentContainerStyle={styles.container}
          style={{ flex: 1 }}
          ref={scrollRef}
        >
          <Text variant="displayMedium" style={styles.title}>
            Explorar Encuestas
          </Text>

          {username && (
            <Text variant="bodyLarge" style={{ marginBottom: 8 }}>
              👋 Bienvenido,{" "}
              <Text style={{ fontWeight: "bold" }}>{username}</Text>
            </Text>
          )}

          <Searchbar
            placeholder="Busca encuesta por tema..."
            onChangeText={setSearch}
            value={search}
            onIconPress={changeSearch}
            style={styles.text}
          />

          <BrowsePollsView polls={polls} navigation={navigation} />
        </ScrollView>

        <FAB
          icon="plus"
          label="Crear nueva encuesta"
          mode="elevated"
          style={{
            position: "absolute",
            right: 16,
            bottom: 16,
          }}
          onPress={() => navigation.navigate("CreatePoll")}
        />
      </View>
    </GradientBackground>
  );
};

export default BrowsePollsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 75,
  },
  form: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
    alignItems: "stretch",
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    marginBottom: 16,
  },
});
