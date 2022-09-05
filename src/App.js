import "./App.css";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { GiBoltSpellCast } from "react-icons/gi";
import abi from "./abi/abi.json";
import data from "./data/data.json";
import { arrayify } from "ethers/lib/utils";

function App() {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [nfts, setNFts] = useState(data);

  const balance = async (nft) => {
    const contract = new ethers.Contract(nft.address, abi, provider);
    //hashlip address = "0xde3B22caAaD25e65C839c2A3d852d665669EdD5c":
    const tempBalance = await contract.balanceOf(account);
    const tempNfts = [...nfts.list];
    const tempNft = tempNfts[tempNfts.findIndex((obj) => obj.id == nft.id)];
    tempNft.owner = tempBalance > 0;

    tempNft.count = tempBalance.toString();
    setNFts({
      list: tempNfts,
    });
  };

  const checkCollection = () => {
    data.List.forEach((nft) => {
      balance(nft);
    });
  };

  const initConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(tempProvider);
      setAccount(accounts[0]);
    } else {
      console.log("Please install metamask");
    }
  };

  useEffect(() => {
    initConnection();
  }, []);

  useEffect(() => {
    checkCollection();
  }, [account]);

  return (
    <div className="page">
      <div className="header">
        <img
          src={require("./assets/images/cryptocurrency.png")}
          className="artIcon"
        />
        <p>
          11/15
          <span>
            <GiBoltSpellCast style={{ marginLeft: "5px" }} />
          </span>
        </p>
        {account == "" ? (
          <button onClick={initConnection} className="button">
            Connect
          </button>
        ) : (
          <p>...{account.substring(account.length - 7)}</p>
        )}
      </div>
      <div className="main">
        {nfts.List.map((nft, index) => {
          return (
            <div key={index} className="card">
              <div style={{ position: "relative" }}>
                <a
                  target={"_blank"}
                  href={`https://opensea.io/collection/${nft.link}`}
                >
                  <img
                    src={require(`./assets/images/cryptocurrency.png`)}
                    className="cardImage"
                  />
                </a>
                <GiBoltSpellCast
                  className="cardImage"
                  style={{ opacity: nft.owner ? 1 : 0.2 }}
                />
                <p className="counter">{nft.count}</p>
              </div>
              <img
                src={require(`./assets/images/${nft.id}.${nft.type}`)}
                className="nftImage"
                style={{ opacity: nft.owner ? 1 : 0.2 }}
              />
              <p className="nftText">{nft.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
