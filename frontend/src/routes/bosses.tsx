// for displaying bosses
import React, { Fragment } from "react";
import {Box, Button, Typography} from "@mui/material";
import {BossSelector} from "../components";

interface balance {
	team: number;
	sendHover: (teamNum: number, selected: number) => void;
	inGame: boolean;
	bonusInfo: string[];
	fearless: boolean; // fearless bosses or not
}

export const BossDisplay = ({team, sendHover, inGame, bonusInfo, fearless}: balance) => {
	// maybe add game turn? and current phase? instead of grabbing from session storage?
	const [selection, setSelection] = React.useState<string>("None");
	// get player turn from storage, verify it
	// replace this when timer reaches 0

    return (
		<Box sx={{ display: "flex" }}>
			<Box
				sx={{
					borderRight: "0px solid #ccc",
				}}
				id="boss-selection-box"
			>
				<BossSelector
					inGame={inGame}
					team={team}
					updateBoss={setSelection}
					updateHover={sendHover}
				/>
			</Box>
			{inGame ? null : (
				<Fragment>
					{/* button details, other useful information for boss phase */}
					<Box sx={{ padding: 2, width: "500px" }}>
						{
							<React.Fragment>
								<Typography color={"red"} variant="h6" sx={{fontWeight: "bold"}} /* bold this */ >
									{`currently selected: ${selection}`}
									<br />
									{fearless
										? `fearless bosses active!`
										: null}
								</Typography>
								<Typography variant="h6">
									{localStorage.getItem("boss") !=
										undefined && !inGame
										? `Selected boss id (for custom): ${localStorage.getItem(
												"boss",
										  )}`
										: null}
								</Typography>
								<br />
								<Typography variant="h6">
									{bonusInfo.map((info) => {
										return (
											<Typography key={info}>
												{info}
												<br />
											</Typography>
										);
									})}
								</Typography>
							</React.Fragment>
						}
					</Box>
				</Fragment>
			)}
		</Box>
	);
}