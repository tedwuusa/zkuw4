import { useState, useEffect } from 'react'
import styles from "../styles/Home.module.css"
import { useWeb3React } from "@web3-react/core";
import { Contract, utils } from "ethers"
import Greeter from "../artifacts/contracts/Greeters.sol/Greeters.json"

const GreetingListener = () => {
  const web3React = useWeb3React()
  const [greetings, setGreetings] = useState([] as Array<string>)

  useEffect(() => {
    const signer = web3React.library.getSigner()
    const contract = new Contract("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", Greeter.abi, signer)

    contract.on("NewGreeting", (c) => {
        const greeting = utils.parseBytes32String(c)
        setGreetings((prevGreetings) => [greeting, ...prevGreetings]);
    })
  }, [])

  return (
    <div>
      <div className={styles.description}>Greetings On Chain:</div>
      {
        (greetings.length > 0) ?
          greetings.map((greeting) => {return (<div key={greeting}>{greeting}</div>)}) :
          <div>None</div>
      }
    </div>
  )
}

export default GreetingListener