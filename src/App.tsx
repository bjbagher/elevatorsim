import * as React from "react";

const initState = () => {
  const state = new Array(10)
    .fill("")
    .map((e, i) => <div className="empty">{i === 0 ? "L" : i}</div>);
  state[0] = <div className="box" id={`floor:${0}`}></div>;
  return state.reverse();
};

function Elevator({
  floor,
  status,
  setStatus,
  goUp,
  goDown,
  sensor,
  goingUpStops,
  goingDownStops,
  setGoingUpStops,
  setGoingDownStops,
}: any) {
  const [state, setState] = React.useState(initState);

  React.useEffect(() => {
    let currentStatus;
    if (
      goingUpStops.find((f: any) => f === floor) ||
      goingDownStops.find((f: any) => f === floor)
    ) {
      console.log("floor", floor, "downstops", goingDownStops);
      currentStatus = "idle";
      setStatus(currentStatus);
      setGoingUpStops(goingUpStops.filter((f: any) => f !== floor));
      setGoingDownStops(goingDownStops.filter((f: any) => f !== floor));
    } else if (goingUpStops.find((f: any) => f > floor)) {
      currentStatus = "up";
      setStatus(currentStatus);
    } else if (goingDownStops.find((f: any) => f < floor)) {
      currentStatus = "down";
      setStatus(currentStatus);
    }

    if (
      (currentStatus === "up" && floor < sensor.maxFloor) ||
      (currentStatus === "down" && floor > sensor.minFloor)
    )
      setTimeout(() => displayElevator(), 1000);
  }, [status, state, goingDownStops, goingUpStops, floor]);

  function displayElevator() {
    const state = new Array(10).fill("").map((e, i) => (
      <div className="empty" key={`floor:${i}`}>
        {i === 0 ? "L" : i}
      </div>
    ));
    if (status === "up") goUp();
    else if (status === "down") goDown();

    state[floor] = <div className="box" key={`elevator-${floor}`}></div>;

    setState(state.reverse());
  }

  return <div>{state}</div>;
}

function App() {
  const [floor, setFloor] = React.useState(0);
  const [sensor] = React.useState({
    minFloor: 0,
    maxFloor: 10,
  });

  const [status, setStatus] = React.useState("idle");
  const [input, setInput] = React.useState("");
  const [onChange, setOnChange] = React.useState("");
  const [goingUpStops, setGoingUpStops] = React.useState([4]);
  const [goingDownStops, setGoingDownStops] = React.useState([1]);

  React.useEffect(() => {
    console.log("use effect", floor, status, goingUpStops, goingDownStops);
  }, [status, floor, input, goingDownStops, goingUpStops]);

  const handleSubmit = (event: any) => {
    setInput(onChange);

    let inputFloor;
    if (onChange) inputFloor = onChange.match(/\d+/)?.[0];
    if (inputFloor?.constructor === String)
      if (+inputFloor > floor)
        setGoingUpStops(goingUpStops.concat(+inputFloor));
      else if (+inputFloor < floor)
        setGoingDownStops(goingDownStops.concat(+inputFloor));
    // const outsideCall = input.match(/u|d/)?.[0];
    // if (outsideCall) setOutsideStops(outsideStops.concat(input.match(/\d+/)[0]));
    // else

    event.preventDefault();
  };

  const handleChange = (event: any) => {
    setOnChange(event.target.value);
  };

  const goUp = () => {
    setFloor(floor + 1);
  };

  const goDown = () => {
    setFloor(floor - 1);
  };

  return (
    <div className="App">
      <h1>Elevator</h1>
      <button onClick={() => setStatus("up")}>up</button>
      <button onClick={() => setStatus("down")}>down</button>
      <button onClick={() => setStatus("idle")}>stop</button>
      <form className="console" onSubmit={handleSubmit}>
        <label>
          console:
          <input type="text" value={onChange} onChange={handleChange} />
        </label>
        <input type="submit" value="enter" onSubmit={handleSubmit} />
      </form>
      <Elevator
        sensor={sensor}
        floor={floor}
        status={status}
        setStatus={setStatus}
        goUp={goUp}
        goDown={goDown}
        goingUpStops={goingUpStops}
        goingDownStops={goingDownStops}
        setGoingDownStops={setGoingDownStops}
        setGoingUpStops={setGoingUpStops}
      />
    </div>
  );
}

export default App;
