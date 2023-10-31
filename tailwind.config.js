export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "mine-shaft": {
          100: "rgba(31, 31, 31, 1)",
          80: "rgba(31, 31, 31, 0.8)",
          70: "rgba(31, 31, 31, 0.7)",
          60: "rgba(31, 31, 31, 0.6)",
          50: "rgba(31, 31, 31, 0.5)",
          20: "rgba(31, 31, 31, 0.2)",
          10: "rgba(31, 31, 31, 0.1)",
        },
      },
    },
  },
  plugins: [],
};
