### Build project
- npm i
- npm run build

### Run project [ DEV MODE ]
- npm run dev

### Run project [ PROD MODE ]
- npm run start

### Run Test
- npm run test
- npm run test-watch

### Build and Run project [ DOCKER ]
- make up
- make up-prod

### CONFIG
- port : 4000
- gql playground : /graphql

### Folder Structure

    .
    ├── dist                    # Compiled files
    ├── src                     # Source files
    │   ├── index.ts                # main file
    │   ├── server.ts               # server declaration
    │   ├── graphql                 # graphql schemas
    │   └── mongodb                 # mongodb connection and models
    ├── test                    # Automated tests
    └── README.md
