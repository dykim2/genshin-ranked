import React, { useEffect, useState } from "react";
import {
	CHARACTERS,
	ELEMENT_INFO,
	ELEMENTS,
	// RARITY,
	// RARITY_INFO,
} from "@genshin-ranked/shared";
import { InputAdornment, Stack, TextField } from "@mui/material";
import { CharacterButton } from "./CharacterButton";
import { GroupToggle } from "../GroupToggle";
import { CHARACTER_INFO } from "@genshin-ranked/shared/src/types/characters/details";
import SearchIcon from '@mui/icons-material/Search';
import Grid from "@mui/material/Grid";
import { useAppSelector } from "../../../../src/hooks/ReduxHooks";
import { chosenCharacters } from "../../../../src/GameReduce/selectionSlice";

export interface Pick {
	inGame: boolean;
	team: number;
	updateCharacter: React.Dispatch<React.SetStateAction<string>>;
	updateHover: (teamNum: number, selected: number) => void;
	phase: string;
}	

export const CharacterSelector = ({
	inGame,
	team,
	updateCharacter,
	updateHover,
	phase
}: Pick) => {
	const [elementFilter, setElementFilter] = useState<ELEMENTS | null>(null);
	const [searchFilter, setSearchFilter] = useState<string>("");
	const [isFocused, setIsFocused] = useState<Boolean>(false);
	// const [count, setCount] = useState<number>(0); // just for re-rendering purposes, only when selectedChars changes
	const selectedChars = useAppSelector(chosenCharacters);
	const componentRef = React.useRef(null);
	useEffect(() => {
		// setCount(count => count + 1);
	}, [selectedChars])
	return (
		<Stack direction="column">
			<Stack
				direction={{ xs: "column", md: "row" }}
				alignContent="center"
			>
				<TextField
					variant="outlined"
					placeholder="search"
					size="small"
					value={searchFilter}
					onChange={(e) => {
						setSearchFilter(e.target.value);
					}}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					sx={{
						width: { xs: 160, md: 220, lg: 250 },
						input: { color: "white" },
						// Customizing the input text color
						"& .MuiOutlinedInput-root": {
							"& fieldset": {
								borderColor: "rgba(105,105,105,1)",
							},
							// Hover state
							"&:hover fieldset": { borderColor: "white" },
							// Focused state
							"&.Mui-focused fieldset": {
								borderColor: "rgba(105,105,105,1)",
							},
						},
					}}
					slotProps={{
						input: {
							startAdornment: (
								<InputAdornment position="start">
									{!isFocused && (
										<SearchIcon
											sx={{
												color: "white",
												padding: 0,
											}}
										/>
									)}
								</InputAdornment>
							),
						},
					}}
				/>

				<GroupToggle
					value={elementFilter}
					setValue={setElementFilter}
					options={Object.values(ELEMENT_INFO)}
				/>
			</Stack>
			<Grid
				container
				spacing={1}
				maxHeight="70vh"
				maxWidth={inGame ? undefined : "85vw"}
				overflow={"auto"}
				id="char-selector-grid"
				ref={componentRef}
			>
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
					.map((x) =>
						x != CHARACTERS.None &&
						(x != CHARACTERS.NoBan ||
							phase.toLowerCase() == "extraban" ||
							phase.toLowerCase() == "ban") &&
						(x != CHARACTERS.Random ||
							phase.toLowerCase() == "pick") ? (
							<Grid key={x}>
								<CharacterButton
									team={team}
									character={x}
									updateCharacter={updateCharacter}
									banDisplay={"loadout"}
									isChosen={selectedChars.includes(
										CHARACTER_INFO[x].index,
									)}
									mainDisplay={true}
									updateHover={updateHover}
									component={false}
								/>
							</Grid>
						) : null,
					)}
			</Grid>
		</Stack>
	);
};
