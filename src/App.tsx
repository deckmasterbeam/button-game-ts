import { useEffect, useState } from 'react';

function App() {
  const [gridSize, setGridSize] = useState(4);
  const [clickedButtons, setClickedButtons] = useState<number[]>([]);
  const [targets, setTargets] = useState<number[]>([]);
  const [resetGameOnNextClick, setResetGameOnNextClick] = useState(false);
  const [winState, setWinState] = useState(false);

  const generateNewTargets = () => {
    const newTargets: number[] = [];
    while (newTargets.length < gridSize) {
      const randomIndex = Math.floor(Math.random() * gridSize * gridSize);
      if (!newTargets.includes(randomIndex)) {
        newTargets.push(randomIndex);
      }
    }
    setTargets(newTargets);

    console.log('New targets generated:', newTargets);
  }

  useEffect(() => {
    generateNewTargets();
  }, [gridSize]);

  const handleButtonOnClick = (index: number) => {
    // buttons can only be clicked once, and not when in win state
    if (clickedButtons.includes(index) || winState) return;

    // reset the name after the user misses a target
    if (resetGameOnNextClick) {
      setClickedButtons([index]);
      setResetGameOnNextClick(false);
    } 
    // update the clicked buttons
    else {
      setClickedButtons(prev => [...prev, index]);
    }

    // user has clicked on something other than the target, reset the game on the next click
    if (!targets.includes(index)) {
      setResetGameOnNextClick(true);
    }

    // new clicked buttons must only include the same indexes as targets in order to set the win to true
    const newClickedButtons = [...clickedButtons, index];
    if (newClickedButtons.length !== gridSize) {
      return;
    }
    for (const index of newClickedButtons) {
      if (!targets.includes(index)) {
        return;
      }
    }
    setWinState(true);
  }

  const handleWinButtonClick = () => {
    setWinState(false);
    setClickedButtons([]);
    generateNewTargets();
  }


  return (
    <div className='container'>
      <input type="range" min="2" max="20" value={gridSize} onChange={(e) => setGridSize(parseInt(e.target.value))}></input>
      {`Grid Size: ${gridSize} x ${gridSize}`}
      {winState && (
        <div className='win-state-container'>
          <h1 className='win-state-header'>You Win!</h1>
          <button className='win-state-button' onClick={handleWinButtonClick}>Play Again</button>
        </div>
      )}
      <div style={{ height: `${gridSize * 100}px`, width: `${gridSize * 100}px`, backgroundColor: 'lightgray'}}>
        {Array.from({ length: gridSize }, (_, row) => (
          <div key={`row-${row}`} style={{ display: 'flex' }}>
          {Array.from({ length: gridSize }, (_, col) => {
            const index = row * gridSize + col;
            const color = clickedButtons.includes(index) && targets.includes(index) 
              ? 'green' 
              : clickedButtons.includes(index) 
                ? 'red' 
                : 'white';

            return (
              <button key={index} style={{ width: '100px', height: '100px', backgroundColor: color}} onClick={() => handleButtonOnClick(index)}></button>
            )
          })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
