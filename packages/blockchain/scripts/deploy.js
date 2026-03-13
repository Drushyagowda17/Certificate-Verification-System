async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Certificate = await ethers.getContractFactory("Certificate");
  const certificate = await Certificate.deploy();
  await certificate.waitForDeployment();

  const address = await certificate.getAddress();
  console.log("Certificate deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
