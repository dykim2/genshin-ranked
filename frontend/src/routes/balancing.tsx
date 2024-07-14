// The old /characters page, that discusses balancing of units.
import React from "react";
import { Box, Typography } from "@mui/material";
import { CharacterSelector } from "../components";

export const Balancing = () => {
	// const [selectedButton, setSelectedButton] = useState(null);
	const selectedButton = false;

	// const handleButtonClick = (button) => {
	// 	setSelectedButton(button);
	// };

	return (
		<Box sx={{ display: "flex", height: "100vh" }}>
			{/* Left Side: Button Grid */}
			<Box
				sx={{
					overflowY: "auto",
					borderRight: "1px solid #ccc",
					width: "33%",
				}}
			>
				<CharacterSelector />
			</Box>

			{/* Right Side: Button Details */}
			<Box sx={{ padding: 2 }}>
				{selectedButton ? (
					<Typography variant="h6"></Typography>
				) : (
					<Typography variant="h6">
						Select a button to see details
					</Typography>
				)}
			</Box>
		</Box>
	);
};
