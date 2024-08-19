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
		if(sessionStorage.getItem("selection") == null){
			chosenValue = -1;
		}
		else{
			chosenValue = parseInt(sessionStorage.getItem("selection")!)
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
						<Button onClick={() => {sendToSocket(id, team)}} disabled={false}>
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