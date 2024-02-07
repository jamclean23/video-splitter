// Main react App

// ====== IMPORTS ======

import React, { useEffect, useState } from 'react';

// Styling
import './App.css';

// Components
import Intro from './pages/Intro/Intro.js';
import TestPage2 from './pages/TestPage2/TestPage2.js';

// ====== FUNCTIONS ======

function App () {

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
                    <TestPage2 setPageIndex={setPageIndex}/>
                ][pageIndex]
            }
        </div>
    );
}


// ====== EXPORTS ======

export default App;