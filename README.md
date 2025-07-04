# springs-data
simple web map for our springs data viewer. 

Web map is live here: https://wgnhs.github.io/springs-data/


It is embedded in the overall application: http://uwex.maps.arcgis.com/apps/MapSeries/index.html?appid=5f3157d4ba6049edb4964568f6ab1ff9&entry=3


## Development
This project requires [NodeJS 8+](https://nodejs.org/) installed on your development system. We recommend using the latest LTS version.

### Setup
```
npm ci
```
After cloning the repository, bring up a terminal in the repository's root directory and run `npm ci` to download the dependencies.

### Running
```
npm start
```
The `npm start` command is configured to build the project, then serve the project 
at `http://localhost:8080`

The server will watch for source changes and automatically refresh the browser.


### Building
```
npm run build
```
The distributable folder `dist/` can be generated by runnning `npm run build`


### Publishing GitHub Pages
```
npm run pages
```
The command `npm run pages` will build the source code, and commit the `dist/` folder to the `gh-pages` branch of the repository. It will also `push` the branch to the git remote named `origin`
