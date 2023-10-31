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
        cararra: {
          DEFAULT: "#eaeae7",
          90: "rgba(234, 234, 231, 0.9)",
          80: "rgba(234, 234, 231, 0.8)",
        },
        reef: {
          100: "#c3ffbe",
          90: "rgba(195, 255, 190, 0.9)",
          80: "rgba(195, 255, 190, 0.8)",
          70: "rgba(195, 255, 190, 0.7)",
        },
      },
    },
  },
  plugins: [],
};
