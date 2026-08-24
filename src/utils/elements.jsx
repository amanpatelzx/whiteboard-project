import { ARROW_LENGTH, TOOL_ITEMS } from "../constants";
import rough from "roughjs/bin/rough"
import { getArrowHeadsCoordinates } from "./math";
const gen = rough.generator();
export const createRoughElement = (id, x1, y1, x2, y2, {type}) => {
    const element = {
        id,
        x1,
        y1,
        x2,
        y2,
    };
    let option = {
        seed : id + 1,//id can't be zero
        // fill : 'red',
    }
    switch (type) {
        case TOOL_ITEMS.LINE:{
            element.roughEle = gen.line(x1, y1, x2, y2, option);
            return element;
        }
        case TOOL_ITEMS.RECTANGLE:{
            element.roughEle = gen.rectangle(x1, y1, x2-x1, y2-y1, option);
            return element;
        }
        case TOOL_ITEMS.CIRCLE:{
            const radius = Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
            element.roughEle = gen.circle(x2, y2, radius*2, option);
            return element; 
        }
        case TOOL_ITEMS.ELLIPSE:{
            element.roughEle = gen.ellipse((x1+x2)/2, (y1+y2)/2 ,x1 - x2, y1- y2 , option);
            return element; 
        }
        case TOOL_ITEMS.ARROW:{
            const {x3, y3, x4, y4} = getArrowHeadsCoordinates(x1, y1, x2, y2, ARROW_LENGTH);
            const points = [
                [x1,y1],
                [x2,y2],
                [x3,y3],
                [x2,y2],
                [x4,y4]
            ];
            element.roughEle = gen.linearPath(points , option);
            return element; 
        }
        default:{
            throw new Error("Type is not recognized");
        }
    }
};