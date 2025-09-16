/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
// The old /characters page, that discusses balancing of units.
import React, {Fragment} from "react";
import {Box, Typography} from "@mui/material";
import {CharacterSelector} from "../components";
import './balancing.css';
// import Avatar from "@mui/material/Avatar";
// import styled from "@emotion/styled";

// update some names to keep them consistent

interface balance {
	team: number; 
	phase: string;
	sendHover: (teamNum: number, selected: number) => void;
	inGame: boolean;
	bonusInfo: string[];
}

export const Balancing = ({team, phase, sendHover, inGame, bonusInfo}: balance) => {
	const [selection, setSelection] = React.useState<string>("None");
	return (
		<Box sx={{ display: "flex" }} id="balancing-page-parent-box">
			{/* Left Side: Button Grid */}
			<Box
				sx={{
					borderRight: !inGame ? "0px solid #ccc" : undefined,
				}}
				id="character-selector-container"
			>
				<CharacterSelector
					inGame={inGame}
					team={team}
					updateCharacter={setSelection}
					updateHover={sendHover}
					phase={phase}
				/>
			</Box>
			{/* Right Side: Button Details - adjust box size */}
			{
				!inGame ?
				<Box sx={{ padding: 2, width: "500px" }}>
					<Fragment>
						<Typography
							color={"white"}
							textTransform="none"
							variant="h6"
						>
							{`currently selected:\n ${selection}`}
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
						{/*
						 <Button
							variant="contained"
							onClick={() => {
								sendToSocket();
							}}
							disabled={
								team != newInfo ||
								(inGame &&
									((phase.toLowerCase() != `ban` &&
										phase.toLowerCase() != `pick` &&
										phase.toLowerCase() != "extraban") ||
										!matching)) ||
								!active
							}
						>
							<Typography
								color={"yellow"}
								textTransform="none"
								variant="h6"
							>
								{inGame
									? `confirm ${
											phase.toLowerCase() == "extraban"
												? "extra ban"
												: phase.toLowerCase() == "ban"
												? `ban`
												: phase.toLowerCase() == `pick`
												? `pick`
												: `Nothing`
									  }`
									: `click char for restrictions`}
							</Typography>
							</Button>
						*/}

						{bonusInfo.map((val: string) => {
							return (
								<Fragment key={val}>
									<Typography
										color={"white"}
										textTransform="none"
										variant="h6"
									>
										{val}
									</Typography>
									<br />
								</Fragment>
							);
						})}
					</Fragment>
				
				</Box> : undefined
			}
			
		</Box>
	);
};

// const TestImage = styled("img")({
// 	width: 25,
// 	height: 25,
// 	opacity: 0.5
// });
