# How to run the project

Note: you must have mongodb installed before proceeding

In one terminal, run mongodb with command `mongod`

In another terminal, go to project directory and run `npm install`

To build the project, run `npm run build` and to build the css run `npm run build-css`

To run the project, run `npm run start`

## Implementation details
- Data store: mongodb
- Tech stack used: MongoDB, Express, ES6, Mongoose, HTML, Sass
- The front end form is only used to test the functionality of the APIs and not for actual use

## Additional features (future)
- Ability to edit data store
- Suggestions to search similar anagrams from user history
- Autocorrect/notifications if entry is spelled incorrectly
- Ability to sort data store

## Design overview and trade-offs
- Modular architecture for ease of making changes
- MVC architecture
- Query to add words has a very specific format, which added time to check the input from the backend
- All methods with an input have multiple checks, which added time to check the input from the backend
- POST methods use native form functionality. This does take the user to a new page on submit but the native form functionality was smoother than other methods
- Other methods used xmlhttprequest because they were either not supported by native form or the data was being shown on the same page as the input
- Tradeoff: Specific input format added complexity to the backend, which added time to carry out function
