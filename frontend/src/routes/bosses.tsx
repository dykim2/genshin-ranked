// for displaying bosses
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { BossSelector } from "../components";
import { socket } from "../../../src/contexts/PlayingContext";
import {useCookies} from "react-cookie";

interface balance {
	id: number; // game ID - useful but likely not needed
	team: number;
	pickSelection: ( teamNum: number, selectedObj: object, timeout: boolean ) => {};
}

export const BossDisplay = ({id, team, pickSelection}: balance) => {
	const [cookieInfo] = useCookies(["player"]);
	const [selection, setSelection] = React.useState<string>("None");
	// get player turn from storage, verify it
	let matching = true;
	if (cookieInfo.player.substring(0, 1) != team) {
		matching = false;
	}
	const info = sessionStorage.getItem("game");
	let newInfo: number;
	let currentResult: string = "";
	if (info != null) {
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
				<BossSelector bossName={selection} updateBoss={setSelection} />
			</Box>
			{/* button details, other useful information for boss phase */}
			<Box sx={{ padding: 2, width: "500px" }}>
				{
					<React.Fragment>
						<Typography color={"white"} variant="h6">
							{`Currently selected: ${selection}`}
						</Typography>
						<Button variant="contained" onClick={() => {sendToSocket()}} disabled={team != newInfo || !matching || currentResult == "waiting"}>
							<Typography color={"white"} variant="h6">
								{currentResult != "waiting" ? "Choose Boss " : "Waiting to start"}
							</Typography>
						</Button>
					</React.Fragment>
				}
			</Box>
		</Box>
	);
}