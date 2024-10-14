<h1>Video Splitter</h1>
<h2>Description</h2>
<p>A simple app for dividing large videos into smaller, more manageable clips.</p>
<p>It leverages Ffmpeg to achieve this, providing feedback on progress and speed while processing occurs</p>

<h2>Installation</h2>
<p>Download the latest version of <a href="https://github.com/jamclean23/video-splitter/releases">Video Splitter</a>.</p> <p>Application is portable and self contained.</p>

<h2>Usage</h2>
<ol>
	<li>Choose your input file, output location, and number of clips<br><br><img height=300 alt="first-screen" src="https://raw.githubusercontent.com/jamclean23/video-splitter/refs/heads/main/readme_assets/screen-1.jpg"/><br><br></li>
    <li>Click Process<br><br><img height=300 alt="second-screen" src="https://raw.githubusercontent.com/jamclean23/video-splitter/refs/heads/main/readme_assets/screen-2.jpg"/><br><br></li>
    <li>When processing is complete, you can open the output folder to view your clips<br><br><img height=300 alt="third-screen" src="https://raw.githubusercontent.com/jamclean23/video-splitter/refs/heads/main/readme_assets/screen-3.jpg"/><br><br></li>
</ol>

<h2>Compiling (Windows)</h2>
<ol>
    <li>Clone this repo</li>
    <li>In the terminal: npm i</li>
    <li>Download Ffmpeg from <a href="https://www.gyan.dev/ffmpeg/builds/">https://www.gyan.dev/ffmpeg/builds</a>, and extract with 7Zip</li>
    <li>Rename the extracted folder to "ffmpeg" (The folder structure should be ffmpeg -> bin)</li>
    <li>Place the ffmpeg folder in the lib folder of the repository<br><br><img scr="https://raw.githubusercontent.com/jamclean23/video-splitter/refs/heads/main/readme_assets/lib-structure.jpg"/><br><br></li>
    <li>In the terminal: npm run buildStandalone</li>
    <li>The executable will be in the dist folder</li>
</ol>