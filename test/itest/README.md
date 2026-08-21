# Integration Testing
This directory contains the integration tests for **accounts-filing-web**.  The goal of these tests, in contrast to conventional unit tests, is to provide a much higher level validation of the whole user journey from the IDE.  When ran, these tests passing should offer the promise that if you were to start up the service in docker then you would be able to complete the journey without error. It is hoped this will speed up the inner dev loop which previously would have to wait on a, sometimes long, docker startup delay.  Note that if external services public api's change this promise can no longer be guaranteed until the mocking is updated.


## Running the tests
The tests can be ran with
```sh
npm run test:ispec
```
They can be ran continuously, re-running every save, with
```sh
npm run test:ispec:watch
```


## High-level Design Ethos
The tests have been written with the [jest](https://jestjs.io/) testing framework, that we normally use for unit tests, augmented with [supertest](https://www.npmjs.com/package/supertest).  This will hopefully limit the overhead of learning a new framework.  The two most critical differences between integration tests and the unit tests are:
- All testing is done by **calling the exposed endpoints directly** and validating their responses/side effects
- An absolute **minimum mocking** required to perform the test is allowed

These 2 guiding principles help make these tests far less [Brittle](https://softwareengineering.stackexchange.com/a/460811) than unit tests can be.  That is: the failures of these integration tests mark that some aspect of the journey or core state has changed.  For instance these tests should still pass after a complete re-write of the codebase so long as the limited mocking was updated & user-facing behavior was the same after the change (Where conversely for unit test we would expect that we would need to write a whole new suite after such a change!).


## Writing new tests & Making changes
When writing new tests or changing old ones bear in mind the following rules:
- Only mock external services - that is services in the [src/services/external](/src/services/external) directory, middleware that makes external calls & anything to do with persiting data (session/db etc)
- Tests should be in a file & outer `describe` block describing the user journey under test
- Integration test files have the suffix `.ispec.ts`
- Each page should have a `describe` block bearing the URL of the page under test
- Within the test-describe block:
  - A single instance of [`ITestPageRequester`](/test/itest/helpers/request_helper.ts) should be instantiated to manage the supertest requests
  - Any mocks needed should be created inside the `add_mocks` function of [`ITestPageRequester`](/test/itest/helpers/request_helper.ts)
  - Any session state relied on should be built within a `beforeEach` block inside the test describe block
  - Any properties expected to persist non-behavioral code changes should be tested e.g. page loading, connection to next page & core page content (e.g. POST request button)
  - Any changes to persistent storage should be verified (so that they may then be mocked for the next page)

What should not be included in tests:
- Mocks of any code possible to test directly (as every section of code mocked and not ran weakens the promise the tests make about the code as-a-whole working)
- Verification of content (e.g. do not check the page title - this is brittle and better tested in a unit test)
- Over specific url RegEx (e.g. he regex for the url `/foo/bar&lang=en` should be `/foo/bar.*` and not include the `lang=en` as this introduces unnecessary risk of the tests failing without the journey breaking.  Again this sort of property should be tested in unit test/by the test team)
- If writing regex to validate page content/urls watch out for [Catastrophic Backtracking](https://medium.com/bigpanda-engineering/catastrophic-backtracking-the-dark-side-of-regular-expressions-80cab9c443f6) as this can be easy to introduce when trying to make sure the regex is general enough to not cause false failures & can stall the pipeline.

See also:
- The list of available [asserts](/test/itest/helpers/itest_assersions.ts)
- The list of available [mocks](/test/itest/helpers/itest_mocks.ts)
- The predefined [test data](/test/itest/test_data.ts)

## Framework notes
Despite my attempts to keep this project small there is what amounts to a small test-framework worth of utilities provided and as such I have included this section in case they ever need work

### Assertions
The assertions work by calling jest's `it` function inside them.  Because they are resolved synchronously & the describe block is still open when `it` is called they are correctly associated with the test-describe block for the page under test.  Though perhaps a little unclear this wrapping was the recommended method for making utility functions for testing common behavior in multiple places & other considered solutions had worse tradeoffs.

### Mocks
The mocking ended up being reasonable complex.  Because other areas of the testing (in the unit tests) have mocks that mock an entire module in global scope & because we need some functions to only be mocked some of the time it was necessary to resort to [`jest.isolateModules`](https://jestjs.io/docs/jest-object#jestisolatemodulesfn) in `ITestPageRequester` to build a parallel module registry.  Whilst this does incur a minor overhead (measured to be on the order of single digit ms) it iis one of the only ways to sidesteps the mocking overreach that is present in global scope.  The only other reasonable alternative is to make the integration tests ran in a separate process loaded with a different tsconfig however that would be even more heavy handed and so this solution was selected.

One side effect of this importing solution is that it was necessary to use commonJS-style `require` rather than ESM's `import` for the mocks (for which the helper function [`synchronously_import_module`](/test/itest/helpers/itest_mocks.ts) was provided) as if imported at the top of the test file this provides a reference to global scope, not `isolateModules` scope, making it unsuitable for mocking in most cases.  Additionally ESM dynamic imports could not be used as the are asynchronous and thus require a chain of `async-awaits`.  This ended up being impossible as the most readable tests resulted from the module importing occurring within the PageRequester constructor - which is not allowed to be `async`.
