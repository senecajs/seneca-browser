# seneca-browser

This repository shows us how we can use Seneca pin, patterns & actions within the frontend of your application. We define what we want to pass on the frontend and listen for certain pin's on the backend.

The frontend of Seneca-Browser is built in [Vue.js](https://vuejs.org/) with [Vue Cli ](https://github.com/vuejs/vue-cli) but you could use it with pretty much anything. Within the main.js file we tell Vue to use Seneca and then pass it into the Vue object.

This lets us access Seneca from within any Vue component and call actions or define patterns within the frontend.

We use Vue lifecycle hooks to initialize our patterns as the app loads up in the browser.

* The <font color="green">green</font>
and <font color="blue">blue</font> components each have a single pattern loaded that is defined in their lifecycle hooks.

* The <font color="red">red</font> component has two methods which contain Seneca actions.

* These two actions target the patterns which were initialized in the <font color="green">green</font>
and <font color="blue">blue</font> components as our app loaded.

__This provides the seneca browser functionality.__


## How it works

On the frontend we pass all actions of __a:*__ & __b:*__ to the backend client.


```sh
.client({type:'browser', pin:'a:*'})
.client({type:'browser', pin:'b:*'})
```

On our backend we listen for

```sh
.listen({type:'browser', pin:'a:*'})
.listen({type:'browser', pin:'b:*'})
```

## Running from the terminal

To run this from the terminal

Within the __seneca-browser__ folder


  ```sh
  $ npm install
  ```

Within __/smoke/SenecaVueCli__ folder

```sh
$ npm install
$ npm run build
```

Then navigate to __/smoke__ folder


```sh
node server.js
```
