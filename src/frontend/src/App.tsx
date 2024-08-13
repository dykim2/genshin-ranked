import React from "react";
import { BrowserRouter } from "react-router-dom";
import { RoutedContent } from "./routes";
import { AppLayoutWrapper } from "./components";
import { ThemeProvider } from "@mui/material";
import { theme } from "./utils";

// https://mui.com/material-ui/getting-started/installation/#roboto-font
import "@fontsource/roboto-mono/300.css";
import "@fontsource/roboto-mono/400.css";
import "@fontsource/roboto-mono/500.css";
import "@fontsource/roboto-mono/700.css";

function App() {
	return (
		<BrowserRouter basename="/">
			<ThemeProvider theme={theme}>
				<AppLayoutWrapper>
					<RoutedContent />
				</AppLayoutWrapper>
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
