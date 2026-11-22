import { Stack } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

export default function AppLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    />
  );
}
