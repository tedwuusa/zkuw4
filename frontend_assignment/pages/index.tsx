import { Strategy, ZkIdentity } from "@zk-kit/identity"
import { generateMerkleProof, Semaphore } from "@zk-kit/protocols"
import { useWeb3React } from "@web3-react/core";
import Head from "next/head"
import React from "react"
import styles from "../styles/Home.module.css"
import UserInputForm from "../components/UserInputForm"
import EthAccount from "../components/EthAccount"
import GreetingListener from "../components/GreetingListener"

export default function Home() {
    const web3React = useWeb3React()
    const [logs, setLogs] = React.useState("")

    async function greet(data: any) : Promise<boolean> {
        setLogs("Creating your Semaphore identity...")

        const signer = web3React.library.getSigner()
        let message;
        try {
            message = await signer.signMessage("Sign this message to create your identity!")
        } catch (err) {
            setLogs("Message not signed successfully.")
            return false;            
        }

        const identity = new ZkIdentity(Strategy.MESSAGE, message)
        const identityCommitment = identity.genIdentityCommitment()
        const identityCommitments = await (await fetch("./identityCommitments.json")).json()

        let merkleProof;
        try {
            merkleProof = generateMerkleProof(20, BigInt(0), identityCommitments, identityCommitment)
        } catch (err) {
            setLogs("Account not authorized. Unable to generate merkle proof.")
            return false;
        }

        setLogs("Creating your Semaphore proof...")

        const greeting = `Hello ${data.name} @${data.age}`

        const witness = Semaphore.genWitness(
            identity.getTrapdoor(),
            identity.getNullifier(),
            merkleProof,
            merkleProof.root,
            greeting
        )

        const { proof, publicSignals } = await Semaphore.genProof(witness, "./semaphore.wasm", "./semaphore_final.zkey")
        const solidityProof = Semaphore.packToSolidityProof(proof)

        const response = await fetch("/api/greet", {
            method: "POST",
            body: JSON.stringify({
                greeting,
                nullifierHash: publicSignals.nullifierHash,
                solidityProof: solidityProof
            })
        })

        if (response.status === 500) {
            const errorMessage = await response.text()

            setLogs(errorMessage)
            return false;
        } else {
            setLogs("Your anonymous greeting is onchain :)")
            return true;
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Greetings</title>
                <meta name="description" content="A simple Next.js/Hardhat privacy application with Semaphore." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Greetings</h1>

                <p className={styles.description}>A simple Next.js/Hardhat privacy application with Semaphore.</p>

                <EthAccount />

                {web3React.active && <>
                    <UserInputForm onSubmit={greet}/>
                    <div className={styles.logs}>{logs}</div>

                    <GreetingListener />
                </>}

            </main>
        </div>
    )
}
