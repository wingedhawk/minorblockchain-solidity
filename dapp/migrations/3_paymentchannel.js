const deployInfo = require('../helpers/deployInfo');
var Channel = artifacts.require("ContributionChannel");
var MyNotary = artifacts.require("IDO");
const fsExtra = require('fs-extra');
const fs = require('fs');

module.exports = async function(deployer, network, accounts) {

  await deployer.deploy(MyNotary, {from: accounts[0]}).then(async function() {
      await deployer.deploy(Channel, MyNotary.address).then(async function(){
          console.log("/n")
          console.log(MyNotary.address)
          console.log("==============================================")
      });
  });
    return true;
}