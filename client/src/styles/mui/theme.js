import { rgba } from "emotion-rgba";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const textColorLight = "#222a5c";
const textColorDark = "#fff";

const primaryColor = "#6278E8";

const darkMenuColor = "#1C1A33";

let lightTheme = createTheme({
  palette: {
    mode: "light",
    common: {
      black: "#000",
      white: "#fff",
    },
    background: {
      menu: "#F5FAFA",
      default: "#fff",
      paper: "#E1E5F9",
      contrastText: "#000",
      darkPaper: "#88888888",
      white: "#ffffff",
    },
    divider: "#E9E9E9",
    ring: {
      default: "#d0d0d0",
    },
    drawer: {
      main: "#AAB7FF",
      light: "#AAB7FF",
      dark: "#AAB7FF",
      contrastText: "#000",
    },
    primary: {
      main: primaryColor,
      light: primaryColor,
      dark: primaryColor,
      contrastText: "#fff",
    },
    secondary: {
      main: "#E19E41",
      light: "#E19E41",
      dark: "#E19E41",
      contrastText: "#fff",
    },
    tertiary: {
      main: "#1848C3",
      light: "#1848C3",
      dark: "#1848C3",
      contrastText: "#fff",
    },
    icon: {
      main: "#464366",
      light: "#464366",
      dark: "#fff",
      contrastText: "#fff",
    },
    error: {
      main: "#D80027",
      light: "#D80027",
      dark: "#D80027",
      contrastText: "#fff",
    },
    // ==== SECTION COLOR ====
    section: {
      level1: "#DB8C8C",
      level2: "#A2DA86",
      level3: "#82D0AB",
      level4: "#78B7CE",
      level5: "#8B86D1",
    },
    syllabusColors: ["#8873FC", "#62BFFE", "#5972FD", "#DF549D", "#F1B334"],
    optionColors: ["#74BFF0", "#5EE9C9", "#96E95E", "#D9E95E", "#E9A95E"],
    text: {
      primary: textColorLight,
    },
    success: {
      main: "#4CAF50",
      contrastText: "#fff",
    },
  },

  dashboard: {
    borders: {
      border: `1px solid ${rgba("#22A9E0", 0.25)}`,
      borderRadius: "25px",
      padding: "5px 17px",
    },
  },

  typography: {
    h1: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "2.125rem", // 34px
      fontWeight: 700,
    },
    h2: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "1.875rem", // 30px
      fontWeight: 700,
    },
    h3: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "1.5rem", // 24px
      fontWeight: 700,
    },
    h4: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "1.25rem", // 20px
      fontWeight: 500,
    },
    h5: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "1.125rem", // 18px
      fontWeight: 500,
    },
    h6: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "1rem", // 16px
      fontWeight: 500,
    },
    subtitle1: {
      fontFamily: "'Nunito Sans', sans-serif",
      fontSize: "1rem", // 16px
    },
    subtitle2: {
      fontFamily: "'Nunito Sans', sans-serif",
    },
    body1: {
      fontFamily: "'Nunito Sans', sans-serif !important",
    },
    body2: {
      fontFamily: "'Nunito Sans', sans-serif !important",
    },
    button: {
      fontFamily: "'Nunito Sans', sans-serif",
    },
    caption: {
      fontFamily: "'Nunito Sans', sans-serif",
    },
    overline: {
      fontFamily: "'Nunito Sans', sans-serif",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          transition: "all 1s linear",
          WebkitFontSmoothing: "auto",
        },
      },
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
          backgroundColor: "#F5FAFA",
        },
      },
    },
    // MuiMenu: {
    //   styleOverrides: {
    //     paper: {
    //       backgroundColor: "#F5FAFA",
    //       padding: "8px 0",
    //       borderRadius: "26px",
    //       marginTop: "8px",
    //     },
    //   },
    // },
  },
});

let darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#282828",
      menu: "#3f3f3f",
      contrastText: "#fff",
      darkPaper: "#575757",
      active: "#464366",
    },
    ring: {
      default: "#fff",
    },
    drawer: {
      main: "#7786eb",
      light: "#AAB7FF",
      dark: "#AAB7FF",
      contrastText: "#fff",
    },
    // divider: "#1C1B1C",
    common: {
      black: "#000",
      white: "#fff",
    },
    primary: {
      main: primaryColor,
      light: primaryColor,
      dark: primaryColor,
      contrastText: "#fff",
    },
    secondary: {
      main: "#E19E41",
      light: "#E19E41",
      dark: "#E19E41",
      contrastText: "#fff",
    },
    tertiary: {
      main: "#1848C3",
      light: "#1848C3",
      dark: "#1848C3",
      contrastText: "#fff",
    },
    icon: {
      main: "#464366",
      light: "#464366",
      dark: "#fff",
      contrastText: "#fff",
    },

    //   highlight: {
    //     main: highlightColor,
    //     light: highlightColor,
    //     dark: highlightColor,
    //     contrastText: "#fff",
    //   },
    error: {
      main: "#D80027",
      light: "#D80027",
      dark: "#D80027",
      contrastText: "#fff",
    },
    // ==== CARD COLOR ====
    //   chart: {
    //     violet: ["#826AF9", "#9E86FF", "#D0AEFF", "#F7D2FF"],
    //     blue: ["#2D99FF", "#83CFFF", "#A5F3FF", "#CCFAFF"],
    //     green: ["#2CD9C5", "#60F1C8", "#A4F7CC", "#C0F2DC"],
    //     yellow: ["#FFE700", "#FFEF5A", "#FFF7AE", "#FFF3D6"],
    //     red: ["#FF6C40", "#FF8F6D", "#FFBD98", "#FFF2D4"],
    //   },

    // ==== SECTION COLOR ====
    section: {
      level1: "#281919",
      level2: "#1E2819",
      level3: "#192821",
      level4: "#192428",
      level5: "#1A1928",
    },
    syllabusColors: ["#8873FC", "#62BFFE", "#5972FD", "#DF549D", "#F1B334"],
    optionColors: [
      "#2CACFF88",
      "#31FFD088",
      "#83FF3088",
      "#6E28FD88",
      "#FF9F2E88",
    ],
    text: {
      // primary: "#fff",
    },
  },
  dashboard: {
    borders: {
      border: `1px solid ${rgba("#22A9E0", 0.25)}`,
      borderRadius: "25px",
      padding: "5px 17px",
    },
  },
  typography: {
    h1: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "2.125rem", // 34px
      fontWeight: 700,
      color: textColorDark,
      // fontSize: 64,
    },
    h2: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "1.875rem", // 30px
      fontWeight: 700,
      color: textColorDark,
    },
    h3: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "1.5rem", // 24px
      fontWeight: 700,
      color: textColorDark,
    },
    h4: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "1.25rem", // 20px
      fontWeight: 500,
      color: textColorDark,
    },
    h5: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "1.125rem", // 18px
      fontWeight: 500,
      color: textColorDark,
    },
    h6: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "1rem", // 16px
      fontWeight: 500,
      color: textColorDark,
    },
    title: {
      fontFamily: "'Poppins', sans-serif",
    },
    subtitle1: {
      fontFamily: "'Nunito Sans', sans-serif",
      fontSize: "1rem", // 16px
      color: rgba(textColorDark, 0.5),
    },
    subtitle2: {
      fontFamily: "'Nunito Sans', sans-serif",
      fontSize: "0.875rem", // 14px
      color: "#464366",
    },
    body1: {
      fontFamily: "'Nunito Sans', sans-serif !important",
      fontSize: "1rem", // 16px
      color: rgba(textColorDark, 1),
    },
    body2: {
      fontFamily: "'Nunito Sans', sans-serif !important",
      fontSize: "0.875rem", // 14px
      // color: textColorLight,
    },
    button: {
      fontFamily: "'Nunito Sans', sans-serif",
    },
    caption: {
      fontFamily: "'Nunito Sans', sans-serif",
      fontSize: "0.75rem", // 12px
      color: rgba(textColorDark, 0.5),
    },
    overline: {
      fontFamily: "'Nunito Sans', sans-serif",
      fontSize: "0.625rem", // 10px
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          transition: "all 1s linear",
          WebkitFontSmoothing: "auto",
        },
      },
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    // MuiDialog: {
    //   styleOverrides: {
    //     paper: {
    //       backgroundImage: "none",
    //       backgroundColor: darkMenuColor,
    //     },
    //   },
    // },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: darkMenuColor,
          padding: "8px 12px",
          borderRadius: "26px",
          marginTop: "8px",
        },
      },
    },
  },
});

lightTheme = responsiveFontSizes(lightTheme);
darkTheme = responsiveFontSizes(darkTheme);

module.exports = { lightTheme, darkTheme };
