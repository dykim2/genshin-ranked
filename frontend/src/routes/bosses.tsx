// for displaying bosses
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { BossSelector } from "../components";
import { socket } from "../../../src/contexts/PlayingContext";

const sendToSocket = (id: number, team: number) => {
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
	const [selection, setSelection] = React.useState<string>("None");
	// get player turn from storage, verify it
	const info = sessionStorage.getItem("game");
	let newInfo: number;
	if (info != null) {
		newInfo = JSON.parse(info).turn;
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
						<Button variant="contained" onClick={() => {sendToSocket(id, team)}} disabled={team != newInfo}>
							<Typography color={"white"} variant="h6">
								Choose Boss 
							</Typography>
						</Button>
					</React.Fragment>
				}
			</Box>
		</Box>
	);
}