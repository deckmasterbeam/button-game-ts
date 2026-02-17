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

    
    if (targets.every(target => clickedButtons.includes(target) || target === index)) {
      setWinState(true);
    }
  }


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <input type="range" min="2" max="20" value={gridSize} onChange={(e) => setGridSize(parseInt(e.target.value))}></input>
      {`Grid Size: ${gridSize} x ${gridSize}`}
      {winState && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <h1 style={{ color: 'white', fontSize: '2rem' }}>You Win!</h1>
          <button style={{ marginLeft: '20px', padding: '10px 20px', fontSize: '1rem' }} onClick={() => {
            setWinState(false);
            setClickedButtons([]);
            generateNewTargets();
          }}>Play Again</button>
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
