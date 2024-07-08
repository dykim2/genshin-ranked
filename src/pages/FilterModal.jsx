import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box, Button, Menu, MenuItem, Modal } from "@mui/material";
import { Fragment, useEffect, useState } from "react";

export default function FilterModal(props) {
  // filter the list of current characters by element(s), rarity (4 or 5 star), name, region, weapon
  // use localstorage for the filter
  // create a grid
  const [bossHighlight, setBossHighlight] = useState("Select a region:");
  const [active, setActive] = useState([null, null, null, null, null]); 
  const [setting, setSetting] = useState(["Select a region:", "Select an element:", "Select a weapon:", "Select a rarity:"]);

 

  const activeAnchors = active.map(menu => {return Boolean(menu);});
  const elements = [
    "Element: Any",
    "Element: Pyro",
    "Element: Hydro",
    "Element: Electro",
    "Element: Cryo",
    "Element: Dendro",
    "Element: Geo",
    "Element: Anemo",
  ];
  const weapons = [
    "Weapon: Any",
    "Weapon: Sword",
    "Weapon: Polearm",
    "Weapon: Claymore",
    "Weapon: Bow",
    "Weapon: Catalyst",
  ];
  const rarity = ["Rarity: Any", "Rarity: 4-star", "Rarity: 5-star"];
  const region = [
    "Region: Any",
    "Region: Mondstadt",
    "Region: Liyue",
    "Region: Inazuma",
    "Region: Sumeru",
    "Region: Fontaine",
  ];
  const filters = [region, elements, weapons, rarity];
  const activateAnchor = (index, event) => {
    let newActive = [...active];
    newActive[index] = event.currentTarget;
    setActive(newActive);
  };
  const deactivateAnchor = (index) => {
    let newActive = [...active];
    newActive[index] = null;
    setActive(newActive);
  };
  const updateSetting = (index, choice) => {
    let newSetting = [...setting];
    newSetting[index] = filters[index][choice];
    
    setSetting(newSetting);
  }
  const styling = {
    position: "absolute",
    width: 350,
    top: `40%`,
    left: "43%",
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "auto",
    componet: "form",
    backgroundColor: "white",
  };
   useEffect(() => {
    if(localStorage.getItem("display_boss") != null && localStorage.getItem("display_boss") != 0){
        setBossHighlight(region[localStorage.getItem("display_boss")])
        console.log("hi");
    }
    let settingInfo = ["Select a region:", "Select an element:", "Select a weapon:", "Select a rarity:"]
    const filterName = [
      "character_region",
      "character_elements",
      "character_weapons",
      "character_rarity",
    ];
    setSetting(settingInfo.map((info, index) => {
        if (
          localStorage.getItem(filterName[index]) != null &&
          localStorage.getItem(filterName[index]) != 0
        ) {
          return filters[index][localStorage.getItem(filterName[index])];
        } else {
          return info;
        }
    }));
   }, []);
  // text field for name
  return (
    <Modal open={props.open} onClose={props.close}>
      <Box sx={styling}>
        <p style={{ textAlign: "center", color: "blue", fontFamily: "Roboto" }}>
          <b>Filtering bosses and characters</b>
          <br />
          <br />
          Show bosses in the following region:
        </p>
        <Button
          variant="outlined"
          id={"boss_button"}
          onClick={(e) => {
            activateAnchor(0, e);
          }}
        >
          {bossHighlight}
          <ArrowDropDownIcon />
        </Button>
        <Menu
          open={activeAnchors[0]}
          id={0}
          anchorEl={active[0]}
          onClick={(e) => {
            deactivateAnchor(0);
          }}
        >
          {region.map((ref) => {
            return (
              <MenuItem key={ref} onClick={() => setBossHighlight(ref)}>
                {ref}
              </MenuItem>
            );
          })}
        </Menu>
        <p style={{ textAlign: "center", color: "blue", fontFamily: "Roboto" }}>
          Show characters who match the following:
        </p>
        {
            filters.map((filtered, index) => {
                return (
                  <Fragment key={index}>
                    <Button
                      variant="outlined"
                      id={"char_region"}
                      onClick={(e) => {
                        activateAnchor(index + 1, e);
                      }}
                    >
                      {setting[index]}
                      <ArrowDropDownIcon />
                    </Button>
                    <Menu
                      open={activeAnchors[index + 1]}
                      id={0}
                      anchorEl={active[index + 1]}
                      onClick={(e) => {
                        deactivateAnchor(index + 1);
                      }}
                    >
                      {filtered.map((ref, ind) => {
                        return (
                          <MenuItem
                            key={ref}
                            onClick={() => updateSetting(index, ind)}
                          >
                            {ref}
                          </MenuItem>
                        );
                      })}
                    </Menu>
                  </Fragment>
                );
            })
        }
        <Button
            variant="outlined"
            onClick={() => {props.close(); props.setOrder([bossHighlight, ...setting])}}
        >
            Submit
        </Button>
      </Box>
    </Modal>
  );
}
