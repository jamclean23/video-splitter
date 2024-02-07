// Intro page component

// React
import React, { useEffect, useState } from 'react'

// Styling
import './Intro.css';


function Intro (props) {

    // == STATE
    

    // == USE EFFECT
    
    // Mount
    useEffect(() => {
        addContentSizingListener();
    });
    
    
    // == FUNCTIONS

    // Dynamically adjusts the maxHeight of the contentSectionWrapper
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
                content.style.height = mainHeight - othersHeight - 32 + 'px';
            }
    }

    async function handleInputClick () {
        const result = await window.electronAPI.inputDialog();
        props.setInputPath(result);
    }

    async function handleOutputClick () {
        const result = await window.electronAPI.outputDialog();
        props.setOutputPath(result);
    }

    async function handleProcessClick () {
        console.log('Sending process request');
        disableSetupEls();
        startProgressListener();
        try {

            const result = await window.electronAPI.process({
                inputPath: props.inputPath,
                outputPath: props.outputPath,
                numOfClips: props.numOfClips
            });
        } catch (err) {
            console.log(err);
            enableSetupEls();
        }

        stopProgressListener();
        enableSetupEls();

    }

    function startProgressListener () {
        window.listenProgress = true;
        progressListener();
    }

    function stopProgressListener () {
        window.listenProgress = false;
    }

    async function progressListener () {
        console.log(window.listenProgress);
        if (window.listenProgress) {
            console.log('Listener status:');
            setTimeout(progressListener, 100);
            return;
        }
    }

    function disableSetupEls () {

        const elsArray = [
            document.querySelector('.processBtn'),
            document.querySelector('.inputBtn'),
            document.querySelector('.outputBtn'),
            document.querySelector('#numOfClips')
        ]

        elsArray.forEach((element) => {
            element.disabled = true;
        });
    }

    function enableSetupEls () {
        const elsArray = [
            document.querySelector('.processBtn'),
            document.querySelector('.inputBtn'),
            document.querySelector('.outputBtn'),
            document.querySelector('#numOfClips')
        ]

        elsArray.forEach((element) => {
            element.disabled = false;
        });
    }

    function handleNextClick () {
        props.setPageIndex((prevCount) => {
         return prevCount + 1;
        });
    }

    function determineReady () {
        if (props.inputPath && props.outputPath) {
            return true;
        } else {
            return false;
        }
    }

    function handleNumOfClipsChange (event) {
        props.setNumOfClips(event.target.value);
    }

    // async function handleTestBtnClick () {
    //     const result = await window.electronAPI.test();
    // }



    // == RENDER

    return (
        <main className="Intro page">
            <h1>Video Splitter</h1>
            {/* <h2>Setup</h2> */}

            <div className='contentSectionWrapper'>
                <section className='contentSection'>

                    <div className='chooseInputWrapper'>
                        <p>Find the mp4 video that you would like to split.</p>
                        <button className='inputBtn' onClick={handleInputClick}>Choose Input</button>
                        <span className='chosenSpan chosenInput'>{props.inputPath}</span>
                    </div>

                    <div className='chooseOutputWrapper'>
                        <p>Pick where you would like the output clips. </p>
                        <button className='outputBtn' onClick={handleOutputClick}>Choose Output Folder</button>
                        <span className='chosenSpan chosenOutput'>{props.outputPath}</span>
                    </div>

                    <div className='numOfClipsWrapper'>
                        <p>Choose how many output clips you would like.</p>
                        <input id='numOfClips' className='numOfClips' type='number' value={props.numOfClips} min='2' max='100' onChange={handleNumOfClipsChange}/>
                    </div>

                    <div className='processBtnWrapper'>
                        <button className='processBtn' disabled={!determineReady()} onClick={handleProcessClick}>Process</button>
                    </div>
                </section>
            </div>

            {/* <div className='progressBtnsWrapper'>
                <button className='next progressBtn' onClick={handleNextClick}>Next</button>
            </div> */}
        </main>
    );
}

export default Intro;