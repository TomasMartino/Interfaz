import React, { useRef, useState, useEffect } from "react";
import { pollsStart } from "./data";
import { View, StyleSheet, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import {
  Button,
  FAB,
  Searchbar,
  Text,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import GradientBackground from "../../Components/gradientBackground/gradientBackground";
import BrowsePollsView from "../../Components/browsePollsView/browsePollsView";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  creator_name: string;
  creator_id: number;
};

const BrowsePollsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [polls, setPolls] = useState<Poll[]>(pollsStart);
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
  }, []);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const changeSearch = (): void => {
    let newPolls = pollsStart;

    if (search === "") {
      setPolls(newPolls);
      return;
    }

    const text = search.toLowerCase();

    newPolls = newPolls.filter((v) => {
      return (
        v.title.toLowerCase().includes(text) ||
        v.creator_name.toLowerCase().includes(text)
      );
    });

    setPolls(newPolls);
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
              👋 Bienvenido, <Text style={{ fontWeight: "bold" }}>{username}</Text>
            </Text>
          )}

          <Searchbar
            placeholder="Busca encuesta por tema, creador..."
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
