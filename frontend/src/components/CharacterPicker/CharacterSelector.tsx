import React, { useState } from "react";
import {
	CHARACTERS,
	ELEMENT_INFO,
	ELEMENTS,
	// RARITY,
	// RARITY_INFO,
} from "@genshin-ranked/shared";
import { Grid, InputAdornment, Stack, TextField } from "@mui/material";
import { CharacterButton } from "./CharacterButton";
import { GroupToggle } from "../GroupToggle";
import { CHARACTER_INFO } from "@genshin-ranked/shared/src/types/characters/details";
import SearchIcon from '@mui/icons-material/Search';

export const CharacterSelector = () => {
	const [elementFilter, setElementFilter] = useState<ELEMENTS | null>(null);
	const [searchFilter, setSearchFilter] = useState<string>("");
	const [isFocused, setIsFocused] = useState(false);

	return (
		<Stack direction="column">
			<Stack direction="row" alignContent="center">
				<TextField
					variant="outlined"
					placeholder="Search"
					size = 'small'
					value={searchFilter}
					onChange={(e) => {
						setSearchFilter(e.target.value);
					}}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					sx={{
						minWidth: 140,
						// Customizing the input text color
						'& .MuiOutlinedInput-root': {
						'& fieldset': {borderColor: 'rgba(105,105,105,1)'},
						// Hover state
						'&:hover fieldset': {borderColor: 'white'},
						// Focused state
						'&.Mui-focused fieldset': {borderColor: 'white'},
						},
					}}
					InputProps={{
						startAdornment:(
							<InputAdornment position="start">
								{!isFocused && <SearchIcon sx={{ color: 'rgba(105,105,105,1)', padding:0}} />}
							</InputAdornment>
						)
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
