import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SUGGESTED_PHRASES = [
  "What do I need a shaker for?",
  "What are the best gifts for my best friends?",
  "What are the best sustainable shoes?",
];

const Rufus = () => (
  <ScrollView
    className="pb-safe mb-10 flex-1 bg-white"
    contentContainerClassName="pb-12"
  >
    <View className="flex-1 items-center justify-center p-4">
      <Text className="mb-6 text-center text-lg font-semibold">
        What do you need help with today?
      </Text>
      {/* Suggested phrases */}
      <View className="px-4 pb-2">
        <View className="mb-2 flex-row flex-wrap justify-center gap-2">
          {SUGGESTED_PHRASES.map((phrase, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.7}
              className="mb-2 rounded-full bg-blue-100 px-3 py-2"
            >
              <Text className="text-sm font-medium text-blue-700">
                {phrase}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>

    <View className="px-4 pb-6">
      <View className="flex-row items-center rounded-full bg-gray-100 px-4 py-2 shadow-md">
        <TextInput
          className="min-h-10 flex-1 text-base"
          placeholder="Ask Rufus a question"
          placeholderTextColor="#888"
        />

        <TouchableOpacity className="ml-2">
          <Ionicons color="#2563eb" name="mic-outline" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  </ScrollView>
);

export default Rufus;
