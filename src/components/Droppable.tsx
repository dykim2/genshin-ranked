import React from "react";
import {useDroppable} from "@dnd-kit/core";

const Droppable = (props: any) => {
    const { isOver, setNodeRef } = useDroppable({
      id: props.id,
    });
    const style = {backgroundColor: isOver ? "red" : undefined};
    return (
      <div ref={setNodeRef} style={style}>
        {props.children}
      </div>
    );
}

export default Droppable;