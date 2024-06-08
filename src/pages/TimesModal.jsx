import {Modal, TextField} from "@mui/material"
const styling = {
    position: 'absolute',
    top: `50%`,
    left: '50%',
    width: 400,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: '1fr 1fr 1fr',
    component: "form"
}   
export default function TimesModal(props){
    // create a grid, field and button to set time
    // then a button to close
    // eventually make it have a feature for retry / forced retry

    return (
      <div>
        <Modal
          open={props.open}
          onClose={props.close}
          aria-labelledby="input times"
          aria-describedby="a modal to update time and pick information for players of a team"
        >
          <Box sx={styling}>
            <button>1</button>
            <TextField></TextField>
            <TextField></TextField>
            <button>4</button>
            <button>5</button>
            <button>6</button>
            <button>7</button>
            <button>8</button>
            <button>9</button>
          </Box>
        </Modal>
      </div>
    );
}