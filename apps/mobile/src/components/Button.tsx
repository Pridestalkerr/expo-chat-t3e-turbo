import { Pressable, Text } from "react-native";

export const DefaultButton = ({ title }: { title: string }) => {
  return (
    <Pressable
      className="w-full rounded-sm bg-[#000] flex items-center justify-center p-2 my-1"
      onPress={() => {
        return;
      }}
    >
      <Text className="text-1xl font-medium text-[#F7ECDE]">{title}</Text>
    </Pressable>
  );
};
