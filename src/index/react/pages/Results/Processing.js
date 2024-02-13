// 

// React
import React, { useEffect, useRef } from 'react';

// Styling
import './Processing.css';

function Processing (props) {
    // == STATE

    const renderCounter = useRef(0);

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
            console.log('Listener status:');
            setTimeout(progressListener, 100);
            return;
        }
    }

    function handleBackClick () {
        props.setPageIndex((prevCount) => {
         return prevCount - 1;
        });
    }

    return (
        <main className="Processing page">
            <h1>Video Splitter</h1>
            <section className='contentSectionWrapper hidden'>
                <h2>Processing...</h2>
                <article className='statsBox'>

                    <label className='progressLabel'>Progress:</label>
                    <span className='progress'>'prog'</span>

                    <label className='speedLabel'>Speed:</label>
                    <span className='speed'>'speed'</span>

                    <label className='dupLabel'>Duplicate frames:</label>
                    <span className='dup'>'dup frames'</span>

                    <label className='dropLabel'>Dropped frames:</label>
                    <span className='drop'>'dropped frames'</span>

                </article>

            </section>
        </main>
    );
}

export default Processing;