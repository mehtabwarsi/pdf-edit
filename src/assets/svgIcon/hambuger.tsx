import * as React from "react";
import Svg, { Line } from "react-native-svg";
import { IconProps } from "../../utills/types";
const HambugerIcon = ({ width, height }: IconProps) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
    >
        <Line
            x1={5}
            y1={7}
            x2={19}
            y2={7}
            stroke="#000000"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Line
            x1={5}
            y1={12}
            x2={19}
            y2={12}
            stroke="#000000"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Line
            x1={5}
            y1={17}
            x2={19}
            y2={17}
            stroke="#000000"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);
export default HambugerIcon
