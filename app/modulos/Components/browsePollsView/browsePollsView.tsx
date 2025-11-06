import React from "react";
import { View, StyleSheet } from "react-native";
import { Poll } from "../../screens/browsePolls/browsePolls";
import { Card, Divider, Text } from "react-native-paper";
import BrowsePollsCard from "../browsePollsCard/browsePollsCard";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../App";

type props = {
  polls: Poll[];
  navigation: NavigationProp<RootStackParamList>;
};

const browsePollsView = ({ polls, navigation }: props) => {
  return (
    <View>
      <Divider style={styles.text} />
      {polls.length !== 0 ? (
        polls.map((v) => {
          const isActive = v.status === "active";
          const statusColor = isActive ? "#2196F3" : "#9E9E9E";
          return (
            <BrowsePollsCard
              key={v.id}
              poll={v}
              statusColor={statusColor}
              navigation={navigation}
            />
          );
        })
      ) : (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text variant="titleLarge">No hay encuestas encontradas</Text>
        </View>
      )}
    </View>
  );
};

export default browsePollsView;

const styles = StyleSheet.create({
  title: {
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
