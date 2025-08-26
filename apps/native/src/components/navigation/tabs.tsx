import { Tabs } from "expo-router";
import { cssInterop } from "nativewind";
import { ViewStyle } from "react-native";

// https://github.com/karakeep-app/karakeep/blob/300f3c5d0b661c430ad2f6b479b151ec65f14243/apps/mobile/components/navigation/tabs.tsx

type TabsProps = {
  tabBarStyle?: ViewStyle;
  headerStyle?: ViewStyle;
} & React.ComponentProps<typeof Tabs>;

function StyledTabsImpl({ tabBarStyle, headerStyle, ...props }: TabsProps) {
  const screenOptions: TabsProps["screenOptions"] = {
    ...props.screenOptions,
    tabBarStyle,
    headerStyle,
  };

  return <Tabs {...props} screenOptions={screenOptions} />;
}

export const StyledTabs = cssInterop(StyledTabsImpl, {
  tabBarClassName: "tabBarStyle",
  headerClassName: "headerStyle",
});
