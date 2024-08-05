// for displaying bosses
import React, { useState } from "react";
import {Box, Typography} from "@mui/material";
import { BossSelector } from "../components";

export const BossDisplay = () => {
	const [selection, setSelection] = useState<String>();
    return (
		<Box sx={{ display: "flex" }}>
			<Box
				sx={{
					borderRight: "1px solid #cc",
				}}
				id="boss-selection-box"
			>
				<BossSelector choice={setSelection} />
			</Box>
			<Box sx={{ padding: 2, width: "500px" }}>
				<Typography variant="h6">
					Current selection: {selection}
				</Typography>
			</Box>
		</Box>
	);
}