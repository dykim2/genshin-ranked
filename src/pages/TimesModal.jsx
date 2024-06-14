import {Box, Button, Menu, MenuItem, Modal, TextField} from "@mui/material"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Fragment, useState } from "react";
const styling = {
    position: 'absolute',
    top: `30%`,
    left: '40%',
    width: 700,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr', // boss button ("Add Aeonblight Drake time"), time, status (dropdown menu)
    component: "form",
    backgroundColor: "white"
}   
export default function TimesModal(props){
  // create a grid, field and button to set time
  // then a button to close
  // eventually make it have a feature for retry / forced retry
  const [active, setActive] = useState(
    Array(2 * props.bosses.length).fill(null)
  );
  const activeAnchors = active.map((menu) => {
    return Boolean(menu);
  });
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
  const [data, setData] = useState([...props.times]);
  const [penaltyStatus, setPenaltyStatus] = useState(
    Array(props.bosses.length).fill("Penalty")
  );
  const [penaltyInfo, setPenaltyInfo] = useState([...props.penalty]); // toggles
  const [deathStatus, setDeathStatus] = useState(
    Array(props.bosses.length).fill("Deaths")
  );
  const [deathInfo, setDeathInfo] = useState([...props.deaths]); // toggles

  // match boss with time
  // pass boss names, callback function, player names, open, close, updateTimes, team, status
  let penaltyMenu = [
    "Remove Penalties",
    "Retry",
    "DNF",
    "Ref Error",
    "VAR",
    "Forced RT",
  ];
  let deathMenu = [...props.playerNames];
  deathMenu.unshift("No Deaths");
  // send back index
  // mostly inspired from official Material UI docs
  const sendStatus = (index, time) => {
    console.log("time info")
    console.log(data);
    console.log("penalty info")
    console.log(penaltyInfo);
    console.log("death info")
    console.log(deathInfo);
    return;
    props.updateTimes(index, time, props.team);
    props.updateStatus(props.team, index, penaltyInfo[index], "penalty");
    props.updateStatus(props.team, index, deathInfo[index], "death");
  };
  const updateData = (index, e) => {
    let newData = [...data];
    newData[index] = e.target.value;
    setData(newData);
  };
  const updatePenalty = (index, penalty, loc) => {
    let newPenalty = [...penaltyStatus];
    newPenalty[index] = penalty;
    setPenaltyStatus(newPenalty);
    let copyPenalty = [...penaltyInfo];
      console.log(copyPenalty);
      console.log("---------");
      console.log("penalty: "+penalty+", index: "+index+", loc: "+loc);
    if(penalty == "Remove Penalties"){
      copyPenalty[index] = Array(5).fill(false);
      setPenaltyInfo(copyPenalty); 
    }
    else{
      copyPenalty[index][loc - 1] = true;
      setPenaltyInfo(copyPenalty);
    }
    deactivateAnchor(2 * index);
  };
  const updateDeath = (index, death, loc) => {
    console.log("hi ??");
    let newDeath = [...deathStatus];
    newDeath[index] = death;
    setDeathStatus(newDeath);
    let copyDeath = [...deathInfo];
    if(death == "No Deaths"){
      copyDeath[index] = Array(3).fill(false);
      setDeathInfo(copyDeath); 
    }
    else{
      console.log(copyDeath);
      console.log("---------")
      copyDeath[index][loc - 1] = true;
      setDeathInfo(copyDeath);
    }
    deactivateAnchor(2 * index + 1);
  };
  let bossNames = props.bosses.map((boss) => {
    return boss.boss;
  });
  return (
    <Modal
      open={props.open}
      onClose={props.close}
      aria-label="input times"
      aria-description="a modal to update time and pick information for players of a team"
    >
      <Box sx={styling}>
        <p
          style={{
            textAlign: "center",
            color: "blue",
            fontSize: 20,
            gridColumn: "span 4",
          }}
        >{`Team ${props.team} times`}</p>
        {bossNames.map((boss, index) => {
          return (
            <Fragment key={`${boss} ind ${index}`}>
              <TextField
                id={boss}
                label={`${boss} time`}
                defaultValue={props.times[index]}
                onChange={(e) => {
                  updateData(index, e);
                }}
              />
              <Button
                variant="outlined"
                id={`penalty-button-${index}`}
                onClick={(e) => {
                  activateAnchor(2 * index, e);
                }}
              >
                {penaltyStatus[index]}
                <ArrowDropDownIcon />
              </Button>
              <Menu
                id={`Penalty ${index}`}
                open={activeAnchors[2 * index]}
                anchorEl={active[2 * index]}
                onClose={() => {
                  deactivateAnchor(2 * index);
                }}
              >
                {penaltyMenu.map((penalty, ind) => {
                  return (
                    <MenuItem
                      key={penalty}
                      onClick={() => {
                        updatePenalty(index, penalty, ind);
                      }}
                    >
                      {penalty}
                    </MenuItem>
                  );
                })}
              </Menu>
              <Button
                variant="outlined"
                id={`death-button-${index}`}
                onClick={(e) => {
                  activateAnchor(2 * index + 1, e);
                }}
              >
                {deathStatus[index]}
                <ArrowDropDownIcon />
              </Button>
              {/* need to pass team, which boss, which selection, and whether death or penalty was chosen*/}
              <Menu
                id={`Death ${index}`}
                open={activeAnchors[2 * index + 1]}
                anchorEl={active[2 * index + 1]}
                onClose={() => {
                  deactivateAnchor(2 * index + 1);
                }}
                MenuListProps={{ "aria-labelledby": "death-button" }}
              >
                {deathMenu.map((player, ind) => {
                  return (
                    <MenuItem
                      key={player}
                      onClick={() => updateDeath(index, player, ind)}
                    >
                      {player}
                    </MenuItem>
                  );
                })}
              </Menu>
              <Button
                id={`boss-button-${index}`}
                variant="outlined"
                onClick={() => {
                  sendStatus(index, data[index]);
                }}
              >
                Submit
              </Button>
            </Fragment>
          );
        })}
        <Button
          onClick={() => {
            props.close();
          }}
          sx={{ textAlign: "center", gridColumn: "span 4", fontSize: 20 }}
        >
          Exit
        </Button>
      </Box>
    </Modal>
  );
}

/*

                    aria-controls={
                      penaltyOpen ? `Penalty ${index}` : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={penaltyOpen ? "true" : undefined}
*/