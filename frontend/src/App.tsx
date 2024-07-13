import React from "react";
import { BrowserRouter } from "react-router-dom";
import { RoutedContent } from "./routes";
import { AppLayoutWrapper } from "./components";
import { ThemeProvider } from "@mui/material";
import { theme } from "./utils";

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
