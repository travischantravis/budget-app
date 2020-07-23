import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Screens
import DayScreen from "./screens/DayScreen";
import WeekScreen from "./screens/WeekScreen";
import ItemScreen from "./screens/ItemScreen";
import YearScreen from "./screens/YearScreen";

const HomeStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator initialRouteName="Year">
      <HomeStack.Screen
        name="Year"
        component={YearScreen}
        options={{ title: "Home" }}
      />
      <HomeStack.Screen name="Week" component={WeekScreen} />
      <HomeStack.Screen name="Day" component={DayScreen} />
      <HomeStack.Screen name="Item" component={ItemScreen} />
    </HomeStack.Navigator>
  );
};

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={HomeStackScreen} />
          {/* <Drawer.Screen name="Item" component={ItemScreen} /> */}
        </Drawer.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
  },
});
