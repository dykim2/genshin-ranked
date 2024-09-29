// for displaying bosses
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { BossSelector } from "../components";
import { socket } from "../../../src/contexts/PlayingContext";
import {useCookies} from "react-cookie";

const sendToSocket = (id: number, team: number, turn: number) => {
	// find the corresponding id of the character with this display name
	// loop on the character information
	
	if(socket.readyState == 1){
		let chosenValue: number = -1;
		if(sessionStorage.getItem("boss") == null){
			chosenValue = -1;
			alert("Please choose a boss!");
			return;
		}
		else{
			chosenValue = parseInt(sessionStorage.getItem("boss")!)
		}
		// verify team
		// get the team from the main game, send it here, if they match then sure
		

		socket.send(JSON.stringify({
			// force websocket to determine if current status is ban or pick, handle accordingly
			type: "boss",
			id: id,
			bossId: chosenValue,
			team: team
		}))
	}
}
interface balance {
	id: number,
	team: number
}

export const BossDisplay = ({id, team}: balance) => {
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
		console.log("hi")
		console.log(currentResult);
	} else {
		newInfo = 0;
	}
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
						<Button variant="contained" onClick={() => {sendToSocket(id, team, newInfo)}} disabled={team != newInfo || !matching || currentResult == "waiting"}>
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