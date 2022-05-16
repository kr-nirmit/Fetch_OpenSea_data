const Web3 = require('web3');
const web3 = new Web3('https://nd-823-053-271.p2pify.com/326bf6c5abd0336070e9a4d749e8c0ad');
const contractAddress = '0x7f268357A8c2552623316e2562D90e642bB538E5';
console.log("🚀 ~ file: datafetch.js ~ line 3 ~ contractAddress", contractAddress)
const contractAbi = require('./exchange.json');
const contract = new web3.eth.Contract(contractAbi, contractAddress);

const axios = require('axios');

const mainLoop = async () => {
    console.log("🚀 ~ file: fetchContract.js ~ line 3 ~ mainLoop ~ mainLoop Start")
    
    try {
        let event = 'OrdersMatched';
        let toBlock = await web3.eth.getBlockNumber();
        console.log("🚀 ~ file: fetchContract.js ~ line 16 ~ mainLoop ~ toBlock", toBlock)
        let fromBlock = toBlock - 1;
        console.log("🚀 ~ file: fetchContract.js ~ line 18 ~ mainLoop ~ fromBlock", fromBlock)

        for (fromBlock; fromBlock < toBlock; fromBlock++) {
            let events = await contract.getPastEvents(event, {
                fromBlock, 
                toBlock
            });
            console.log("🚀 ~ file: fetchContract.js ~ line 27 ~ mainLoop ~ events", events.length)
            console.log("🚀 ~ file: fetchContract.js ~ line 27 ~ mainLoop ~ event", events[0])

            for (let i = 0; i < 1; i++) {

                // s.log("🚀 ~ file: fetchdata.js ~ line 35 ~ mainLoop ~ toAddress", toAddress)

                let data = JSON.stringify({
                    "jsonrpc": "2.0",
                    "id": 0,
                    "method": "alchemy_getAssetTransfers",
                    "params": [
                      {
                        "fromBlock": "14778378",
                      }
                    ]
                  });
                console.log("🚀 ~ file: fetchdata.js ~ line 42 ~ mainLoop ~ data", data)
                  
                    var requestOptions = {
                      method: 'post',
                      headers: { 'Content-Type': 'application/json' },
                      data: data,
                    };
                  
                    const apiKey = "demo"
                    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}`;
                    const axiosURL = `${baseURL}`;
                  
                    axios(axiosURL, requestOptions)
                      .then(response => console.log(JSON.stringify(response.data, null, 2)))
                      .catch(error => console.log(error));

            }
        }

    } catch (error) {
            console.log("🚀 ~ file: fetchContract.js ~ line 32 ~ mainLoop ~ error", error)
    }
};

mainLoop();