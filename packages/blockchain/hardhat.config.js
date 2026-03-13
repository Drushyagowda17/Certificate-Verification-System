require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { AMOY_RPC_URL, DEPLOYER_PRIVATE_KEY } = process.env;

const normalizeKey = (key) => {
  if (!key) return undefined;
  return key.startsWith("0x") ? key : `0x${key}`;
};

module.exports = {
  solidity: "0.8.20",
  networks: {
    amoy: {
      url: AMOY_RPC_URL || "https://rpc-amoy.polygon.technology/",
      chainId: 80002,
      accounts: DEPLOYER_PRIVATE_KEY ? [normalizeKey(DEPLOYER_PRIVATE_KEY)] : [],
    },
  },
};
