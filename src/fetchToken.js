const Web3 = require('web3');
const web3 = new Web3('https://nd-823-053-271.p2pify.com/326bf6c5abd0336070e9a4d749e8c0ad');
const tokenAddress = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52';
const tokenAbi = require('./erc20token.json');

const contract = new web3.eth.Contract(tokenAbi, tokenAddress);

const mainLoop = async () => {
    // console.log("🚀 ~ file: fetchToken.js ~ line 7 ~ contract", contract)
    const token = await contract.methods.name().call();
    console.log("🚀 ~ file: fetchToken.js ~ line 9 ~ token", token)

    const symbol = await contract.methods.symbol().call();
    console.log("🚀 ~ file: fetchContract.js ~ line 54 ~ mainLoop ~ symbol", symbol)
    
    const decimal = await contract.methods.decimals().call();
    console.log("🚀 ~ file: fetchContract.js ~ line 54 ~ mainLoop ~ decimal", decimal)
}

mainLoop();