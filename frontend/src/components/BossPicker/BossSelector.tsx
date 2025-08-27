import React, { useEffect, useRef, useState } from "react";
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

// an exact copy of character selector applied for bosses - should make a selector component instead but this way gets the changes out faster

export interface IBoss {
	team: number;
	updateBoss: React.Dispatch<React.SetStateAction<string>>;
	selections: number[]; // the selected bosses; these ones will be greyed out (no seperate message tho; the seperate message is already handled elsewhere)
	updateHover: (teamNum: number, selected: number) => void;
}

export const BossSelector = ({
	team,
	updateBoss,
	selections,
	updateHover
}: IBoss) => {
	const [elementFilter, setElementFilter] = useState<ELEMENTS | null>(null);
	const [searchFilter, setSearchFilter] = useState<string>("");
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [count, setCount] = useState<number>(0); // just for re-rendering purposes, only when selections changes
	const componentRef: any = useRef(null)
	useEffect(() => {
		/*
		if(componentRef.current){
			const {width, height} = componentRef.current.getBoundingClientRect();
			console.log(`center: ${width/2}, ${height/2}`)
			// localStorage.setItem("width", `${width}`)
			// localStorage.setItem("height", `${height}`)
		}
		*/
		setCount(count => count + 1);
	}, [selections]) 
	return (
		<Stack direction="column">
			<Stack direction="row" alignContent="center">
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
						minWidth: 240,
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
				minWidth="470px"
				maxWidth="98vw"
				id="char-selector-grid"
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
						const correctSearch = BOSS_DETAIL[boss].imageFileName
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
						return (x != BOSSES.None) ? (
							<Grid padding={0.3} key={x}>
								<BossButton
									team={team}
									boss={x}
									updateBoss={updateBoss}
									selectDisplay={false}
									isChosen={selections.includes(BOSS_DETAIL[x].index)}		
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