import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.igseek",
  appName: "IGseek",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: "#0a0000",
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0a0000",
    },
  },
};

export default config;
