import { createTheme } from "@mui/material/styles";
import { green } from "@mui/material/colors";

export const theme = createTheme({
	typography: {
		fontFamily: "Roboto Mono, monospace",
	},
	palette: {
		primary: {
			main: "#242424",
		},
		secondary: {
			main: green[500],
		},
		text: {
            primary: "#ffffff", // Global text color
            // secondary: "#cccccc", // Optional: Secondary text color
            // disabled: "#999999", // Optional: Disabled text color
        },
	},
});
