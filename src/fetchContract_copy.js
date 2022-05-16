const Web3 = require('web3');
const web3 = new Web3('https://nd-823-053-271.p2pify.com/326bf6c5abd0336070e9a4d749e8c0ad');
const contractAddress = '0x7f268357A8c2552623316e2562D90e642bB538E5';
console.log("🚀 ~ file: datafetch.js ~ line 3 ~ contractAddress", contractAddress)
const contractAbi = require('./exchange.json');
const tokenAbi = require('./erc20token.json');
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
            console.log("🚀 ~ file: fetchContract.js ~ line 27 ~ mainLoop ~ event", events)
            console.log("🚀 ~ file: fetchContract.js ~ line 27 ~ mainLoop ~ events", events.length)

            for (let i = 0; i < events.length; i++) {
                const maker = events[i].returnValues.maker;
                console.log("🚀 ~ file: fetchContract.js ~ line 31 ~ mainLoop ~ maker", maker)
                
                const taker = events[i].returnValues.taker;
                console.log("🚀 ~ file: fetchContract.js ~ line 33 ~ mainLoop ~ taker", taker)
                
                const price = events[i].returnValues.price;
                console.log("🚀 ~ file: fetchContract.js ~ line 33 ~ mainLoop ~ price", price)
                
                const transactionHash = events[i].transactionHash;
                
                let transactionReceipt = await web3.eth.getTransactionReceipt(transactionHash);
                let transactionLogs = transactionReceipt.logs;
                
                for (let j = 0; j < transactionLogs.length; j++) {
                    let tokenAddress = transactionLogs[j].address;
                    
                    if (tokenAddress != '0x7f268357A8c2552623316e2562D90e642bB538E5') {
                        console.log("🚀 ~ file: fetchContract.js ~ line 37 ~ mainLoop ~ tokenAddress", tokenAddress)
                        
                        try {
                            const contract = new web3.eth.Contract(tokenAbi, tokenAddress);
                            
                            const tokenName = await contract.methods.name().call();
                            console.log("🚀 ~ file: fetchContract.js ~ line 53 ~ mainLoop ~ tokenName", tokenName)
                            
                            const symbol = await contract.methods.symbol().call();
                            console.log("🚀 ~ file: fetchContract.js ~ line 54 ~ mainLoop ~ symbol", symbol)

                            const decimal = await contract.methods.decimals().call();
                            console.log("🚀 ~ file: fetchContract.js ~ line 54 ~ mainLoop ~ decimal", decimal)
                                                   
                        } catch (error) {
                            console.log("🚀 ~ file: fetchContract.js ~ line 60 ~ mainLoop ~ error", error)
                            // if (error) {
                            //     break;
                            // }
                        }  
                    }
                }
                
            }
        }
        
        // const csvdata = fetchOpenSeaData(events);

    } catch (error) {
        console.log("🚀 ~ file: fetchContract.js ~ line 32 ~ mainLoop ~ error", error)
    }
};

const fetchOpenSeaData = async (data) => {
    console.log("🚀 ~ file: fetchContract.js ~ line 37 ~ csvmaker ~ data", data.length)
    for (let i = 0; i < data.length; i++) {
        const baseURL = `https://api.opensea.io/wyvern/v1/orders`;
        const maker = data[i].returnValues.maker;
        const bundled = 'false';
        const include_bundled = 'false';
        const side = '1';

        var config = {
            method: 'get',
            url: `${baseURL}?maker=${maker}&bundled=${bundled}&include_bundled=${include_bundled}&side=${side}`,
            headers: {
                Accept: 'application/json', 
                'X-API-KEY': 'a4ae018e538740d497788e64e819bd48'
            }
        };
        console.log("🚀 ~ file: fetchContract.js ~ line 53 ~ fetchOpenSeaData ~ url", data[i].returnValues.buyHash)
        console.log("🚀 ~ file: fetchContract.js ~ line 54 ~ fetchOpenSeaData ~ url", data[i].returnValues.sellHash)
        console.log("🚀 ~ file: fetchContract.js ~ line 55 ~ fetchOpenSeaData ~ url", config.url)
        
        await axios(config)
        .then(async response => {
            const data = response.data.orders;
            console.log("🚀 ~ file: fetchContract.js ~ line 58 ~ fetchOpenSeaData ~ data", data)
            for (let i = 0; i < data.length; i++) {
                const orderHash = data[i].order_hash
                console.log("🚀 ~ file: fetchContract.js ~ line 58 ~ fetchOpenSeaData ~ orderHash", orderHash)
            }
        })
        .catch(error => {
            console.log('Failed to fetch OpenSea Data');
        });
    }
}

mainLoop();