import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import rufus from "@/assets/images/rufus.png";

const INDICATOR_PADDING = 20;

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const [tabBarWidth, setTabBarWidth] = useState(0);

  const tabWidth = tabBarWidth / state.routes.length;
  const translateX = useSharedValue(state.index * tabWidth);
  const indicatorWidth =
    tabWidth > 2 * INDICATOR_PADDING
      ? tabWidth - 2 * INDICATOR_PADDING
      : tabWidth;

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    translateX.value = withSpring(state.index * tabWidth + INDICATOR_PADDING, {
      duration: 200,
      dampingRatio: 1,
    });
  }, [state.index, tabWidth, translateX]);

  const handlePress = (key: string, isFocused: boolean, name: string) => {
    const event = navigation.emit({
      type: "tabPress",
      target: key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(name);
    }
  };

  const handleLongPress = (key: string) => {
    navigation.emit({
      type: "tabLongPress",
      target: key,
    });
  };

  return (
    <View
      className="relative flex-row border-t border-gray-200 bg-white"
      onLayout={({ nativeEvent }) => setTabBarWidth(nativeEvent.layout.width)}
    >
      <Animated.View
        className="absolute left-0 top-0 z-10 h-1 w-10 rounded-b-lg bg-dark"
        style={[indicatorStyle, { width: indicatorWidth }]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        return (
          <PlatformPressable
            key={route.key}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            className="pb-safe flex-1 items-center justify-center py-2"
            onLongPress={() => handleLongPress(route.key)}
            onPress={() => handlePress(route.key, isFocused, route.name)}
          >
            {options.tabBarIcon && route.name !== "rufus" ? (
              options.tabBarIcon({
                focused: isFocused,
                color: "black",
                size: 24,
              })
            ) : (
              <Image className="h-12 w-12" source={rufus} />
            )}
          </PlatformPressable>
        );
      })}
    </View>
  );
}
