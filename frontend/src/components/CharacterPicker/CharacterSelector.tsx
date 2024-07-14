import React from "react";
import { CHARACTER_NAME } from "@genshin-ranked/shared";
import { Grid } from "@mui/material";
import { CharacterButton } from "./CharacterButton";

export const CharacterSelector = () => {
	return (
		<Grid container spacing={1} justifyContent="center">
			{Object.values(CHARACTER_NAME).map((x) => (
				<Grid item padding={1} key={x}>
					<CharacterButton character={x} />
				</Grid>
			))}
		</Grid>
	);
};
