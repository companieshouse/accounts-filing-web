# accounts-filing-web
A web frontend for the account filing service, allowing users to submit accounts by uploading a zip file.

## Node Versions

- Before downloading and installing this project, ensure you have Node version `24` installed on your device.

- If you use multiple Node versions across projects, install the Node Version Manager (NVM) to switch versions easily.

- Visit [this resource](https://github.com/nvm-sh/nvm) to learn more about NVM, and how to install and switch between Node versions.

## Downloading and Installing

Having cloned the project, run the following commands:

``` cd accounts-filing-web```

```npm install```

From your docker-chs-development directory run:-

``` ./bin/chs-dev modules disable accounts-filing ```

``` ./bin/chs-dev modules enable accounts-filing ```

This will detect accounts-filing-web service, allowing you to ```chs-dev up``` and access the
service via the following prefix, ```http://chs.local/persons-with-significant-control```, 
followed by a given endpoint. e.g. ```/start```.

### Config Set-up

- The web-starter uses environment variables for configuration.

- You will need to tweak some values in `.env` to suit your local set up e.g. port number, hostname, etc if running the project locally.

- Of particular note is the `CDN_HOST` value. You may:
    - leave it empty to use locally built assets, or
    - use the `staging` or `prod` value to gain access to assets not available in your local environment e.g. vendor specific libraries like jQuery (this is because the `govuk-frontend` and `govuk_frontend_toolkit` npm packages do not ship with vendor specific libraries).
    - You can get the production value from the Platform Team or by viewing the page source of the [DevHub](https://developer.company-information.service.gov.uk/) page.
    - At the time of writing, this value is `//drv45oe4qnhl0.cloudfront.net` but can change at any time. Always ensure you have the most recent value when using it.

### Running the Tests

To run the tests, type the following command:

``` npm test ```

To get a summarised test coverage report, run:

```npm run coverage```

For a detailed test coverage report, run one of the following commands:

```npm run coverage:report```

or

```npm run test:coverage```

For these tests, we've used [Mocha](http://mochajs.org/) with [Sinon](http://sinonjs.org/) and [Chai](http://chaijs.com/).

### Running the App locally

To start the application, run:

``` npm start ```

or, to watch for changes with auto restart in your dev environment, run:

``` npm run start:watch ```

...and navigate to http://localhost:8090/ (or whatever hostname/port number combination you've changed the config values to)

_**A few quick notes below about the warnings you get when you start the app:**_

- Presently, when you start the app, you will see a bunch of deprecation warnings from the SASS compiler. These come from the`govuk-frontend` package that has not yet been updated to match the latest SASS guidelines.
- The `govuk-frontend` team are aware of this problem and have an issue pending [here](https://github.com/alphagov/govuk-frontend/issues/2238)
- So, for now, given that these warnings do not stop a successful build from happening, please **ignore** them until such a time when the package is updated with a fix.

## Additional Notes

### 1. General Application Architecture

- We've opted for the Model-View-Controller design pattern that provides a clear separation of concerns, if executed correctly. This ensures that the task of scaling to a very large codebase with a small or large team(s) remains simple, transparent and minimises source bloat.
- In Node.js parlance, a controller is commonly referred to as a "router" and a controller action is called a "handler". In this starter, we use the "routers" and "handlers" naming convention as opposed to "controllers" and "actions".
- There's a router dispatch file (`./src/router.dispatch.js`) where all router dispatch is handled i.e. incoming request routes are mapped to their pertinent routers, and consequently to the handler designed to handle that route.
- We have incorporated the concept of "atomic" handlers where all the handler logic will be neatly tucked away in separate modules without crowding out the primary router file. It also means that different developers can work on the similarly grouped tasks in the same router with little or no versioning conflicts!
- A similar approach to this is router helpers which contain routines and methods that you'd rather see obscured from the primary router file. Router helpers, if desired, can be created as a sub-folder within the main router folder, however, it might be sufficient to add all your helpers to the generic handler (`./src/routers/handlers/generic.ts`) - which exposes common methods to all handlers - without the need to use the "utilities" approach.

### 2. Application Architecture: Creating a Router

- For every router created in the routers folder (`./src/routers`), the following actions should follow:
- a corresponding sub-folder with a similar name to the router should be created in the handlers directory (`./src/routers/handlers`). All atomic handlers for this router will be housed here,
- a corresponding sub-folder with a similar name to the router should be created in the `router_views` directory (`./src/views/router_views`). This sub-folder will be used store views for the router handlers. All view names in this sub-folder should be similarly named to match the handlers they represent,
- a corresponding SASS file with a similar name to the router should be created in the sass folder (`./assets/src/scss`). This file will be used for the sass styles associated with the views (or screens) of that router,
- a corresponding Javascript file with a similar name to the router should be created in the Javascript folder (`./assets/src/js`). This file will be used for writing the browser Javascript associated with the views (or screens) of that router.
- If you anticipate this router to have screens with forms (oir payloads) that require validation, you will need to create a corresponding validation file in `./src/lib/validation/formValidators`. Again, the filename should be similar to the router name.

### 3. Application Architecture: `__global.js` and `__global.scss`

- The file `./assets/src/js/__global.js` is a Javascript file where all the browser Javascript not associated with specific router screens (or views) is written. For example, the Javascript used to enhance navigation, or enhance the header or footer, etc.. will be kept here.

- There is also a library folder (`./assets/src/js/library`) where we save all logic that is best packaged as a library module. For example, you might want to wrap all cookie logic in a single module and save it in the library folder.

- On the other hand, `./assets/src/scss/__global.scss` is a SASS file that is used to house all css style that are not associated to specific router views. For example global nav styles, or footer styles, or anything else that cuts across the service should be written here.

- The partials folder (`./assets/src/scss/partials`) could be used to a similar end - feel free to use either or both - just be mindful to exercise a reasonable degree of judiciousness while doing so.

### 4. Application Architecture: Error Handling

- In the event of errors, the handler will populate the view object (`this.viewData.errors`) with the errors thrown. For validation errors, the entire error stack will be added in this field, however, in the event of non-validation errors, this field will be populated with a generic error message.

- The view partial for errors (`./src/views/partials/error_summary.njk`) is included in every page and will only display any errors that occurred during processing at the top of the page.

- Additionally, the generic error partial (`./src/views/partials/error.njk`) can be used to display an unknown error on a separate page without any additional page content.

### 5. Unit Testing

- This starter kit uses Mocha, Chai and Sinon which have long been the gold standard for writing tests for Node.js apps. Another decent option is [Jest](https://jestjs.io).

### 6. Coding Standards

- Companies House follows the [StandardJS](https://standardjs.com/) coding conventions for both JavaScript and Typescript. Details about these guidelines are documented internally [here](https://github.com/companieshouse/styleguides/blob/main/javascript_node.md).

### 7. FAQ

#### `Question 1:` For Error: ENOENT: no such file or directory, scandir?
#### Run in console `npm run rebuild-sass`