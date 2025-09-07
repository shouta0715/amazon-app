import { Stack } from "expo-router";
import { StyledStack } from "@/components/navigation/stack";

function Layout() {
  return (
    <StyledStack headerClassName="bg-dark text-white">
      <Stack.Screen name="index" options={{ title: "" }} />
    </StyledStack>
  );
}

export default Layout;
