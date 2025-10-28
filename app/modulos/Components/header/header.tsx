import React, { useState } from "react";
import { Appbar, Divider, Drawer, IconButton, Menu } from "react-native-paper";
import { Text } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

const Header = ({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) => {
  const title = getHeaderTitle(options, route.name);
  const [visible, setVisible] = useState(false);

  const navigate = (route: string): void => {
    navigation.navigate(route);
    closeMenu();
  };

  const openMenu = (): void => setVisible(true);

  const closeMenu = (): void => setVisible(false);

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
          <IconButton icon={"menu"} iconColor="white" onPress={openMenu} />
        }
      >
        {(back && title !== "Home") ?  (
          <>
            <Menu.Item
              onPress={() => navigate("Home")}
              title="Hogar"
              leadingIcon={"home"}
            />
            <Divider />
          </>
        ) : null}
        <Menu.Item
          onPress={() => navigate("Login")}
          title="Log out"
          leadingIcon="logout"
        />
      </Menu>
    </Appbar.Header>
  );
};

export default Header;
