import React from "react";
import {
	AppBar,
	Box,
	Button,
	Container,
	Toolbar,
	Typography,
} from "@mui/material";
import StarsIcon from "@mui/icons-material/Stars";
import { pages } from "../../routes";
import { useNavigate } from "react-router-dom";

export const MuiNavbar = () => {
	const navigate = useNavigate();

	// Based off of: https://mui.com/material-ui/react-app-bar/#app-bar-with-responsive-menu
	// TODO: Address certain style exceptions called here.
	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<StarsIcon
						sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
					/>
					<Typography
						variant="h6"
						noWrap
						component="a"
						// TODO: This should be using navigate("/") instead of href.
						href="/"
						sx={{
							mr: 2,
							display: { xs: "none", md: "flex" },
							fontFamily: "monospace",
							fontWeight: 700,
							letterSpacing: ".3rem",
							color: "inherit",
							textDecoration: "none",
						}}
					>
						RANKED
					</Typography>

					<Box
						sx={{
							flexGrow: 1,
							display: { xs: "none", md: "flex" },
						}}
					>
						{pages.map((page) => (
							<Button
								key={page.name}
								onClick={() => {
									navigate(page.path);
								}}
								sx={{
									color: "white",
									display: "block",
									height: "100%",
								}}
							>
								{page.name}
							</Button>
						))}
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};
