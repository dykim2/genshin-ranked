import {Box, Button, Menu, MenuItem, Modal, TextField} from "@mui/material"
import { Fragment, useState } from "react";
const styling = {
    position: 'absolute',
    top: `50%`,
    left: '50%',
    width: 500,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr', // boss button ("Add Aeonblight Drake time"), time, status (dropdown menu)
    component: "form",
    backgroundColor: "black"
}   
export default function TimesModal(props){
    // create a grid, field and button to set time
    // then a button to close
    // eventually make it have a feature for retry / forced retry
    const [penaltyAnchor, setPenalty] = useState(null);
    const [deathAnchor, setDeath] = useState(null);
    const penaltyOpen = Boolean(penaltyAnchor);
    const deathOpen = Boolean(deathAnchor)
    const [data, setData] = useState(props.times);
    const [penaltyStatus, setPenaltyStatus] = useState("Penalty");
    const [deathStatus, setDeathStatus] = useState("Deaths");


    // match boss with time
    // pass boss names, callback function, player names, open, close, updateTimes, team, status
    let bossNames = props.bosses;
    let penaltyMenu = ["No Penalty", "Did not finish", "Ref Error", "Variable", "Forced Retry"] 
    let deathMenu = [...props.playerNames];
    deathMenu.unshift("No Deaths");
    deathMenu.push(deathMenu[0] + " and " + deathMenu[1]);
    deathMenu.push(deathMenu[0] + " and " + deathMenu[2]);
    deathMenu.push(deathMenu[1] + " and " + deathMenu[2]);
    deathMenu.push(deathMenu[0] + ", " + deathMenu[1] + ", and " + deathMenu[2]);
    // send back index
    // mostly inspired from official Material UI docs
    const openPenalty = (e) => {
      setPenalty(e.currentTarget);
    }
    const closePenalty = () => {
      setPenalty(null);
    }
    const openDeath = (e) => {
      setDeath(e.currentTarget);
    }
    const closeDeath = () => {
      setDeath(null);
    }
    const sendStatus = (index, time) => {
      console.log("hi");
      return;
      // props.updateTimes(index, time, props.team);
      // props.updateStatus(props.team, index, penaltyStatus, "penalty");
      // props.updateStatus(props.team, index, deathStatus, "death");
    }
    return (
      <Modal
        open={props.open}
        onClose={props.close}
        aria-label="input times"
        aria-description="a modal to update time and pick information for players of a team"
      >
        <Box sx={styling}>
          {
            bossNames.map((boss, index) => {
              return (
                <Fragment key={boss.boss}>
                  <Button variant="outlined" onClick={() => {console.log(data);}}>Submit</Button> {/* sendStatus(index, data[index]) */}
                  <TextField id={boss.boss} label={`${boss.boss} time (in seconds)`} defaultValue="0.00" onChange={(e) => {setData(data => {data[index] = e.target.value})} }/>
                  <Button id="penalty-button" onClick={openPenalty} aria-controls={penaltyOpen ? `Penalty ${boss._id}` : undefined} aria-haspopup="true" aria-expanded={penaltyOpen ? "true" : undefined}>
                    {penaltyStatus}
                  </Button>
                  <Menu id={`Penalty ${boss._id}`} open={penaltyOpen} anchorEl={penaltyAnchor} onClose={closePenalty}>
                    {
                      penaltyMenu.map((penalty) => {
                        return(<MenuItem key={penalty} onClick={() => {setPenaltyStatus(penalty)}}>{penalty}</MenuItem>)
                      })
                    }
                  </Menu>
                  <Button id="death-button" onClick={openDeath} aria-controls={deathOpen ? `Death ${boss._id}` : undefined} aria-haspopup="true" aria-expanded={deathOpen ? "true" : undefined}>
                    {deathStatus}
                  </Button>
                   {/* need to pass team, which boss, which selection, and whether death or penalty was chosen*/}
                  <Menu id={`Death ${boss._id}`} open={deathOpen} anchorEl={deathAnchor} onClose={closeDeath} MenuListProps={{'aria-labelledby': 'death-button'}}>
                    {
                      deathMenu.map((player) => {
                        return (<MenuItem key={player} onClick={() => setDeathStatus(player)}>{player}</MenuItem>)
                      }) 
                    }
                  </Menu>
                </Fragment>
              );
            })
          }
        </Box>
      </Modal>
    );
}