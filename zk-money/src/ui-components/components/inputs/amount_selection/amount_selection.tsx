import type { RemoteAsset } from 'alt-model/types';
import { useState } from 'react';
import { Dropdown } from 'components/dropdown';
import { ShieldedAssetIcon } from 'components';
import { AmountInput } from 'ui-components';
import downArrow from '../../../images/down_arrow.svg';
import style from './amount_selection.module.scss';

interface AmountSelectionProps {
  asset: RemoteAsset;
  maxAmount: bigint;
  amountString: string;
  allowAssetSelection?: boolean;
  onChangeAmountString: (amountString: string) => void;
}

export function AmountSelection(props: AmountSelectionProps) {
  const [isAssetSelectorOpen, setAssetSelectorOpen] = useState(false);

  const toggleAssetSelector = () => {
    setAssetSelectorOpen(prevValue => !prevValue);
  };

  return (
    <div className={style.inputWrapper}>
      {props.allowAssetSelection && (
        <div className={style.assetSelectorWrapper}>
          <div className={style.assetSelector} onClick={toggleAssetSelector}>
            <div className={style.assetDisplay}>
              <ShieldedAssetIcon address={props.asset.address} />
              <div className={style.assetName}>{props.asset.symbol}</div>
            </div>
            <img src={downArrow} alt="" />
          </div>
          <Dropdown
            isOpen={isAssetSelectorOpen}
            options={[
              { label: 'zkETH', value: 'zkETH' },
              { label: 'zkDAI', value: 'zkDAI' },
              { label: 'zkrenBTC', value: 'zkrenBTC' },
            ]}
            onClick={() => {}}
            onClose={toggleAssetSelector}
          />
        </div>
      )}
      <AmountInput
        maxAmount={props.maxAmount}
        asset={props.asset}
        placeholder="Enter amount"
        onChangeValue={props.onChangeAmountString}
        value={props.amountString}
      />
    </div>
  );
}