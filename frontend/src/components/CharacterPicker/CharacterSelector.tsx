import React, { useState } from "react";
import {
	CHARACTERS,
	ELEMENT_INFO,
	ELEMENTS,
	// RARITY,
	// RARITY_INFO,
} from "@genshin-ranked/shared";
import { Grid, Stack, TextField } from "@mui/material";
import { CharacterButton } from "./CharacterButton";
import { GroupToggle } from "../GroupToggle";
import { CHARACTER_INFO } from "@genshin-ranked/shared/src/types/characters/details";

export const CharacterSelector = () => {
	const [elementFilter, setElementFilter] = useState<ELEMENTS | null>(null);
	const [searchFilter, setSearchFilter] = useState<string>("");

	return (
		<Stack direction="column">
			<Stack direction="row" alignContent="center">
				<TextField
					placeholder="Search"
					value={searchFilter}
					onChange={(e) => {
						setSearchFilter(e.target.value);
					}}
				/>
				<GroupToggle
					value={elementFilter}
					setValue={setElementFilter}
					options={Object.values(ELEMENT_INFO)}
				/>
			</Stack>
			<Grid container spacing={1} justifyContent="center">
				{/* TODO: Wrap this with useMemo to minimize unnessecary refiltering of these values */}
				{Object.values(CHARACTERS)
					.filter((char) => {
						if (searchFilter.length === 0 && elementFilter === null)
							return true;

						// TODO: Algorithm can be slightly optimized. (Not by degrees of n, but perhaps a coefficient of it.)
						const correctElement =
							elementFilter === CHARACTER_INFO[char].element;
						const correctSearch = CHARACTER_INFO[char].imageFileName
							.toLowerCase()
							.includes(searchFilter.toLowerCase());

						if (searchFilter.length === 0 && elementFilter) {
							return correctElement;
						} else if (searchFilter.length > 0 && !elementFilter) {
							return correctSearch;
						} else if (searchFilter.length > 0 && elementFilter) {
							return correctElement && correctSearch;
						} else {
							return true;
						}
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
