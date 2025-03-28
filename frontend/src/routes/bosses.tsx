// for displaying bosses
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { BossSelector } from "../components";
import { socket } from "../../../src/contexts/PlayingContext";
import {useCookies} from "react-cookie";

interface balance {
	id: number; // game ID - useful but likely not needed
	team: number;
	pickSelection: ( teamNum: number, selectedObj: object, timeout: boolean ) => void;
	sendHover: (teamNum: number, selected: number) => void;
	inGame: boolean;
	selections: number[];
	bonusInfo: string[];
}

export const BossDisplay = ({id, team, pickSelection, sendHover, inGame, selections, bonusInfo}: balance) => {
	const [cookieInfo] = useCookies(["player"]);
	const [selection, setSelection] = React.useState<string>("None");
	// get player turn from storage, verify it
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
			type: "boss",
			id: -1,
		};
		if(team == -1){
			return;
		}
		if (socket.readyState == 1) {
			let chosenValue: number = -1;
			if (localStorage.getItem("boss") == null) {
				chosenValue = -1;
				alert("Please choose a boss!");
				return;
			} else {
				chosenValue = parseInt(localStorage.getItem("boss")!);
			}
			// transition to using the existing selection method, to keep things clean
			selectionInfo.id = chosenValue;
			pickSelection(team, selectionInfo, false);
			/*
			socket.send(
				JSON.stringify({
					// force websocket to determine if current status is ban or pick, handle accordingly
					type: "boss",
					id: id,
					bossId: chosenValue,
					team: team,
				}),
			);
			*/
		}
	};

    return (
		<Box sx={{ display: "flex" }}>
			<Box
				sx={{
					borderRight: "1px solid #cc",
				}}
				id="boss-selection-box"
			>
				<BossSelector team={team} updateBoss={setSelection} selections={selections} updateHover={sendHover} />
			</Box>
			{/* button details, other useful information for boss phase */}
			<Box sx={{ padding: 2, width: "500px" }}>
				{
					<React.Fragment>
						<Typography color={"white"} variant="h6">
							{`currently selected: ${selection}`}
						</Typography>
						<Button variant="contained" onClick={() => {sendToSocket()}} disabled={team != newInfo || !matching || currentResult == "waiting"}>
							<Typography color={"yellow"} textTransform="none" variant="h6">
								{currentResult != "waiting" ? "choose boss " : "waiting to start"}
							</Typography>
						</Button>
						<br />
						<Typography variant="h6">
							{
								(localStorage.getItem("boss") != undefined && !inGame) ? `Selected boss id (for custom game purposes): ${localStorage.getItem("boss")}` : null
							}
						</Typography>
						<br />
						<Typography variant="h6">
							{bonusInfo.map((info) => {
								return (
									<Typography key={info} variant="h6">
										{info}
										<br />
									</Typography>
								);
							})}
						</Typography>
					</React.Fragment>
				}
			</Box>
		</Box>
	);
}