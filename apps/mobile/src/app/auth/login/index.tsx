import { Stack, router } from "expo-router";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/trpc";

import { useToken } from "~/app/_layout";

export const signInSchema = z.object({
  username: z.string().min(6),
  password: z.string().min(8),
});

const Login = () => {
  const { token, setToken } = useToken();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { data, refetch } = api.user.sayHello.useQuery({
    name: watch("username"),
  });

  const loginMutation = api.auth.login.useMutation({
    onSuccess: (data) => {
      setToken(data.token);
      // router.push("/dashboard");
    },
  });

  return (
    <SafeAreaView className="bg-[#F7ECDE]">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Login", headerTintColor: "#F7ECDE" }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="h-full w-full p-4 flex items-center justify-around">
          <View className="w-full flex items-center">
            <Text className="text-[#774360] text-6xl py-8">chattr</Text>
            <Text className="text-3xl font-semibold text-[black]">
              Welcome back!
            </Text>
            <Text className="text-1xl font-semibold text-[black] py-2">
              You can login below
            </Text>
          </View>

          <View className="w-full flex items-center justify-around">
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="mb-2 rounded bg-black p-2 text-[#F7ECDE] w-full"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  placeholder="username"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  autoComplete="username"
                  autoCorrect={false}
                />
              )}
              name="username"
            />
            {errors.username && <Text>{errors.username}</Text>}
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="mb-2 rounded bg-black p-2 text-[#F7ECDE] w-full"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  placeholder="password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect={false}
                  secureTextEntry
                />
              )}
              name="password"
            />
          </View>

          {/* <View className="bg-black rounded-full w-48 h-48 flex items-center justify-center"> */}
          <Pressable
            className="w-full rounded-sm bg-[#774360] flex items-center justify-center p-2 my-1"
            onPress={handleSubmit((data) => {
              loginMutation.mutate(data);
            })}
            disabled={loginMutation.isLoading}
          >
            <Text className="text-2xl font-bold text-[#F7ECDE]">LOGIN</Text>
          </Pressable>
          {loginMutation.error && (
            <Text className="text-2xl font-bold text-[#ff0000]">
              Something went wrong... {loginMutation.error.message}
            </Text>
          )}
          <Text className="text-2xl font-bold text-[#000]">
            {loginMutation.data?.token}
          </Text>
          {/* </View> */}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
