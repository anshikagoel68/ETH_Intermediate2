// Import the ethers library
const ethers = require('ethers');


const contractABI = [
  [
	{
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "initBalance",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "withdrawAmount",
				"type": "uint256"
			}
		],
		"name": "InsufficientBalance",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Deposit",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_withdrawAmount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdraw",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "balance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
    
];


const contractAddress = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;

async function getProvider() {
    if (window.ethereum) {
        // Connect to the Ethereum provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // Request account access
        return provider;
    } else {
        alert('Please install MetaMask!');
    }
}

async function getContract() {
    const provider = await getProvider();
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
}

async function getBalance() {
    const contract = await getContract();
    const balance = await contract.getBalance();
    document.getElementById('balance').innerText = 'Balance: ' + ethers.utils.formatEther(balance) + ' ETH';
}

async function deposit() {
    const amount = document.getElementById('depositAmount').value;
    const contract = await getContract();
    const tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
    await tx.wait(); // Wait for the transaction to be mined
    alert('Deposit successful!');
    getBalance();
}

async function withdraw() {
    const amount = document.getElementById('withdrawAmount').value;
    const contract = await getContract();
    try {
        const tx = await contract.withdraw(ethers.utils.parseEther(amount));
        await tx.wait(); // Wait for the transaction to be mined
        alert('Withdrawal successful!');
    } catch (error) {
        alert('Error: ' + error.message);
    }
    getBalance();
}
