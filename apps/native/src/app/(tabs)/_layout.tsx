import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { CustomTabBar } from "@/components/navigation/custom-tab-bar";
import { StyledTabs } from "@/components/navigation/tabs";

function TabsLayout() {
  const router = useRouter();

  return (
    <StyledTabs
      headerClassName="bg-dark"
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="(index)"
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
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/(modal)/rufus");
          },
        }}
        name="rufus"
      />
    </StyledTabs>
  );
}

export default TabsLayout;
