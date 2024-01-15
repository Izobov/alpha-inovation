const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lending", function () {
  async function deployLending() {
    const [owner, borrower] = await ethers.getSigners();
    const USDT = await ethers.getContractFactory("USDT");
    const usdt = await USDT.deploy();
    await usdt.waitForDeployment();
    const Lending = await ethers.getContractFactory("Lending");
    const lending = await Lending.deploy(10, await usdt.getAddress());
    await lending.waitForDeployment();

    await usdt.mint(await lending.getAddress(), 1000000);

    return { usdt, lending, owner, borrower };
  }

  describe("Lending contract", function () {
    it("should set the right rate", async function () {
      const { lending } = await loadFixture(deployLending);
      expect(await lending.rate()).to.equal(10);
    });

    it("Should set the right owner", async function () {
      const { lending, owner } = await loadFixture(deployLending);
      expect(await lending.owner()).to.equal(owner.address);
    });

    it("Should emit Borrow event correctly and emit Borrow event", async function () {
      const { lending, usdt, borrower } = await loadFixture(deployLending);
      const txData = await lending.connect(borrower).borrow(100);
      await txData.wait();
      expect(txData).to.changeTokenBalances(
        usdt,
        [borrower, lending],
        [-100, 100]
      );
      expect(txData).to.emit(lending, "Borrow").withArgs(borrower.address, 100);
    });
    it("Should not allow to borrow if not enough funds are available", async function () {
      const { lending, usdt, borrower } = await loadFixture(deployLending);
      await expect(
        lending.connect(borrower).borrow(1000005)
      ).to.be.revertedWith("Sorry, we don't have enough funds to lend you");
    });

    it("Should not allow to borrow twice", async function () {
      const { lending, borrower } = await loadFixture(deployLending);
      await lending.connect(borrower).borrow(100);
      await expect(lending.connect(borrower).borrow(100)).to.be.revertedWith(
        "You have already borrowed"
      );
    });
    it("should deposit USDT to the Lending contract", async function () {
      const { lending, usdt, borrower } = await loadFixture(deployLending);

      await usdt.mint(borrower.address, 1000);

      await usdt.connect(borrower).approve(await lending.getAddress(), 500);

      const tx = await lending.connect(borrower).deposit(500);
      await tx.wait();
      expect(tx).to.changeTokenBalances(usdt, [borrower, lending], [-500, 500]);
    });

    it("should repay the borrowed USDT to the Lending contract", async function () {
      const { lending, usdt, borrower } = await loadFixture(deployLending);
      const addr = await lending.getAddress();

      await usdt.mint(borrower.address, 10000);

      const tx1 = await lending.connect(borrower).borrow(1000);
      await tx1.wait();

      await usdt.connect(borrower).approve(addr, 1100);

      const tx2 = await lending.connect(borrower).repay();
      await tx2.wait();
      expect(tx2).to.changeTokenBalances(
        usdt,
        [borrower, lending],
        [-1100, 1100]
      );
      expect(tx2).to.emit(lending, "Repay").withArgs(borrower.address, 1100);
    });

    it("Should not allow to repay less", async function () {
      const { lending, usdt, borrower, owner } = await loadFixture(
        deployLending
      );

      const addr = await lending.getAddress();

      const tx1 = await lending.connect(borrower).borrow(1000);
      await tx1.wait();
      await usdt.connect(borrower).transfer(owner.address, 1000);
      await usdt.connect(borrower).approve(addr, 1100);
      await expect(lending.connect(borrower).repay()).to.be.revertedWith(
        "You do not have enough USDT to repay"
      );
    });

    it("Should not allow to repay unless borrow", async function () {
      const { lending, usdt, borrower } = await loadFixture(deployLending);

      const addr = await lending.getAddress();

      await usdt.mint(borrower.address, 10000);

      await usdt.connect(borrower).approve(addr, 600);

      await expect(lending.connect(borrower).repay()).to.be.revertedWith(
        "You haven't borrowed"
      );
    });

    it("Only owner can withdraw USDT from contract", async function () {
      const { lending, usdt, borrower, owner } = await loadFixture(
        deployLending
      );

      await expect(lending.connect(borrower).withdraw(500)).to.be.revertedWith(
        "You aren't the owner"
      );
      const tx = await lending.connect(owner).withdraw(500);
      await tx.wait();
      expect(tx).to.changeTokenBalances(usdt, [owner, lending], [500, -500]);
    });
  });
});
