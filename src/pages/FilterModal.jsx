import { Box, Button, Modal } from "@mui/material";

export default function FilterModal(props){
    // filter the list of current characters by element(s), rarity (4 or 5 star), name, region, weapon
    // use localstorage for the filter
    // create a grid
    const styling = {
        position: "absolute",
        width: 500,
        display: "grid",
        gridTemplateColumns: ""
    }
    const elements = [
        "Pyro",
        "Hydro",
        "Electro",
        "Cryo",
        "Dendro",
        "Geo",
        "Anemo"
    ]
    const weapons = [
        "Sword",
        "Polearm",
        "Claymore",
        "Bow",
        "Catalyst"
    ]
    const rarity = [
        "4-star",
        "5-star"
    ]
    const region = [
        "Mondstadt",
        "Liyue",
        "Inazuma",
        "Sumeru",
        "Fontaine"
    ]
    // text field for name
    return(
        <Modal
          open={props.open}
          onClose={props.close}
        >
            <Box sx={styling}>
                <p>Filter bosses by:</p>
                <p>Filter characters by:</p>
            </Box>
        </Modal>
    )
}