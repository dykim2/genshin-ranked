import React from "react";
import { useDraggable } from "@dnd-kit/core";


const Dragable = (props: any) => {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: props.id,
      });

    return(
        <div ref={setNodeRef} style={transform ? {transform:`translate3d(${transform.x}px, ${transform.y}px, 0)`} : undefined} {...listeners} {...attributes}>
            {props.children}
        </div>
    )
}

export default Dragable;