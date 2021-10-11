import * as React from "react";

const initState = () => {
  const state = new Array(10)
    .fill("")
    .map((e, i) => <div className="empty">{i + 1}</div>);
  state[0] = <div className="box" id={`floor:${0}`}></div>;
  return state.reverse();
};

export default function Elevator({ currentFloor }: any) {
  const [state, setState] = React.useState(initState);

  function displayElevator() {
    const newState = new Array(10).fill("").map((e, i) => (
      <div className="empty" key={`floor:${i}`}>
        {i + 1}
      </div>
    ));
    newState[currentFloor - 1] = (
      <div className="box" key={`elevator-${currentFloor}`}></div>
    );

    setState(newState.reverse());
  }

  React.useEffect(() => {
    const id = setInterval(() => displayElevator(), 1000);
    return () => clearInterval(id);
  }, [state]);

  return <div>{state}</div>;
}
