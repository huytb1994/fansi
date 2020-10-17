$(document).ready(function () {
  let abi = "[\r\n  {\r\n    \"inputs\": [\r\n      {\r\n        \"internalType\": \"contract IERC20\",\r\n        \"name\": \"_token\",\r\n        \"type\": \"address\"\r\n      },\r\n      {\r\n        \"internalType\": \"uint256\",\r\n        \"name\": \"_rate\",\r\n        \"type\": \"uint256\"\r\n      }\r\n    ],\r\n    \"payable\": false,\r\n    \"stateMutability\": \"nonpayable\",\r\n    \"type\": \"constructor\"\r\n  },\r\n  {\r\n    \"anonymous\": false,\r\n    \"inputs\": [\r\n      {\r\n        \"indexed\": true,\r\n        \"internalType\": \"uint256\",\r\n        \"name\": \"ethWeiValue\",\r\n        \"type\": \"uint256\"\r\n      },\r\n      {\r\n        \"indexed\": true,\r\n        \"internalType\": \"uint256\",\r\n        \"name\": \"rate\",\r\n        \"type\": \"uint256\"\r\n      }\r\n    ],\r\n    \"name\": \"TkSale\",\r\n    \"type\": \"event\"\r\n  },\r\n  {\r\n    \"payable\": true,\r\n    \"stateMutability\": \"payable\",\r\n    \"type\": \"fallback\"\r\n  },\r\n  {\r\n    \"constant\": true,\r\n    \"inputs\": [],\r\n    \"name\": \"admin\",\r\n    \"outputs\": [\r\n      {\r\n        \"internalType\": \"address\",\r\n        \"name\": \"\",\r\n        \"type\": \"address\"\r\n      }\r\n    ],\r\n    \"payable\": false,\r\n    \"stateMutability\": \"view\",\r\n    \"type\": \"function\"\r\n  },\r\n  {\r\n    \"constant\": false,\r\n    \"inputs\": [\r\n      {\r\n        \"internalType\": \"uint256\",\r\n        \"name\": \"amount\",\r\n        \"type\": \"uint256\"\r\n      }\r\n    ],\r\n    \"name\": \"buyTk\",\r\n    \"outputs\": [\r\n      {\r\n        \"internalType\": \"uint256\",\r\n        \"name\": \"\",\r\n        \"type\": \"uint256\"\r\n      }\r\n    ],\r\n    \"payable\": true,\r\n    \"stateMutability\": \"payable\",\r\n    \"type\": \"function\"\r\n  },\r\n  {\r\n    \"constant\": false,\r\n    \"inputs\": [\r\n      {\r\n        \"internalType\": \"address\",\r\n        \"name\": \"_admin\",\r\n        \"type\": \"address\"\r\n      }\r\n    ],\r\n    \"name\": \"changeAdmin\",\r\n    \"outputs\": [],\r\n    \"payable\": false,\r\n    \"stateMutability\": \"nonpayable\",\r\n    \"type\": \"function\"\r\n  },\r\n  {\r\n    \"constant\": true,\r\n    \"inputs\": [],\r\n    \"name\": \"rate\",\r\n    \"outputs\": [\r\n      {\r\n        \"internalType\": \"uint256\",\r\n        \"name\": \"\",\r\n        \"type\": \"uint256\"\r\n      }\r\n    ],\r\n    \"payable\": false,\r\n    \"stateMutability\": \"view\",\r\n    \"type\": \"function\"\r\n  },\r\n  {\r\n    \"constant\": false,\r\n    \"inputs\": [\r\n      {\r\n        \"internalType\": \"uint256\",\r\n        \"name\": \"_rate\",\r\n        \"type\": \"uint256\"\r\n      }\r\n    ],\r\n    \"name\": \"setRate\",\r\n    \"outputs\": [],\r\n    \"payable\": false,\r\n    \"stateMutability\": \"nonpayable\",\r\n    \"type\": \"function\"\r\n  },\r\n  {\r\n    \"constant\": false,\r\n    \"inputs\": [\r\n      {\r\n        \"internalType\": \"uint256\",\r\n        \"name\": \"amount\",\r\n        \"type\": \"uint256\"\r\n      },\r\n      {\r\n        \"internalType\": \"address payable\",\r\n        \"name\": \"sendTo\",\r\n        \"type\": \"address\"\r\n      }\r\n    ],\r\n    \"name\": \"withdrawEther\",\r\n    \"outputs\": [],\r\n    \"payable\": false,\r\n    \"stateMutability\": \"nonpayable\",\r\n    \"type\": \"function\"\r\n  }\r\n]";

  let address = '0x6b95789673b70ec62edb70C5bD60d1e85e587C70';

  new Vue({
    el: '#sale',
    data: {
      ethereum: window.ethereum,
      rate: 0,
      contract: null,
    },
    mounted: function () {
      if (this.ethereum) {
        const web3 = new Web3(this.ethereum);
        this.contract = new web3.eth.Contract(JSON.parse(abi), address);
        this.contract.methods.rate().call().then(rate => {
          this.rate = rate
        });
      }
    },
    methods: {
      connect: async function () {
        const accounts = await this.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        this.buyTk(account);
      },
      buyTk: function (wallet) {
        let ethValue = 1;
        let options = { from: wallet, value: ethValue };
        let methodCall = this.contract.methods.buyTk(ethValue);
        methodCall.estimateGas(options)
          .then(function (gasAmount) {
            options.gas = gasAmount;
          })
          .then(() => {
            methodCall.send(options)
              .then(result => console.log(result))
          }
          )
          .catch(function (error) {
            console.log(error);
          });
      }
    }
  })
})