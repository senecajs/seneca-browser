# seneca-browser

# Project Title
This project lets you use the power of Seneca within your browser.
The server will only accept certain Seneca pattern types on the backend and will give
errors if you send it anything that isn't preconfigured.

The frontend is using Vue Cli.
We tell Vue to use Seneca in the browser and add it to Vue Instance.
When we load up the frontend we can initialise specific patterns as the Vue app loads up.

The frontend itself is broken down into components.

The root components which only use seneca are:
Red ~ Green ~ Blue

These root components are used to initialise patterns and pass actions.

There is also a child component called BabyBlue and this component uses only Vue js.

The child components may be parents to other components in the future but they can also get data
passed to them from the root components.
## Getting Started

Clone this repository or download the zip.

Once the repository has finished downloading open the project folder within your favourite editor.

Next open two terminals and make sure you are the root user.

In the first terminal navigate to seneca-browser/smoke/SenecaVueCli

Once you have navigated to this directoyr enter:

npm install

We want to install all the packages needed to make Vue run.

Then once this has finished enter:

npm run build

This will take all your .vue files, css and everything else and mash it all together
and spit it out into files in your dist folder.

This will then be loaded into the index.html in our dist folder.

Everytime you make any changes to the frontend you will need to run

npm run build

to rebuild your dist folder and serve the new code.

Within our server.js file we make it render the index.html located here by pointing it
to the ../smoke/SenecaVueCli/dist/ folder.


In the second terminal navigate to seneca-browser/

npm install all the needed packages

After this finishes cd into the smoke directory to where the server.js file is located

Then run node -v to check if you have node installed. If it returns a version number your good to go.

Mine is v8.4.0

After you check this enter:

node server.js

Let this run in this terminal, then open your browser to http://localhost:8080/

As you can hopefully see this will load up a webpage.
