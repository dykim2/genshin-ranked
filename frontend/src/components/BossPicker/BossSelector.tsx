import React, {useRef, useState} from "react";
import {
    BOSSES,
	ELEMENT_INFO,
	ELEMENTS,
	// RARITY,
	// RARITY_INFO,
} from "@genshin-ranked/shared";
import { InputAdornment, Stack, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import { BossButton } from "./BossButton";
import { GroupToggle } from "../GroupToggle";
import SearchIcon from "@mui/icons-material/Search";
import { BOSS_DETAIL } from "@genshin-ranked/shared/src/types/bosses/details";
import { useAppSelector } from "../../../../src/hooks/ReduxHooks";
import { chosenBossPlusBans } from "../../../../src/GameReduce/selectionSlice";

// an exact copy of character selector applied for bosses - should make a selector component instead but this way gets the changes out faster

export interface IBoss {
	inGame: boolean;
	team: number;
	updateBoss: React.Dispatch<React.SetStateAction<string>>;
	updateHover: (teamNum: number, selected: number) => void;
	phase: string;
}

export const BossSelector = ({
	inGame,
	team,
	phase,
	updateBoss,
	updateHover,
}: IBoss) => {
	const [elementFilter, setElementFilter] = useState<ELEMENTS | null>(null);
	const [searchFilter, setSearchFilter] = useState<string>("");
	const [isFocused, setIsFocused] = useState<boolean>(false);
	// const [count, setCount] = useState<number>(0); // just for re-rendering purposes, only when selections changes
	const selections = useAppSelector(chosenBossPlusBans);
	const componentRef = useRef(null);
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
						width: {xs: 160, md: 220, lg: 250},
						marginTop: 0.75,
						input: { color: "white" },
						// Customizing the input text color
						"& .MuiOutlinedInput-root": {
							"& fieldset": {
								borderColor: "rgba(105,105,105,1)",
							},
							// Hover state
							"&:hover fieldset": { borderColor: "white" },
							// Focused state
							"&.Mui-focused fieldset": { borderColor: "white" },
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
				id="boss-selector-grid"
				ref={componentRef}
			>
				{/* TODO: Wrap this with useMemo to minimize unnessecary refiltering of these values */}
				{Object.values(BOSSES)
					.filter((boss) => {
						if (searchFilter.length === 0 && elementFilter === null)
							return true;

						// TODO: Algorithm can be slightly optimized. (Not by degrees of n, but perhaps a coefficient of it.)
						const correctElement =
							elementFilter === BOSS_DETAIL[boss].element;
						const correctSearch =
							BOSS_DETAIL[boss].displayName
								.toLowerCase()
								.includes(searchFilter.toLowerCase()) ||
							BOSS_DETAIL[boss].imageFileName
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
					.map((x) => {
						return x != BOSSES.None && 
						(x != BOSSES.NoBan || 
							phase.toLowerCase() == "bossban" ) ? (
							<Grid key={x}>
								<BossButton
									team={team}
									boss={x}
									updateBoss={updateBoss}
									isChosen={selections.includes(
										BOSS_DETAIL[x].index,
									)}
									mainDisplay={true}
									updateHover={updateHover}
									component={false}
								/>
							</Grid>
						) : null;
					})}
			</Grid>
		</Stack>
	);
};
// in line 128, replace selectable with all of the ids that have been chosen