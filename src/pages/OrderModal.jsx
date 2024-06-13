// to change player picks - reorder
// will need a method from the parent, a callback

// find a way to switch character order

// idea: submit button at top, player names, pick order
// create a simple menu, choose ordering from 1 to 6 and then pass along results

import { Box, Button, Modal, Menu, MenuItem, TextField } from "@mui/material";
import { Fragment, useState, useEffect } from "react";
const styling = {
  position: "absolute",
  top: `40%`,
  left: "40%",
  width: 500,
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr", // boss button ("Add Aeonblight Drake time"), time, status (dropdown menu)
  component: "form",
  backgroundColor: 'white'
};   
export default function OrderModal(props) {
    // props.phase - if it is "progress"
    const [order, setOrder] = useState([0,1,2,3,4,5]); // taken from original pick order
    const [active, setActive] = useState([null, null, null, null, null, null]);
    const [names, setNames] = useState(["", "", ""])
    const [teamName, setTeamName] = useState(props.teamName);
    const activeAnchors = active.map(menu => {return Boolean(menu);})
    console.log(activeAnchors);
    const activateAnchor = (index, event) => {
        setActive(active => active[index] = event.currentTarget);
    }
    const deactivateAnchor = (index) => {
        setActive(active => active[index] = null);
    }
    // useref value for new order - updates on change, but actual dro
    
    const pickArr = props.picks.map(pick => {return pick.name;});
    console.log(pickArr);
    const verifyOrder = () => {
        if(!props.progress){
            alert("Please wait to change character order until after picks are finished!")
            return;
        }
        if((new Set(order)).size == order.length){
            props.reorder(props.team, order, names, teamName);
        }
        else{
            alert("Please make sure each player has two unique characters!")
        }
    }
    /*
        menu items should be from 1 to 6, 1 being the first pick and 6 being the last
    */
   useEffect(() => {
    console.log(props.players)
    console.log("--------")
   }, [])
   // order is size 3 array
    return (
      <Modal
        open={props.open}
        onClose={props.close}
        aria-label="Order characters modal"
        aria-description="a modal to allow players of each team to change the order of their picks, to better represent who is and who plays who"
      >
        <Box sx={styling}>
          {props.players.map((selection) => selection.name).map((name, index) => {
            {console.log("name: "+name+", index: "+index)}
            return (
              <Fragment key={`pick ${name}`}>
                <TextField
                  id={name}
                  label={`Player ${index + 1} name`}
                  defaultValue={name}
                  onChange={() => {}}
                />
                <Button
                  variant="outlined"
                  id={`button-${2 * index}`}
                  onClick={() => {}}
                >
                  {order[2 * index]}
                </Button>
                <Menu
                  open={activeAnchors[2 * index]}
                  id={2 * index}
                  anchorEl={active[2 * index]}
                  onClose={() => {}}
                >
                  {pickArr.map((pick, ind) => {
                    return (
                      <MenuItem key={pick} onClick={() => {}}>
                        {pick}
                      </MenuItem>
                    );
                  })}
                </Menu>
                <Button
                  variant="outlined"
                  id={`button-${2 * index + 1}`}
                  onClick={() => {}}
                >
                  {order[2 * index + 1]}
                </Button>
                <Menu
                  open={activeAnchors[2 * index + 1]}
                  id={2 * index + 1}
                  anchorEl={active[2 * index + 1]}
                  onClose={() => {}}
                >
                  {pickArr.map((pick, ind) => {
                    return (
                      <MenuItem key={pick} onClick={() => {}}>
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
            sx={{ gridColumn: "span 2", fontSize: "20" }}
            label={`Your team (Team ${props.team}) name`}
            defaultValue={props.teamName}
            onChange={() => {}}
            error={teamName.length > 20}
            helperText={teamName.length > 20 ? "Team names are limited to 20 characters." : undefined}
          />
          <Button
            sx={{ gridColumn: "span 2", fontSize: "20" }}
            onClick={verifyOrder}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    );
}

/*

<Box sx={styling}>
          {names.map((name, index) => {
            return (
              <Fragment key={`pick ${name}`}>
                <TextField
                  id={name}
                  label={`Player ${index + 1} name`}
                  defaultValue={name}
                  onChange={(e) => {
                    setNames((name) => {
                      name[index] = e.target.value;
                    });
                  }}
                />
                <Button
                  variant="outlined"
                  id={`button-${2 * index}`}
                  onClick={(e) => {
                    activateAnchor(2 * index, e);
                  }}
                >
                  {order[2 * index]}
                </Button>
                <Menu
                  open={activeAnchors[2 * index]}
                  id={2 * index}
                  anchorEl={active[2 * index]}
                  onClose={() => deactivateAnchor(2 * index)}
                >
                  {pickArr.map((pick, ind) => {
                    return (
                      <MenuItem
                        key={pick}
                        onClick={() =>
                          setOrder((currOrder) => (currOrder[2 * index] = ind))
                        }
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
                  {order[2 * index + 1]}
                </Button>
                <Menu
                  open={activeAnchors[2 * index + 1]}
                  id={2 * index + 1}
                  anchorEl={active[2 * index + 1]}
                  onClose={() => deactivateAnchor(2 * index + 1)}
                >
                  {pickArr.map((pick, ind) => {
                    return (
                      <MenuItem
                        key={pick}
                        onClick={() =>
                          setOrder(
                            (currOrder) => (currOrder[2 * index + 1] = ind)
                          )
                        }
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
            sx={{ gridColumn: "span 2", fontSize: "20" }}
            label={`Your team (Team ${props.team}) name`}
            defaultValue={props.teamName}
            onChange={(e) => setTeamName(e.target.value)}
            error={teamName.length > 20}
            helperText={teamName.length > 20 ? "Team names are limited to 20 characters." : undefined}
          />
          <Button
            sx={{ gridColumn: "span 2", fontSize: "20" }}
            onClick={verifyOrder}
          >
            Submit
          </Button>
        </Box>

*/