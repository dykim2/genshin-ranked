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
	const [selection, setSelection] = React.useState<string>("None");
	return (
		<Box sx={{ display: "flex" }} id="balancing-page-parent-box">
			{/* Left Side: Button Grid */}
			<Box
				sx={{
					borderRight: "1px solid #ccc",
				}}
				id="character-selector-container"
			>
				<CharacterSelector
					characterName={selection}
					updateCharacter={setSelection}
				/>
			</Box>
			{/* Right Side: Button Details */}
			<Box sx={{ padding: 2, width: "500px" }}>
				{
					<Typography color={"white"} variant="h6">
						{`Currently selected: ${selection}`}
						{/*
							<Box
								sx={{
									position: "relative",
									display: "flex",
									alignItems: "center",
									width: "250px",
									height: "80px",
									overflow: "hidden",
								}}
							>
								<Box
									sx={{
										position: "absolute",
										top: "0px",
										left: "0px",
										width: "15px",
										height: "100px",
										background: "rgba(198,144,80,255)",
									}}
								></Box>
								<Typography
									variant="h6"
									sx={{
										paddingLeft: "15px",
										position: "absolute",
										width: "150px",
										color: "#FFFFFF",
										textAlign: "center",
										fontStyle: "italic",
									}}>
									Raiden Shogun
								</Typography>
								<img
									src="images\assets\flowing effect.gif"
									alt=""
									className="flowing-effect"
								/>
								<img
									src="\images\assets\loading border.gif"
									alt=""
									className="loading-border"
								/>
								<Avatar
									alt=""
									src="\images\chars\Furina.png"
									sx={{
										position: "absolute",
										right: "25px",
										width: "60px",
										height: "60px",
										background: FIVE_STAR_GRADIENT,
									}}
								/>
							</Box>
						*/}
					</Typography>
				}
			</Box>
		</Box>
	);
};

// const TestImage = styled("img")({
// 	width: 25,
// 	height: 25,
// 	opacity: 0.5
// });
