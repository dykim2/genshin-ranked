// for displaying bosses
import React, { useState } from "react";
import {Box, Typography} from "@mui/material";
import { BossSelector } from "../components";

export const BossDisplay = () => {
	const [selection, setSelection] = useState<string>("None");
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
				<Typography color={"white"} variant="h6">
					{`Currently selected: ${selection}`}
				</Typography>
			</Box>
		</Box>
	);
}