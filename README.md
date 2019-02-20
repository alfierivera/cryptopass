## Install dependencies
`npm i`

## Recompile the contract
`truffle compile`

## Deploy/Migrate & link it to the UI the contract
`truffle deploy`
Grab the contract ID and paste it on `src/app/services/web3.service.ts:21`


## Run the UI
`npm start`

Navigate to your browser to `http://localhost:4200`. Please use a browser with no Metamask integration for the UI to pull the local ganache instance

## That's it!
Enjoy :)