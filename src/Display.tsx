import * as React from "react";

export default function Display({
  currentFloor,
  status,
  floorsToStopGoingDown,
  floorsToStopGoingUp,
}: any) {
  return (
    <div>
      <div> STATUS: {status}</div>
      <div> CURRENT FLOOR : {currentFloor}</div>
      <div>
        {" "}
        FLOORS TO STOP GOING UP :{JSON.stringify(floorsToStopGoingUp, null, 2)}
      </div>
      <div>
        {" "}
        FLOORS TO STOP GOING DOWN :
        {JSON.stringify(floorsToStopGoingDown, null, 2)}
      </div>
    </div>
  );
}
