import React from "react";
import { Poll } from "../../screens/browsePolls/browsePolls";
import { View, StyleSheet } from "react-native";
import { Card, Divider, Text } from "react-native-paper";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../App";

type props = {
  poll: Poll;
  statusColor: string;
  navigation: NavigationProp<RootStackParamList>;
};

const browsePollsCard = ({ poll, statusColor, navigation }: props) => {
  return (
    <Card
      style={styles.text}
      onPress={() => navigation.navigate("PollInterface")}
    >
      <Card.Title
        title={poll.title}
        titleNumberOfLines={3}
        titleVariant="titleLarge"
        subtitle={"Creado por: " + poll.creator_name}
        subtitleVariant="titleSmall"
        style={styles.title}
        right={() => (
          <View
            style={{
              paddingRight: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              marginVertical: 4,
              flexShrink: 1,
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: statusColor,
                marginRight: 8,
              }}
            />
            <Text variant="titleSmall" style={{ color: statusColor }}>
              {poll.status == "active" ? "Activo" : "Cerrado"}
            </Text>
          </View>
        )}
      />
      <Divider style={styles.text} />
      <Card.Content style={styles.cardContent}>
        <Text variant="bodyMedium">
          Inicio: {new Date(poll.start_time).toLocaleDateString("es")}{" "}
          {new Date(poll.start_time).toLocaleTimeString("es", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        <Text variant="bodyMedium" style={{ marginBottom: 6 }}>
          Fin: {new Date(poll.end_time).toLocaleDateString("es")}{" "}
          {new Date(poll.end_time).toLocaleTimeString("es", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </Card.Content>
    </Card>
  );
};

export default browsePollsCard;

const styles = StyleSheet.create({
  title: {
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    marginBottom: 16,
  },
  input: {
    width: "100%",
  },
  inputHalf: {
    width: "48%",
  },
  cardContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
