import React, { useState } from "react";
import { Appbar, Divider, IconButton, Menu } from "react-native-paper";
import { Text } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";

const Header = ({ navigation, route, options, back }: any) => {
  const title = getHeaderTitle(options, route.name);
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <Appbar.Header
      style={{ backgroundColor: "black", justifyContent: "center" }}
    >
      {back && title !== "Home" ? (
        <Appbar.BackAction onPress={navigation.goBack} />
      ) : null}

      <Appbar.Content title={<Text variant="displayMedium">VoxPopuli</Text>} />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            icon={visible ? "menu-close" : "menu"}
            iconColor="white"
            onPress={openMenu}
          />
        }
      >
        {back ? (
          <Menu.Item
            onPress={() => navigation.navigate("home")}
            title="Item 1"
          />
        ) : null}
        <Menu.Item onPress={() => {}} title="Item 2" />
        <Divider />
        <Menu.Item
          onPress={() => {
            closeMenu();
            navigation.navigate("Login");
          }}
          title="Log out"
        />
      </Menu>
    </Appbar.Header>
  );
};

export default Header;
