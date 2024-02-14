// Main react App

// ====== IMPORTS ======

import React, { useEffect, useState } from 'react';

// Styling
import './App.css';

// Components
import Intro from './pages/Intro/Intro.js';
import Processing from './pages/Results/Processing.js';

// ====== FUNCTIONS ======

function App () {

    // SET PAGE INDEX TO 0 IN PRODUCTION
    const [pageIndex, setPageIndex] = useState(0);
    const [inputPath, setInputPath] = useState('');
    const [outputPath, setOutputPath] = useState('');
    const [numOfClips, setNumOfClips] = useState(2);


    // pageIndex change
    useEffect(() => {
        // console.log(pageIndex);
    }, [pageIndex]);

    // On mount
    useEffect(() => {
    });

    return (
        <div className='App'>
            {
                [
                    <Intro
                        inputPath={inputPath}
                        setInputPath={setInputPath}
                        outputPath={outputPath}
                        setOutputPath={setOutputPath}
                        setPageIndex={setPageIndex}
                        numOfClips={numOfClips}
                        setNumOfClips={setNumOfClips}
                    />,
                    <Processing 
                        setPageIndex={setPageIndex}
                        inputPath={inputPath}
                        outputPath={outputPath}
                    />
                ][pageIndex]
            }
        </div>
    );
}


// ====== EXPORTS ======

export default App;