import { task, HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv"
import { promises as fs } from "fs";

import { getAbi } from './abi';

dotenv.config();

export function stringValue(value: string | null | undefined) {
  if (value) {
      return value;
  } else {
      return "";
  }
}

export function numberValue(value: string | null | undefined) {
  if (value) {
      return parseInt(value);
  } else {
      return 0;
  }
}

task("erc20", "Deploy ERC20 Token sample to chain")
    .addOptionalParam("contract", "ERC20 Token contract")
    .addParam("name", "ERC20 Token name")
    .addParam("symbol", "ERC20 Token symbol")
    .setAction(async (taskArgs: any, { ethers, network }) => {
        const contractName = taskArgs.contract ? taskArgs.contract : "ERC20Example";
        const erc20Factory = await ethers.getContractFactory(contractName);
        const erc20 = await erc20Factory.deploy(taskArgs.name, taskArgs.symbol);
        console.log("ERC20 Token with name", taskArgs.name, "and symbol", taskArgs.symbol, "was deployed");
        console.log("Address:", erc20.address);
        const jsonObj: {[str: string]: any} = {};
        jsonObj.erc20_address = erc20.address;
        jsonObj.erc20_abi = getAbi(erc20.interface);
        await fs.writeFile("data/" + contractName + "-" + taskArgs.name + "-" + network.name + ".json", JSON.stringify(jsonObj, null, 4));
    }
);

task("erc20-wrap", "Deploy ERC20 Wrap Token sample to chain")
    .addOptionalParam("contract", "ERC20 Token contract")
    .addParam("name", "ERC20 Token name")
    .addParam("symbol", "ERC20 Token symbol")
    .addParam("wrap", "ERC20 wrapping token")
    .setAction(async (taskArgs: any, { ethers, network }) => {
        const contractName = taskArgs.contract ? taskArgs.contract : "ERC20Wrap";
        const erc20Factory = await ethers.getContractFactory(contractName);
        const erc20 = await erc20Factory.deploy(taskArgs.name, taskArgs.symbol, taskArgs.wrap);
        console.log("ERC20 Token with name", taskArgs.name, "and symbol", taskArgs.symbol, "and wrapping token", taskArgs.wrap, "was deployed");
        console.log("Address:", erc20.address);
        const jsonObj: {[str: string]: any} = {};
        jsonObj.erc20_wrap_address = erc20.address;
        jsonObj.erc20_wrap_abi = getAbi(erc20.interface);
        await fs.writeFile("data/" + contractName + "-" + taskArgs.name + "-" + network.name + ".json", JSON.stringify(jsonObj, null, 4));
    }
);

task("erc721", "Deploy ERC721 Token sample to chain")
    .addOptionalParam("contract", "ERC721 Token contract")
    .addParam("name", "ERC721 Token name")
    .addParam("symbol", "ERC721 Token symbol")
    .setAction(async (taskArgs: any, { ethers, network }) => {
        const contractName = taskArgs.contract ? taskArgs.contract : "ERC721Example";
        const erc721Factory = await ethers.getContractFactory(contractName);
        const erc721 = await erc721Factory.deploy(taskArgs.name, taskArgs.symbol);
        console.log("ERC721 Token with name", taskArgs.name, "and symbol", taskArgs.symbol, "was deployed");
        console.log("Address:", erc721.address);
        const jsonObj: {[str: string]: any} = {};
        jsonObj.erc721_address = erc721.address;
        jsonObj.erc721_abi = getAbi(erc721.interface);
        await fs.writeFile("data/" + contractName + "-" + taskArgs.name + "-" + network.name + ".json", JSON.stringify(jsonObj, null, 4));
    }
);

task("erc721meta", "Deploy ERC721 (with metadata) Token sample to chain")
    .addOptionalParam("contract", "ERC721 Token contract")
    .addParam("name", "ERC721 wMeta Token name")
    .addParam("symbol", "ERC721 wMeta Token symbol")
    .setAction(async (taskArgs: any, { ethers, network }) => {
        const contractName = taskArgs.contract ? taskArgs.contract : "ERC721MetaExample";
        const erc721Factory = await ethers.getContractFactory(contractName);
        const erc721 = await erc721Factory.deploy(taskArgs.name, taskArgs.symbol);
        console.log("ERC721 with metadata Token with name", taskArgs.name, "and symbol", taskArgs.symbol, "was deployed");
        console.log("Address:", erc721.address);
        const jsonObj: {[str: string]: any} = {};
        jsonObj.erc721meta_address = erc721.address;
        jsonObj.erc721meta_abi = getAbi(erc721.interface);
        await fs.writeFile("data/" + contractName + "-" + taskArgs.name + "-" + network.name + ".json", JSON.stringify(jsonObj, null, 4));
    }
);

task("erc1155", "Deploy ERC1155 Token sample to chain")
    .addOptionalParam("contract", "ERC1155 Token contract")
    .addParam("uri", "ERC1155 Base Token URI")
    .setAction(async (taskArgs: any, { ethers, network }) => {
        const contractName = taskArgs.contract ? taskArgs.contract : "ERC1155Example";
        const erc1155Factory = await ethers.getContractFactory(contractName);
        const erc1155 = await erc1155Factory.deploy(taskArgs.uri);
        console.log("ERC1155 Token with Base Token URI", taskArgs.uri, "was deployed");
        console.log("Address:", erc1155.address);
        const jsonObj: {[str: string]: any} = {};
        jsonObj.erc1155_address = erc1155.address;
        jsonObj.erc1155_abi = getAbi(erc1155.interface);
        await fs.writeFile("data/" + contractName + "-" + taskArgs.uri + "-" + network.name + ".json", JSON.stringify(jsonObj, null, 4));
    }
);

task("mint-erc20", "Mint ERC20 Token")
    .addParam("tokenAddress", "Address of ERC20 token")
    .addParam("receiverAddress", "Address of receiver")
    .addParam("amount", "Amount of tokens")
    .setAction(async (taskArgs: any, { ethers }) => {
        const contractName = "ERC20Example";
        const erc20Factory = await ethers.getContractFactory(contractName);
        const erc20 = erc20Factory.attach(taskArgs.tokenAddress);
        const amount = ethers.BigNumber.from(taskArgs.amount).mul(ethers.BigNumber.from(10).pow(18)).toString();
        const res = await(await erc20.mint(taskArgs.receiverAddress, amount)).wait();
        console.log("ERC20 Token at address:", taskArgs.tokenAddress);
        console.log("Minted tokens amount:", taskArgs.amount, "to address", taskArgs.receiverAddress);
        console.log("Gas spent:", res.gasUsed.toNumber());
    }
);

task("mint-erc721", "Mint ERC721 Token")
    .addParam("tokenAddress", "Address of ERC721 token")
    .addParam("receiverAddress", "Address of receiver")
    .addParam("tokenId", "Token ID of ERC721 Token")
    .setAction(async (taskArgs: any, { ethers }) => {
        const contractName = "ERC721Example";
        const erc721Factory = await ethers.getContractFactory(contractName);
        const erc721 = erc721Factory.attach(taskArgs.tokenAddress);
        const res = await(await erc721.mint(taskArgs.receiverAddress, taskArgs.tokenId)).wait();
        console.log("ERC721 Token at address:", taskArgs.tokenAddress);
        console.log("Minted tokenId:", taskArgs.tokenId, "to address", taskArgs.receiverAddress);
        console.log("Gas spent:", res.gasUsed.toNumber());
    }
);

task("mint-erc1155", "Mint ERC1155 Token")
    .addParam("tokenAddress", "Address of ERC1155 token")
    .addParam("receiverAddress", "Address of receiver")
    .addParam("tokenId", "Token ID of ERC1155 Token")
    .addParam("amount", "Token Amount of ERC1155 Token")
    .addOptionalParam("data", "Bytes data for minting Token")
    .addOptionalParam("batch", "Bytes data for minting Token")
    .setAction(async (taskArgs: any, { ethers }) => {
        const contractName = "ERC1155Example";
        const erc1155Factory = await ethers.getContractFactory(contractName);
        const erc1155 = erc1155Factory.attach(taskArgs.tokenAddress);
        const batch = taskArgs.batch ? true : false;
        const data = taskArgs.data ? taskArgs.data : "0x";
        let res = null;
        if (batch) {
          const tokenIds = JSON.parse(taskArgs.tokenId);
          const amounts = JSON.parse(taskArgs.amount);
          if (tokenIds.length !== amounts.length) {
            console.log("\n\n!!! Length of arrays should be equal !!!\n\n");
            return;
          }
          res = await(await erc1155.mintBatch(taskArgs.receiverAddress, tokenIds, amounts, data)).wait();
        } else {
          res = await(await erc1155.mint(taskArgs.receiverAddress, taskArgs.tokenId, taskArgs.amount, data)).wait();
        }
        console.log("ERC1155 Token at address:", taskArgs.tokenAddress);
        console.log("Minted tokenId:", taskArgs.tokenId, "and amount:", taskArgs.amount, "with data:", data, "to address", taskArgs.receiverAddress);
        console.log("Gas spent:", res.gasUsed.toNumber());
    }
);

task("add-minter-erc20", "Add minter to ERC20 Token")
    .addParam("tokenAddress", "Address of ERC20 token")
    .addParam("address", "Minter Address of ERC20 token")
    .setAction(async (taskArgs: any, { ethers }) => {
        const contractName = "ERC20Example";
        const erc20Factory = await ethers.getContractFactory(contractName);
        const erc20 = erc20Factory.attach(taskArgs.tokenAddress);
        const minterRole = await erc20.MINTER_ROLE();
        const res = await(await erc20.grantRole(minterRole, taskArgs.address)).wait();
        console.log("ERC20 Token at address:", taskArgs.tokenAddress);
        console.log("Minter address:", taskArgs.address);
        console.log("Gas spent:", res.gasUsed.toNumber());
    }
);

task("add-minter-erc721", "Add minter to ERC721 Token")
    .addParam("tokenAddress", "Address of ERC721 token")
    .addParam("address", "Minter Address of ERC721 token")
    .setAction(async (taskArgs: any, { ethers }) => {
        const contractName = "ERC721Example";
        const erc721Factory = await ethers.getContractFactory(contractName);
        const erc721 = erc721Factory.attach(taskArgs.tokenAddress);
        const minterRole = await erc721.MINTER_ROLE();
        const res = await(await erc721.grantRole(minterRole, taskArgs.address)).wait();
        console.log("ERC721 Token at address:", taskArgs.tokenAddress);
        console.log("Minter address:", taskArgs.address);
        console.log("Gas spent:", res.gasUsed.toNumber());
    }
);


task("add-minter-erc721-meta", "Add minter to ERC721 Token")
    .addParam("tokenAddress", "Address of ERC721 token")
    .addParam("address", "Minter Address of ERC721 token")
    .setAction(async (taskArgs: any, { ethers }) => {
        const contractName = "ERC721MetaExample";
        const erc721Factory = await ethers.getContractFactory(contractName);
        const erc721 = erc721Factory.attach(taskArgs.tokenAddress);
        const minterRole = await erc721.MINTER_ROLE();
        const res = await(await erc721.grantRole(minterRole, taskArgs.address)).wait();
        console.log("ERC721 Token at address:", taskArgs.tokenAddress);
        console.log("Minter address:", taskArgs.address);
        console.log("Gas spent:", res.gasUsed.toNumber());
    }
);


task("add-minter-erc1155", "Add minter to ERC1155 Token")
    .addParam("tokenAddress", "Address of ERC1155 token")
    .addParam("address", "Minter Address of ERC1155 token")
    .setAction(async (taskArgs: any, { ethers }) => {
        const contractName = "ERC1155Example";
        const erc1155Factory = await ethers.getContractFactory(contractName);
        const erc1155 = erc1155Factory.attach(taskArgs.tokenAddress);
        const minterRole = await erc1155.MINTER_ROLE();
        const res = await(await erc1155.grantRole(minterRole, taskArgs.address)).wait();
        console.log("ERC1155 Token at address:", taskArgs.tokenAddress);
        console.log("Minter address:", taskArgs.address);
        console.log("Gas spent:", res.gasUsed.toNumber());
    }
);

function getCustomUrl(url: string | undefined) {
  if (url) {
    return url;
  } else {
    return "http://127.0.0.1:8545"
  }
}

function getCustomPrivateKey(privateKey: string | undefined) {
  if (privateKey) {
    return [privateKey];
  } else {
    return [];
  }
}

function getGasPrice(gasPrice: string | undefined) {
  if (gasPrice) {
    return parseInt(gasPrice, 10);
  } else {
    return "auto";
  }
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    version: '0.8.6',
    settings: {
      optimizer:{
        enabled: true,
        runs: 200
      }
    }
  },
  mocha: {
    timeout: 1000000
  },
  networks: {
    hardhat: {
      blockGasLimit: 12000000
    },
    mainnet: {
        url: getCustomUrl(process.env.URL_W3_ETHEREUM),
        accounts: getCustomPrivateKey(process.env.PRIVATE_KEY_FOR_ETHEREUM),
        gasPrice: getGasPrice(process.env.GASPRICE)
    },
    schain: {
        url: getCustomUrl(process.env.URL_W3_S_CHAIN),
        accounts: getCustomPrivateKey(process.env.PRIVATE_KEY_FOR_SCHAIN),
        gasPrice: getGasPrice(process.env.GASPRICE)
    }
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN as string,
      schain: process.env.ETHERSCAN as string
    },
    customChains: [
      {
        network: "schain",
        chainId: Number(process.env.CHAIN_ID),
        urls: {
          apiURL: stringValue(process.env.BROWSER_URL) + "api",
          browserURL: stringValue(process.env.BROWSER_URL)
        }
      }
    ]
  },
};

export default config;
