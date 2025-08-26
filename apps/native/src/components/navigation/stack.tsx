import { Stack } from "expo-router/stack";
import { cssInterop } from "nativewind";
import { TextStyle, ViewStyle } from "react-native";

// https://github.com/karakeep-app/karakeep/blob/300f3c5d0b661c430ad2f6b479b151ec65f14243/apps/mobile/components/navigation/stack.tsx
type StackProps = {
  contentStyle?: ViewStyle;
  headerStyle?: TextStyle;
} & React.ComponentProps<typeof Stack>;

function StackImpl({ contentStyle, headerStyle, ...props }: StackProps) {
  const screenOptions = {
    ...props.screenOptions,
    contentStyle,
    headerStyle: {
      backgroundColor: headerStyle?.backgroundColor?.toString(),
    },
    navigationBarColor: contentStyle?.backgroundColor?.toString(),
    headerTintColor: headerStyle?.color?.toString(),
  };

  return <Stack {...props} screenOptions={screenOptions} />;
}

// Changing this requires reloading the app
export const StyledStack = cssInterop(StackImpl, {
  contentClassName: "contentStyle",
  headerClassName: "headerStyle",
});
