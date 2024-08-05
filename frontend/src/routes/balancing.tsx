// The old /characters page, that discusses balancing of units.
import React from "react";
import { Box, Typography } from "@mui/material";
import { CharacterSelector } from "../components";
import { BOSSES, CHARACTERS } from "@genshin-ranked/shared";
import { CharacterDetail } from "@genshin-ranked/shared/src/types/characters/details";


export const Balancing = () => {
	// const [selectedButton, setSelectedButton] = useState(null);
	const selectedButton = false;

	// const handleButtonClick = (button) => {
	// 	setSelectedButton(button);
	// };
	const [selection, setSelection] = React.useState("None");

	const updateSelection = (info: CharacterDetail) => {
		setSelection(info.displayName);
	}

	return (
		<Box sx={{ display: "flex"}} id="balancing-page-parent-box">
			{/* Left Side: Button Grid */}
			<Box
				sx={{
					borderRight: "1px solid #ccc",
				}}
				id="character-selector-container"
			>
				<CharacterSelector select={updateSelection} />
			</Box>
			{/* Right Side: Button Details */}
			<Box sx={{ padding: 2 , width: "500px"}}>
				{selectedButton ? (
					<Typography variant="h6"></Typography>
				) : (
					<Typography variant="h6">
						{`Selected: ${selection}`}
					</Typography>
				)}
			</Box>
		</Box>
	);
};
