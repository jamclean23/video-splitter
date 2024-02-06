// Test component

import React from 'react';

function TestPage2 (props) {

    function handleBackClick () {
        props.setPageIndex((prevCount) => {
         return prevCount - 1;
        });
    }

    return (
        <main className="TestPage2 page">
            <h1>Hello World!</h1>
            <h2>Second Test Page</h2>
            <div className='progressBtnsWrapper'>
                <button className='progressBtn back' onClick={handleBackClick}>Back</button>
            </div>
        </main>
    );
}

export default TestPage2;