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
		<Box sx={{ display: "flex"}} id="balancing-page-parent-box">
			{/* Left Side: Button Grid */}
			<Box
				sx={{
					borderRight: "1px solid #ccc",
				}}
				id="character-selector-container"
			>
				<CharacterSelector />
			</Box>
			{/* Avoid setting width of character selector but adding content to button details instead */}
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
