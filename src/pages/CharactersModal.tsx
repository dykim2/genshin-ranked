import { FC, useState } from "react";
import { CharacterSelector } from "../../frontend/src/components";
import { Modal } from "@mui/material";

interface CharactersModalProps {
    open: boolean;
    close: () => void;
    index: number;
    updateCharacter: (index: number,  character: number) => void;
}

const CharactersModal: FC<CharactersModalProps> = (props) => {
    // save index of the 3 characters
    // match index to character
    return (
        <Modal open={props.open} onClose={props.close}>
            <CharacterSelector
                inGame={false}
                team={props.index}
                updateCharacter={() => {}}
                updateHover={props.updateCharacter}
                phase="waiting"
            />
        </Modal>
    )
}

export default CharactersModal;