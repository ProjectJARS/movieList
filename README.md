# movieList

A web app helping users to keep a track of movies they have seen or want to see or share movie recommendations with friends

# Pre Requisits
1) Node Js must be installed.

Run npm install inside the root folder before starting the project.

# npm start
To start the project. It runs the script nodemon start using nodemon

# MVC Achitecture
Directory system based on NodeJS MVC architecture.
<ul>
  <li><i>app.js</i> is the routes file. All routing will take place from here.</li>
  <li>The <i>/routes</i> directory is the controller directory. We will find <i>trailHomePage.js</i>, which is one of the controller.</li>
  <li>In the <i>/models</i> directory we will have all the routines and functions. A seperate directory is needed because different controllers might need the same function</li>
  <li>All HTML based files are <i>.ejs</i> based inorder to make them dynamic. All of these are present in <i>/views</i>.</li>
  <li>All CSS,scripts,images,etc will be located in <i>/public</i> directory</li>
</ul>
<br>
Example code has already been uploaded. Please refer to it for help in order to understand the MVC architecture.
