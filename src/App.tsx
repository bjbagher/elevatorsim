import * as React from "react";
import Elevator from "./Elevator";

const SPEED_BETWEEN_FLOORS = 2000;
const STATUS = {
  UP: "UP",
  IDLE: "IDLE",
  DOWN: "DOWN",
};

const ACTIONS = {
  GO_UP: () => ({ type: "GO_UP" }),
  GO_DOWN: () => ({ type: "GO_DOWN" }),
  SET_STATUS_UP: () => ({ type: "SET_STATUS_UP" }),
  SET_STATUS_DOWN: () => ({ type: "SET_STATUS_DOWN" }),
  SET_STATUS_IDLE: () => ({ type: "SET_STATUS_IDLE" }),
  UPDATE_FLOORS_GOING_UP: () => ({ type: "UPDATE_FLOORS_GOING_UP" }),
  UPDATE_FLOORS_GOING_DOWN: () => ({ type: "UPDATE_FLOORS_GOING_DOWN" }),
  SET_FLOORS_GOING_UP: (payload: number) => ({
    type: "SET_FLOORS_GOING_UP",
    payload,
  }),
  SET_FLOORS_GOING_DOWN: (payload: number) => ({
    type: "SET_FLOORS_GOING_DOWN",
    payload,
  }),
};

function App() {
  const [buildingParams] = React.useState({
    minFloor: 1,
    maxFloor: 10,
  });

  const [currentFloor, setCurrentFloor] = React.useState(1);
  const [floorsToStopGoingUp, setFloorsToStopGoingUp] = React.useState([]);
  const [floorsToStopGoingDown, setFloorsToStopGoingDown] = React.useState([]);
  const [status, setStatus] = React.useState("IDLE");
  const [input, setInput] = React.useState("");
  const [onChange, setOnChange] = React.useState("");

  const asAsync =
    (...args: any) =>
    (cb: any, ms = 0) =>
      new Promise((resolve) =>
        setTimeout(() => {
          resolve(cb(...args));
        }, ms)
      );

  const reducer = async ({
    type,
    payload,
  }: {
    type: string;
    payload?: number;
  }) => {
    switch (type) {
      case "GO_UP":
        await asAsync(currentFloor + 1)(setCurrentFloor, SPEED_BETWEEN_FLOORS);
        break;
      case "GO_DOWN":
        await asAsync(currentFloor - 1)(setCurrentFloor, SPEED_BETWEEN_FLOORS);
        break;
      case "SET_STATUS_UP":
        setStatus(STATUS.UP);
        break;
      case "SET_STATUS_DOWN":
        setStatus(STATUS.DOWN);
        break;
      case "SET_STATUS_IDLE":
        setStatus(STATUS.IDLE);
        break;
      case "SET_FLOORS_GOING_UP":
        await asAsync(floorsToStopGoingUp.concat(payload as any))(
          setFloorsToStopGoingUp
        );
        break;
      case "SET_FLOORS_GOING_DOWN":
        await asAsync(floorsToStopGoingDown.concat(payload as any))(
          setFloorsToStopGoingDown
        );
        break;
      case "UPDATE_FLOORS_GOING_UP":
        console.log("UPDATING", buildingParams, floorsToStopGoingUp);
        await asAsync(floorsToStopGoingUp.filter((f) => f !== currentFloor))(
          setFloorsToStopGoingUp
        );
        break;
      case "UPDATE_FLOORS_GOING_DOWN":
        console.log("UPDATING", buildingParams, floorsToStopGoingDown);
        await asAsync(floorsToStopGoingDown.filter((f) => f !== currentFloor))(
          setFloorsToStopGoingDown
        );
        break;
      case "RESET":
        await asAsync([])(setFloorsToStopGoingDown);
        await asAsync([])(setFloorsToStopGoingUp);
        break;

      default:
        break;
    }
  };

  const awaitReducer = async () => {
    // stop on floor
    if (
      status === STATUS.UP &&
      floorsToStopGoingUp.find((f) => f === currentFloor)
    ) {
      await reducer(ACTIONS.UPDATE_FLOORS_GOING_UP());
      await reducer(ACTIONS.SET_STATUS_IDLE());
    } else if (
      status === STATUS.DOWN &&
      floorsToStopGoingDown.find((f) => f === currentFloor)
    ) {
      await reducer(ACTIONS.UPDATE_FLOORS_GOING_DOWN());
      await reducer(ACTIONS.SET_STATUS_IDLE());
      // continue go to up
    } else if (status === STATUS.UP && currentFloor < buildingParams.maxFloor) {
      await reducer(ACTIONS.GO_UP());
      // continue to go down
    } else if (
      status === STATUS.DOWN &&
      currentFloor > buildingParams.minFloor
    ) {
      await reducer(ACTIONS.GO_DOWN());
      // if iddle, go up
    } else if (
      status === STATUS.IDLE &&
      floorsToStopGoingUp.find((f) => f > currentFloor)
    ) {
      await reducer(ACTIONS.SET_STATUS_UP());
      // if iddle, go down
    } else if (
      status === STATUS.IDLE &&
      floorsToStopGoingDown.find((f) => f < currentFloor)
    ) {
      await reducer(ACTIONS.SET_STATUS_DOWN());
    } else if (
      status === STATUS.IDLE &&
      floorsToStopGoingDown.find((f) => f > currentFloor)
    ) {
      await reducer(ACTIONS.SET_STATUS_UP());
    } else if (
      status === STATUS.IDLE &&
      floorsToStopGoingUp.find((f) => f < currentFloor)
    ) {
      await reducer(ACTIONS.SET_STATUS_DOWN());
    } else {
      await reducer(ACTIONS.SET_STATUS_IDLE());
    }
  };

  React.useEffect(() => {
    console.log(
      "status",
      status,
      { buildingParams },
      floorsToStopGoingUp,
      floorsToStopGoingDown,
      currentFloor
    );
    awaitReducer();
  }, [currentFloor, status, input]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const inputFloor = +(onChange.match(/\d+/) || [])[0];
    const outsideCall = (onChange.match(/u|d/) || [])[0];

    if (outsideCall?.toLowerCase() === "u") {
      await reducer(
        ACTIONS.SET_FLOORS_GOING_UP(
          inputFloor > buildingParams.maxFloor
            ? buildingParams.maxFloor
            : inputFloor
        )
      );
    } else if (outsideCall?.toLowerCase() === "d") {
      await reducer(
        ACTIONS.SET_FLOORS_GOING_DOWN(
          inputFloor < buildingParams.minFloor
            ? buildingParams.minFloor
            : inputFloor
        )
      );
    } else if (inputFloor > currentFloor + 1) {
      await reducer(
        ACTIONS.SET_FLOORS_GOING_UP(
          inputFloor > buildingParams.maxFloor
            ? buildingParams.maxFloor
            : inputFloor
        )
      );
    } else if (inputFloor <= currentFloor + 1)
      await reducer(
        ACTIONS.SET_FLOORS_GOING_DOWN(
          inputFloor < buildingParams.minFloor
            ? buildingParams.minFloor
            : inputFloor
        )
      );
    await asAsync(onChange)(setInput);
  };

  const handleChange = (event: any) => {
    setOnChange(event.target.value);
  };

  return (
    <div className="App">
      <h1>Elevator</h1>
      <form className="console" onSubmit={handleSubmit}>
        <label>
          console:
          <input type="text" value={onChange} onChange={handleChange} />
        </label>
        <input type="submit" value="enter" onSubmit={handleSubmit} />
      </form>
      <Elevator currentFloor={currentFloor} />
    </div>
  );
}

export default App;
