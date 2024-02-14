// 

// React
import React, { useEffect, useRef, useState } from 'react';

// Styling
import './Processing.css';

function Processing (props) {
    // == STATE

    // Buttons
    const [backBtnDisabled, setBackBtnDisabled] = useState(true);
    const [destBtnDisabled, setDestBtnDisabled] = useState(true);

    // Refs
    const renderCounter = useRef(0);
    const isCheckingProgress = useRef(false);
    const listenerMode = useRef('initial');

    // Header content
    const [headerContent, setHeaderContent] = useState('Processing...');

    // Metrics
    const [progress, setProgress] = useState('');
    const [speed, setSpeed] = useState('');
    const [dup, setDup] = useState('');
    const [drop, setDrop] = useState('');


    // == USE EFFECT

    // Mount
    useEffect(() => {
        removeHidden();
        console.log('Render: ' + renderCounter.current);
        if (renderCounter.current === 0) {
            startProgressListener();
        }   
        renderCounter.current = renderCounter.current + 1;
    });

    // == FUNCTIONS

    async function transitionHeaderText (newText) {
        const header = document.querySelector('.sectionHeader');
        header.style.opacity = 0;

        // Add an event listener for the transition to end
        await (() => {
            return new Promise((resolve) => {
                header.addEventListener('transitionend', headerListener.bind(this, resolve));
            });
        })()

        function headerListener (resolve) {
            resolve();
        }

        // Remove the event listener
        header.removeEventListener('transitionend', headerListener);

        setHeaderContent(newText);
        header.style.opacity = 1;
    }

    // Removes hidden class from Processing
    async function removeHidden () {
        const contentSectionWrapper = document.querySelector('.contentSectionWrapper');
        await (() => {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, 1);
            });
        })()  
        contentSectionWrapper.classList.remove('hidden');
    }

    function startProgressListener () {
        window.listenProgress = true;
        progressListener();
    }

    function stopProgressListener () {
        window.listenProgress = false;
    }

    async function progressListener () {
        if (window.listenProgress) {
            callListenerFunctions();

            // Listener interval in ms
            setTimeout(progressListener, 200);
            return;
        }
    }

    function callListenerFunctions () {
        if (listenerMode.current === 'initial') {
            updateMetrics()
        } else if (listenerMode.current === 'finishing') {
            checkJobStatus();
        } else if (listenerMode.current === 'done') {
            handleJobDone();
        } else if (listenerMode.current === 'error') {
            handleJobError();
        }
    }

    async function updateMetrics () {

        let metricsObj;

        if (!isCheckingProgress.current) {
            isCheckingProgress.current = true;
            try {
                metricsObj = await window.electronAPI.checkProgress({
                    type: listenerMode.current
                });
                console.log(metricsObj);
            } catch (err) {
                console.log(err);
            }

            // Update metrics state
            if (metricsObj) {
                if ('out_time' in metricsObj) {
                    setProgress(metricsObj['out_time']);
                }

                if ('speed' in metricsObj) {
                    setSpeed(metricsObj.speed);
                }

                if ('dup_frames' in metricsObj) {
                    setDup(metricsObj['dup_frames']);
                }

                if ('drop_frames' in metricsObj) {
                    setDrop(metricsObj['drop_frames']);
                }

                if ('progress' in metricsObj) {
                    if (metricsObj.progress === 'end') {
                        listenerMode.current = 'finishing';
                        transitionHeaderText('Finishing up...');
                        setSpeed('-');
                    }
                }
            }
                
                isCheckingProgress.current = false;
        }
    }

    async function checkJobStatus () {
        const responseObj = await window.electronAPI.checkProgress({
            type: listenerMode.current,
            inputPath: props.inputPath
        });

        if (responseObj.completed === true) {
            if (responseObj.error) {
                listenerMode.current = 'error';
            } else {
                listenerMode.current = 'done';
            }
        }
    }

    function handleJobDone () {
        stopProgressListener();
        setBackBtnDisabled(false);
        setDestBtnDisabled(false);
        transitionHeaderText('Done.');
    }

    function handleJobError () {
        stopProgressListener();
        transitionHeaderText('Error');
    }

    function handleBackClick () {
        props.setPageIndex((prevCount) => {
         return prevCount - 1;
        });
    }

    async function fadeApp () {
        const App = document.querySelector('.App');
        App.style.transition= 'opacity .5s ease-in-out';
        await asyncSleep(1);
        App.style.opacity = 0;

        // Wait for end of transition
        await (()=> {
            return new Promise((resolve) => {
                App.addEventListener('transitionend', transitionHandler.bind(this, resolve));
            });
        })();

        function transitionHandler (resolve, event) {
            resolve();
        }

        // Remove event listener
        App.removeEventListener('transitionend', transitionHandler);
    }

    async function asyncSleep (timeMs) {
        return new Promise((resolve) => {
            setTimeout(resolve, timeMs);
        });
    }

    async function handleCloseClick () {
        await fadeApp();
        window.electronAPI.closeApp();
    }

    async function handleBackClick () {
        await fadeApp();
        window.location.reload();
        // window.electronAPI.relaunchApp();
    }

    function handleOpenOutputClick () {
        window.electronAPI.openFolder(props.outputPath);
    }

    return (
        <main className="Processing page">
            <h1>Video Splitter</h1>
            <section className='contentSectionWrapper hidden'>
                <h2 className='sectionHeader'>{headerContent}</h2>
                <article className='statsBox'>

                    <label className='progressLabel'>Progress:</label>
                    <span className='progress'>{progress}</span>

                    <label className='speedLabel'>Speed:</label>
                    <span className='speed'>{speed}</span>

                    <label className='dupLabel'>Duplicate frames:</label>
                    <span className='dup'>{dup}</span>

                    <label className='dropLabel'>Dropped frames:</label>
                    <span className='drop'>{drop}</span>

                </article>

                <div className='btnsWrapper'>
                    <button onClick={handleBackClick} disabled={backBtnDisabled}>Back</button>
                    <button onClick={handleOpenOutputClick} disabled={destBtnDisabled}>Open Output Folder</button>
                    <button onClick={handleCloseClick}>Close</button>
                </div>

            </section>
        </main>
    );
}

export default Processing;