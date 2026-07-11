import { defineComputeConfig } from "@prisma/compute-sdk/config";

export default defineComputeConfig({
  app: {
    name: "krishimitra",
    framework: "nextjs",
    env: ".env",
  },
});
