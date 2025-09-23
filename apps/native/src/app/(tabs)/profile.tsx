import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

function Page() {
  return (
    <View className="flex-1">
      <SignedOut>
        <View className="items-center px-8 pt-10">
          <Text className="text-2xl font-bold">Welcome to Amazon</Text>
          <Text className="text-sm text-gray-500">
            Please sign in to continue
          </Text>
        </View>
        <View className="mt-8 w-full px-8">
          <Link asChild href="/sign-in">
            <TouchableOpacity className="flex-row items-center justify-center rounded-full bg-yellow-400 px-6 py-3 shadow-lg active:opacity-80">
              <Text className="text-lg font-bold tracking-wide text-black">
                サインイン
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SignedOut>

      <SignedIn>
        <View className="flex-1 items-center justify-center">
          <Text className="text-2xl font-bold">Welcome to Amazon</Text>
        </View>
      </SignedIn>
    </View>
  );
}

export default Page;
