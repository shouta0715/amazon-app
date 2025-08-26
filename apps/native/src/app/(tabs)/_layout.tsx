import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyledTabs } from "@/components/navigation/tabs";

function TabsLayout() {
  return (
    <StyledTabs headerClassName="bg-dark">
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,

          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="home-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="person-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="cart-outline" size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="menu-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="rufus"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="paw-outline" size={size} />
          ),
        }}
      />
    </StyledTabs>
  );
}

export default TabsLayout;
