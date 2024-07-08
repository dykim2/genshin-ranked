// to change player picks - reorder
// will need a method from the parent, a callback

// find a way to switch character order

// idea: submit button at top, player names, pick order
// create a simple menu, choose ordering from 1 to 6 and then pass along results

import { Box, Button, Modal, Menu, MenuItem, TextField } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Fragment, useState } from "react";
const styling = {
  position: "absolute",
  top: `30%`,
  left: "40%",
  width: 500,
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr", // boss button ("Add Aeonblight Drake time"), time, status (dropdown menu)
  component: "form",
  backgroundColor: 'white'
};   
export default function OrderModal(props) {
    const [order, setOrder] = useState([0,1,2,3,4,5]); // taken from original pick order
    const [active, setActive] = useState([null, null, null, null, null, null]);
    const [names, setNames] = useState([...props.players])
    const [teamName, setTeamName] = useState(props.teamName);
    const activeAnchors = active.map(menu => {return Boolean(menu);})
    const activateAnchor = (index, event) => {
      let newActive = [...active];
      newActive[index] = event.currentTarget;
      setActive(newActive);
    }
    const deactivateAnchor = (index) => {
      let newActive = [...active];
      newActive[index] = null;
      setActive(newActive);
    }
    // useref value for new order - updates on change, but actual dro
    console.log(props.picks);
    console.log("picks")
    const pickArr = props.picks.map(pick => {return pick.name;});
    /**
     * Sends the order information to the websocket.
     */
    const verifyOrder = () => {
      // check default
      let defaultVal = true;
      for(let i = 0; i < order.length; i++){
        if(order[i] != i){
          defaultVal = false;
          break;
        }
      }
      if (!props.progress && !defaultVal) {
        alert(
          "Pick order cannot be changed until the game is in progress. All other changes will still take place."
        );
        setOrder([0, 1, 2, 3, 4, 5]); // reset order
      }
      else if((new Set(order)).size != order.length){
        alert("Please make sure each player has two unique characters! All other changes will still take place.");
      }
      props.reorder(props.team, order, names, teamName);
      alert("Team information updated successfully!")
      props.close();
    }
    /**
     * Makes a shallow copy of names with the same objects, to edit accordingly.
     * @param {*} index the location of the name to update
     * @param {*} e the event information
     */
    const updateNames = (index, e) => {
      let newNames = [...names];
      newNames[index] = e.target.value; 
      setNames(newNames);
    }
    const updateOrder = (index, value) => {
      if(value < 0 || value >= order.length){
          // do literally, absolutely, utterly nothing
          return;
      }
      let newOrder = [...order];
      newOrder[index] = value;
      setOrder(newOrder);
      deactivateAnchor(index); // deactivate on selection
    }
    /*
      menu items should be from 0 to 5, 0 being the first pick and 5 being the last
    */
    // order is size 3 array
    return (
      <Modal
        open={props.open}
        onClose={props.close}
        aria-label="Order characters modal"
        aria-description="a modal to allow players of each team to change the order of their picks, to better represent who is and who plays who"
      >
        <Box sx={styling}>
          <p
            style={{
              textAlign: "center",
              gridColumn: "span 3",
              color: "blue",
              fontFamily: "Roboto",
            }}
          >{`Team ${props.team} characters`}</p>
          <p
            style={{ textAlign: "center", color: "blue", fontFamily: "Roboto" }}
          >
            {" "}
          </p>
          <p
            style={{ textAlign: "center", color: "blue", fontFamily: "Roboto" }}
          >
            Character 1
          </p>
          <p
            style={{ textAlign: "center", color: "blue", fontFamily: "Roboto" }}
          >
            Character 2
          </p>
          {props.players.map((name, index) => {
            return (
              <Fragment key={`pick ${name}`}>
                <TextField
                  id={name}
                  label={`Player ${index + 1} name`}
                  defaultValue={name}
                  onChange={(e) => {
                    updateNames(index, e);
                  }}
                />
                <Button
                  variant="outlined"
                  id={`button-${2 * index}`}
                  onClick={(e) => {
                    activateAnchor(2 * index, e);
                  }}
                >
                  {props.picks[order[2 * index]].name}
                  <ArrowDropDownIcon />
                </Button>
                <Menu
                  open={activeAnchors[2 * index]}
                  id={2 * index}
                  anchorEl={active[2 * index]}
                  onClose={() => {
                    deactivateAnchor(2 * index);
                  }}
                >
                  {pickArr.map((pick, ind) => {
                    return (
                      <MenuItem
                        key={`${pick} - ${ind}`}
                        onClick={() => {
                          updateOrder(2 * index, ind);
                        }}
                      >
                        {pick}
                      </MenuItem>
                    );
                  })}
                </Menu>
                <Button
                  variant="outlined"
                  id={`button-${2 * index + 1}`}
                  onClick={(e) => {
                    activateAnchor(2 * index + 1, e);
                  }}
                >
                  {props.picks[order[2 * index + 1]].name}
                  <ArrowDropDownIcon />
                </Button>
                <Menu
                  open={activeAnchors[2 * index + 1]}
                  id={2 * index + 1}
                  anchorEl={active[2 * index + 1]}
                  onClose={() => {
                    deactivateAnchor(2 * index + 1);
                  }}
                >
                  {pickArr.map((pick, ind) => {
                    return (
                      <MenuItem
                        key={`${pick} - ${ind}`}
                        onClick={() => updateOrder(2 * index + 1, ind)}
                      >
                        {pick}
                      </MenuItem>
                    );
                  })}
                </Menu>
              </Fragment>
            );
          })}
          <TextField
            id={`team-${props.team}-name`}
            sx={{ gridColumn: "span 3", fontSize: "20" }}
            label={`Your team (Team ${props.team}) name`}
            defaultValue={props.teamName}
            onChange={(e) => setTeamName(e.target.value)}
            error={teamName.length > 20}
            helperText={
              teamName.length > 20
                ? "Team names are limited to 20 characters."
                : undefined
            }
          />
          <Button
            sx={{ gridColumn: "span 3", fontSize: "20" }}
            onClick={verifyOrder}
          >
            Submit
          </Button>
          <Button
            sx={{ gridColumn: "span 3", fontSize: "20" }}
            onClick={props.close}
          >
            Exit
          </Button>
        </Box>
      </Modal>
    );
}