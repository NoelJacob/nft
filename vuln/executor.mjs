import {Address, Cell, TonClient} from "ton";
import {SmartContract} from "ton-contract-executor";

const contractAddress = Address.parse('EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t')

let client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC'
})

async function main() {
    let state = await client.getContractState(contractAddress)

    let code = Cell.fromBoc(state.code)[0]
    let data = Cell.fromBoc(state.data)[0]

    let wallet = await SmartContract.fromCell(code, data)

    let res = await wallet.invokeGetMethod('seqno', [])
    console.log('Wallet seq is: ', res.result[0])
}

main();
