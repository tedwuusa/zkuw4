import React from 'react'
import styles from "../styles/Home.module.css"
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

const connectors = {
    injected: new InjectedConnector({}),
    // Add other wallet connectors in the future
};

const EthAccount = () => {
  const web3React = useWeb3React()

  if (web3React.active) {
      return <div>
        <span className={styles.wallet}>Account: {web3React.account} </span>
        <span className={styles.button} onClick={web3React.deactivate}>Disconnect</span>
      </div>
  }
  else {
    return <div className={styles.button} onClick={() => {
        web3React.activate(connectors.injected);
    }}>Connect Wallet</div>
  }
}

export default EthAccount