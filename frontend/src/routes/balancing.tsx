/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
// The old /characters page, that discusses balancing of units.
import React from "react";
import { Box, Typography } from "@mui/material";
import { CharacterSelector } from "../components";
import './balancing.css';
import Avatar from "@mui/material/Avatar";
import { FIVE_STAR_GRADIENT } from "../components/CharacterPicker/CharacterPicture";
import styled from "@emotion/styled";

export const Balancing = () => {
	// const [selectedButton, setSelectedButton] = useState(null);
	const selectedButton = false;

	// const handleButtonClick = (button) => {
	// 	setSelectedButton(button);
	// };

	return (
		<Box sx={{ display: "flex" }} id="balancing-page-parent-box">
			{/* Left Side: Button Grid */}
			<Box
				sx={{
					borderRight: "1px solid #ccc",
				}}
				id="character-selector-container"
			>
				<CharacterSelector />
			</Box>
			{/* Right Side: Button Details */}
			<Box sx={{ padding: 2, width: "500px" }}>
				{selectedButton ? (
					<Typography variant="h6"></Typography>
				) : (
					<Typography variant="h6">
						Select a button to see details
						<Box
							sx={{
								position: "relative",
								display: "flex",
								alignItems: "center",
								width: "250px", height: "100px",
								overflow: "hidden",
							}}
						>
							<img
								src="images\assets\flowing effect.gif"
								alt=""
								style={{
									width: "150%",
									position: "absolute",
									left: "-25%",
								}}
							/>
							<img
								src="\images\assets\loading border.gif"
								alt=""
								style={{
									right: "33.75px",
									position: "absolute",
									width: "73px",
									height: "73px",
								}}
							/>
							<Avatar
								alt=""
								src="\images\chars\Albedo.png"
								sx={{
									position: "absolute",
									right: "40px",
									width: "60px",
									height: "60px",
									background: FIVE_STAR_GRADIENT,
								}}
							/>
						</Box>
					</Typography>
				)}
			</Box>
		</Box>
	);
};

// const TestImage = styled("img")({
// 	width: 25,
// 	height: 25,
// 	opacity: 0.5
// });
