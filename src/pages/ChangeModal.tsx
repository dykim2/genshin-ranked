import React, { useState } from "react";
import { Button, Modal, Stack, TextField, Typography } from "@mui/material";

// a modal that pops up that shows an existing character and a way to replace them
const styling = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: 250,
  component: "form",
  backgroundColor: "white",
  transform: "translate(-50%, -50%)",
};   
interface ChangeProps {
    open: boolean;
    close: () => void;
    change: (val: string, team: number) => void;
    type: string,
    name: string,
    team: number
}
const ChangeModal: React.FC<ChangeProps> = (props) => {
    const [newVal, setNewVal] = useState<string>("");
    return (
      <Modal open={props.open} onClose={props.close}>
        <Stack sx={styling} direction="column" alignItems="center" spacing={1}>
          <Typography
            sx={{
              color: "blue",
              fontSize: 16,
            }}
          >
            {`Choose a replacement ${props.type}.\n`}
          </Typography>
          <TextField
            disabled
            id="current"
            sx={{ width: "100%" }}
            defaultValue={`Current ${props.type}: ${props.name}\n`}
          />
          <TextField
            id="1"
            label={`id or name of new ${props.type}`}
            defaultValue={props.name}
            sx={{ width: "100%" }}
            onChange={(e) => setNewVal(e.target.value)}
          />
          <Button sx={{ fontSize: 16 }} onClick={props.close}>
            Exit
          </Button>
          <Button
            sx={{ fontSize: 16 }}
            onClick={() => props.change(newVal, props.team)}
          >
            Save
          </Button>
        </Stack>
      </Modal>
    );
}
export default ChangeModal;