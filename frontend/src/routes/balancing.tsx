/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
// The old /characters page, that discusses balancing of units.
import React, { Fragment } from "react";
import { Box, Button, Typography } from "@mui/material";
import { CharacterSelector } from "../components";
import {socket} from "../../../src/contexts/PlayingContext.js"
import './balancing.css';
import { useCookies } from "react-cookie";
// import Avatar from "@mui/material/Avatar";
// import styled from "@emotion/styled";

// update some names to keep them consistent

interface balance {
	team: number; 
	phase: string;
	pickSelection: (teamNum: number, selectedObj: {id: number}, timeout: boolean) => void;
	sendHover: (teamNum: number, selected: number) => void;
	inGame: boolean;
	bonusInfo: string[];
	selections: number[]
}

export const Balancing = ({team, phase, pickSelection, sendHover, inGame, bonusInfo, selections}: balance) => {
	const [selection, setSelection] = React.useState<string>("None");
	const [cookieInfo] = useCookies(["player"]);
	let matching = true;
	if (cookieInfo.player != undefined && cookieInfo.player.substring(0, 1) != team) {
		matching = false;
	}
	const info = sessionStorage.getItem("game");
	let newInfo: number;
	let currentResult: string = "";
	if (info != null && info != undefined && info != "") {
		let infoParse = JSON.parse(info);
		newInfo = infoParse.turn;
		currentResult = infoParse.result;
	} else {
		newInfo = 0;
	}
	const sendToSocket = () => {
		// find the corresponding id of the character with this display name
		// loop on the character information
		let selectionInfo = {
			type: phase.toLowerCase(),
			id: -1,
		};
		if(team == -1){
			return;
		}
		if (socket.readyState == 1) {
			let chosenValue: number = -1;
			if (localStorage.getItem("character") == null) {
				chosenValue = -1;
				alert("Please select a character!");
				return;
			} else {
				chosenValue = parseInt(localStorage.getItem("character")!);
			}
			selectionInfo.id = chosenValue;
			pickSelection(team, selectionInfo, false);
			/*
			socket.send(
				JSON.stringify({
					// force websocket to determine if current status is ban or pick, handle accordingly
					type: "character",
					id: id,
					charId: chosenValue,
					team: team,
				}),
			);
			*/
		}
	};
	
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
					team={team}
					updateCharacter={setSelection}
					selectedChars={selections}
					updateHover={sendHover}
				/>
			</Box>
			{/* Right Side: Button Details */}
			<Box sx={{ padding: 2, width: "500px" }}>
				{
					<React.Fragment>
						<Typography
							color={"white"}
							textTransform="none"
							variant="h6"
						>
							{`currently selected: ${selection}`}
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
										!matching))
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
									: `Show Restrictions`}
							</Typography>
						</Button>
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
					</React.Fragment>
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
