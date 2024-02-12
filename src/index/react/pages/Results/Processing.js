// 

// React
import React, { useEffect } from 'react';

// Styling
import './Processing.css';

function Processing (props) {

    // == USE EFFECT

    // Mount
    useEffect(() => {
        removeHidden();
    });

    // == FUNCTIONS

    // Removes hidden class from Processing
    async function removeHidden () {
        const contentSectionWrapper = document.querySelector('.contentSectionWrapper');
        console.log('test wait');
        await (() => {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, 1);
            });
        })()  
        console.log('done waiting');
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
            // console.log('Listener status:');
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

            </section>
        </main>
    );
}

export default Processing;