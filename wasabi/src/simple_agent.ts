import { WalletSdk, WalletProvider, AssetId, MemoryFifo, TxType, EthAddress, TxHash } from '@aztec/sdk';
import { Agent, TX_SETTLEMENT_TIMEOUT } from './agent';
import { Stats } from './stats';

export class SimpleAgent extends Agent {
  readonly numTransfers = 400;
  readonly numConcurrentTransfers = 10;

  constructor(
    fundsSourceAddress: EthAddress,
    sdk: WalletSdk,
    provider: WalletProvider,
    id: number,
    queue: MemoryFifo<() => Promise<void>>,
  ) {
    super('Simple', fundsSourceAddress, sdk, id, provider, queue);
  }

  public async run(stats: Stats) {
    try {
      await this.serializeTx(this.completePendingDeposit);
      stats.numDeposits++;
      let transfersRemaining = this.numTransfers;
      const transferPromises: Promise<void>[] = [];
      while (transfersRemaining) {
        while (transferPromises.length < Math.min(this.numConcurrentTransfers, transfersRemaining)) {
          console.log(
            `${this.agentId()} sending transfer ${
              this.numTransfers - transfersRemaining + (1 + transferPromises.length)
            }...`,
          );
          while (true) {
            try {
              const hash: TxHash = await this.serializeAny(this.transfer);
              console.log(
                `${this.agentId()} sent transfer ${
                  this.numTransfers - transfersRemaining + (1 + transferPromises.length)
                }, hash: ${hash.toString()}...`,
              );
              transferPromises.push(this.sdk.awaitSettlement(hash, TX_SETTLEMENT_TIMEOUT));
              break;
            } catch (err) {
              console.log(`ERROR Sending payment: `, err);
              await new Promise(resolve => setTimeout(resolve, 20000));
            }
          }
        }
        console.log(`${this.agentId()} has ${transferPromises.length} outstanding payments...`);
        await transferPromises[0];
        transferPromises.splice(0, 1);
        transfersRemaining--;
        console.log(`${this.agentId()} transaction ${this.numTransfers - transfersRemaining} settled`);
        stats.numPayments++;
      }
      await this.serializeTx(this.withdraw);
      stats.numWithdrawals++;
    } catch (err: any) {
      console.log(`ERROR: `, err);
    }
  }

  private async calcDeposit(numTransfers: number) {
    // Nothing to do if we have a balance.
    if (this.sdk.getBalance(AssetId.ETH, this.user.id)) {
      return;
    }
    const depositFee = await this.userAsset.getFee(TxType.DEPOSIT);
    const transferFee = await this.userAsset.getFee(TxType.TRANSFER);
    const withdrawFee = await this.userAsset.getFee(TxType.WITHDRAW_TO_WALLET);

    const totalDeposit =
      BigInt(this.numTransfers * 2) + depositFee + BigInt(numTransfers) * transferFee + withdrawFee + this.payoutFee;
    return totalDeposit;
  }

  protected getInitialDeposit() {
    return this.calcDeposit(this.numTransfers);
  }

  private transfer = async () => {
    console.log(`${this.agentId()} transferring...`);
    const fee = await this.userAsset.getFee(TxType.TRANSFER);
    const proof = await this.userAsset.createTransferProof(1n, fee, this.signer, this.user.id);
    return await this.sdk.sendProof(proof);
  };
}
