// Main react App

// ====== IMPORTS ======

import React, { useEffect, useState } from 'react';
import mountains from '../../assets/mountains.png';

// Styling
import './App.css';

// Components
import TestPage1 from './pages/TestPage1/TestPage1.js';
import TestPage2 from './pages/TestPage2/TestPage2.js';

// ====== FUNCTIONS ======

function App () {

    const [pageIndex, setPageIndex] = useState(0);


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
                    <TestPage1 setPageIndex={setPageIndex}/>,
                    <TestPage2 setPageIndex={setPageIndex}/>
                ][pageIndex]
            }
        </div>
    );
}


// ====== EXPORTS ======

export default App;