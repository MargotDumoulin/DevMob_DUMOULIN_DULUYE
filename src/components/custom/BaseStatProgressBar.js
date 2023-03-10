import React from "react";
import * as Progress from 'react-native-progress';

import Colors from "../../definitions/Colors";

export const BaseStatProgressBar = ({stat, myStyle}) => {
    const getColor = () => {
        if (stat / 255 <= 0.1) {
            return Colors.progressBar.red;
        }
        else if (stat / 255 <= 0.2) {
            return Colors.progressBar.orange;
        }
        else if (stat / 255 <= 0.3) {
            return Colors.progressBar.yellow;
        }
        else if (stat / 255 <= 0.4) {
            return Colors.progressBar.lightGreen;
        }
        else if (stat / 255 <= 0.5) {
            return Colors.progressBar.green;
        }
        else {
            return Colors.progressBar.blue;
        }
    }

    return (
        <Progress.Bar
            progress={stat / 255}
            width={null}
            color={getColor()}
            unfilledColor={Colors.progressBar.unfilledColor}
            borderWidth={0}
            style={myStyle} />
    );
};
