import React, { useState } from "react";
import {
	CHARACTERS,
	ELEMENT_INFO,
	ELEMENTS,
	// RARITY,
	// RARITY_INFO,
} from "@genshin-ranked/shared";
import { Grid, Stack } from "@mui/material";
import { CharacterButton } from "./CharacterButton";
import { GroupToggle } from "../GroupToggle";
import { CHARACTER_INFO } from "@genshin-ranked/shared/src/types/characters/details";

export const CharacterSelector = () => {
	const [elementFilter, setElementFilter] = useState<ELEMENTS | null>(null);

	return (
		<Stack direction="column">
			<Stack direction="row">
				<GroupToggle
					value={elementFilter}
					setValue={setElementFilter}
					options={Object.values(ELEMENT_INFO)}
				/>
				{/* <GroupToggle
					value={rarityFilter}
					setValue={() => setRarityFilter}
					options={Object.values(RARITY_INFO)}
				/> */}
			</Stack>
			<Grid container spacing={1} justifyContent="center">
				{Object.values(CHARACTERS)
					.filter((char) => {
						if (!elementFilter) return true;
						console.log(
							elementFilter,
							CHARACTER_INFO[char].element,
						);

						return elementFilter === CHARACTER_INFO[char].element;
					})
					.map((x) => (
						<Grid item padding={1} key={x}>
							<CharacterButton character={x} />
						</Grid>
					))}
			</Grid>
		</Stack>
	);
};
