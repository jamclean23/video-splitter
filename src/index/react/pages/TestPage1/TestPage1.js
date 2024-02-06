// Test component

import React, { useEffect, useState } from 'react'


function TestPage1 (props) {

    // == STATE
    const [response, setResponse] = useState('');
    const [resourceResult, setResourceResult] = useState('');
    

    // == USE EFFECT
    
    // Mount
    useEffect(() => {
        addContentSizingListener();
    });
    
    
    // == FUNCTIONS

    function addContentSizingListener () {

            updateContentSizing();

            window.addEventListener('resize', updateContentSizing);

            function updateContentSizing () {

                // Get total hieght of container
                const mainHeight = document.querySelector('main').getBoundingClientRect().height;

                // Get height of other elements
                const mainChildren = Array.from(document.querySelectorAll('main > *'));
                const otherChildren = mainChildren.filter((element) => {
                    return !element.classList.contains('contentSectionWrapper');
                });
                const othersHeight = otherChildren.reduce((totalHeight, element) => {
                    return totalHeight += element.getBoundingClientRect().height;
                }, 0)

                // Set height of content

                const content = document.querySelector('.contentSectionWrapper')
                content.style.maxHeight = mainHeight - othersHeight + 'px';
            }
    }

    function handleNextClick () {
        props.setPageIndex((prevCount) => {
         return prevCount + 1;
        });
    }

    async function handleTestBtnClick () {
        const result = await window.electronAPI.test();
        setResponse(result);
    }

    async function handleCheckResourcesClick () {
        const result = await window.electronAPI.checkResource();
        console.log(result);
        setResourceResult(result);
    }

    // == RENDER

    return (
        <main className="TestPage1 page">
            <h1>Hello World!</h1>
            <h2>First Test Page</h2>

            <div className='contentSectionWrapper'>
                <section className='contentSection'>
                    <p>Click the button to receive a random response. (IPC Test)</p>
                    <button onClick={handleTestBtnClick}>Get a response</button>
                    <p className='result'>{response}</p>
                    <button onClick={handleCheckResourcesClick}>Check Resources Folder</button>
                    <p className='resourceResult'>{resourceResult}</p>
                </section>
            </div>

            <div className='progressBtnsWrapper'>
                <button className='next progressBtn' onClick={handleNextClick}>Next</button>
            </div>
        </main>
    );
}

export default TestPage1;;