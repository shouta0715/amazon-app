import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";

export function Providers({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();

  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return <ThemeProvider value={theme}>{children}</ThemeProvider>;
}
