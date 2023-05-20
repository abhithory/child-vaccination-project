require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    localhost: {
      url: "HTTP://127.0.0.1:7545",
      accounts: ["45d048cc21df18ff1cac315930893667f9a41bfda000fef9dc221cede5b82fe8","5cca390d74bbb10eb0f2b958e55fa41b5ead1c317cc93b4ff42e942bad9cdc80","8ad43a7974e1deb2a166783e1798bbf943a60bf103c8f17dedd479256170766c"]
    }
  },
};
