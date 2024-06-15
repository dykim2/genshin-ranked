import {Box, Button, Menu, MenuItem, Modal, TextField, Tooltip} from "@mui/material"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Fragment, useState } from "react";
import "@fontsource/roboto/300.css";
const styling = {
    position: 'absolute',
    top: `30%`,
    left: '30%',
    width: 950,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr', // boss button ("Add Aeonblight Drake time"), time, status (dropdown menu)
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

  const deathField = (index, info = deathInfo) => {
    // information of what statuses are applied
    let text = "Deaths: ";
    const newMenu = [...props.playerNames];
    for(let i = 0; i < newMenu.length; i++){
      if(info[index][i]){
        text += newMenu[i]+", ";
      }
    }
    return text.substring(0, text.length - 2); // remove the last space and comma
  }
  const statusField = (index, info = penaltyInfo) => {
    // information of what statuses are applied
    let text = "Status: ";
    const newMenu = ["Retry", "DNF", "Ref Error", "VAR", "Forced RT", "Tech"];
    for (let i = 0; i < newMenu.length; i++) {
      if (info[index][i]) {
        text += newMenu[i] + ", ";
      }
    }
    return text.substring(0, text.length - 2); // remove the last space and comma
  };
  let penArr = [];
  let deadArr = [];
  for(let i = 0; i < penaltyStatus.length; i++){
    penArr.push(statusField(i));
    deadArr.push(deathField(i));
  }
  
  const [penaltyDisplay, setPenaltyDisplay] = useState(penArr);
  const [deathDisplay, setDeathDisplay] = useState(deadArr);

  // match boss with time
  // pass boss names, callback function, player names, open, close, updateTimes, team, status
  let penaltyMenu = [
    "Remove Penalties",
    "Retry",
    "DNF",
    "Ref Error",
    "VAR",
    "Forced RT",
    "Tech"
  ];
  let deathMenu = [...props.playerNames];
  deathMenu.unshift("No Deaths");
  // send back index
  // mostly inspired from official Material UI docs
  const sendStatus = (index, time) => {
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
    if(penalty == "Remove Penalties"){
      copyPenalty[index] = Array(5).fill(false);
      setPenaltyInfo(copyPenalty); 
    }
    else{
      copyPenalty[index][loc - 1] = true;
      setPenaltyInfo(copyPenalty);
    }
    let penArr = [...penaltyDisplay];
    penArr[index] = statusField(index, copyPenalty);
    setPenaltyDisplay(penArr);
    deactivateAnchor(2 * index);
  };
  const updateDeath = (index, death, loc) => {
    let newDeath = [...deathStatus];
    newDeath[index] = death;
    setDeathStatus(newDeath);
    let copyDeath = [...deathInfo];
    if(death == "No Deaths"){
      copyDeath[index] = Array(3).fill(false);
      setDeathInfo(copyDeath); 
    }
    else{
      copyDeath[index][loc - 1] = true;
      setDeathInfo(copyDeath);
    }
    let deadArr = [...deathDisplay];
    deadArr[index] = deathField(index, copyDeath);
    setDeathDisplay(deadArr);
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
            gridColumn: "span 8",
            fontFamily: 'Roboto'
          }}
        >{`Team ${props.team} times`}</p>
        {bossNames.map((boss, index) => {
          return (
            <Fragment key={`${boss} ind ${index}`}>
              <Tooltip arrow title={`Enter time (in seconds, as a decimal) for boss ${boss}`}>
                <TextField
                  id={boss}
                  label={`${boss} time`}
                  defaultValue={props.times[index]}
                  onChange={(e) => {
                    updateData(index, e);
                  }}
                />
              </Tooltip>
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
              <TextField
                disabled
                label={"current penalties for boss " + (index + 1)}
                sx={{ gridColumn: "span 2" }}
                value={
                  penaltyDisplay[index] == "Status"
                    ? "Status: "
                    : penaltyDisplay[index]
                }
              />
              <TextField
                disabled
                label={"current deaths for boss " + (index + 1)}
                sx={{ gridColumn: "span 2" }}
                value={
                  penaltyDisplay[index] == "Deaths"
                    ? "Deaths: "
                    : deathDisplay[index]
                }
              />
            </Fragment>
          );
        })}
        <Button
          onClick={() => {
            props.close();
          }}
          sx={{ textAlign: "center", gridColumn: "span 8", fontSize: 20 }}
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