import Button from 'common/components/button';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import CustomRadio from 'common/components/radio';
import TimelineMintRound from 'modules/mint-dnft/TimelineMintRound';
import Countdown from 'common/components/countdown';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { getListPhaseMintNft } from 'apis/mintDNFt';
import { get } from 'lodash';
import { convertTimelineMintNft, convertTimeStampToDate, } from 'common/utils/functions';
import NftGroup from 'assets/svg-components/nftGroup';
import { useSelector } from 'react-redux';
import { useBalance } from 'web3/queries';

const selectList = ['BUSD', 'BNB'];
const minBalanceForMint = 5000;

const PoolRemaining = [
  {
    label: 'Total NFT',
    value: 600,
  },
  {
    label: 'NFT Minted',
    value: 200,
  },
  {
    label: 'Remaining',
    value: 400,
  },
];

export interface ITimelineMintNftState {
  label: string | undefined;
  status: string;
  endMintTime: number;
  startMintTime: number;
}

export interface IListPhaseMintNft {
  created_at: Date;
  end_mint_time: number;
  nft_mint_limit: number;
  order: number;
  price: number;
  price_after_24h: number;
  start_mint_time: number;
  status: string;
  tax: number;
  type: string;
  updated_at: Date;
  _id: string;
}

const MintDNFT: React.FC = () => {
  const [timelineMintNft, setTimelineMintNft] = useState<Array<ITimelineMintNftState>>([]);
  const [phaseRunning, setPhaseRunning] = useState<any>();
  const [upcomingPhase, setUpcomingPhase] = useState<any>();
  const [publicPhase, setPublicPhase] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [token, setToken] = useState(selectList[ 0 ]);
  const balance = useBalance(process.env.NEXT_PUBLIC_TOKEN || '');

  const { addressWallet } = useSelector((state) => state.wallet);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { upcomingPhaseLabel, startTime: upcomingPhaseStartTime } = upcomingPhase || {};
  const { endPubLicPhaseTime } = publicPhase || {};
  const { runningPhaseLabel, endTime: runningPhaseEndTime, startTime: runningPhaseStartTime } = phaseRunning || {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isConnectWallet = !!addressWallet;
  const haveEnoughBalance = balance.gte(minBalanceForMint);

  useEffect(() => {
    const handleGetListPhaseMintNft = async () => {
      const [data] = await getListPhaseMintNft();
      const listPhaseMintNft = get(data, 'data', []);
      const { timeLineMintNft, upcomingPhase, phaseRunning, publicPhase } =
        convertTimelineMintNft(listPhaseMintNft);
      setTimelineMintNft(timeLineMintNft);
      setPhaseRunning(phaseRunning);
      setUpcomingPhase(upcomingPhase);
      setPublicPhase(publicPhase);
    };

    handleGetListPhaseMintNft();
  }, []);

  return (
    <div className="flex gap-x-3">
      <div className="w-[300px] h-[587px] rounded-[10px] flex flex-col items-center">
        <NftGroup className={'w-full h-fit mt-11 mb-20'}/>
        <div
          className={
            'flex justify-center bg-charcoal-purple text-h7 text-white/[.3] font-semibold px-5 py-3 w-full rounded-[40px] cursor-pointer'
          }
        >
          Mint
        </div>
      </div>

      <div className="w-full bg-box p-8 rounded-[10px]">
        <h6 className="text-h3 font-semibold mb-4">Mint dNFT</h6>

        {/* divider*/}
        <hr className={'border border-white/[.07] mb-4'}/>

        {/*<Button label={'Mint'} classCustom={'bg-green mb-4'} />*/}
        <div className={'flex items-center rounded-[10px] text-h8 mb-4'}>
          <div className="flex items-center mr-10">
            <div className={'text-white/[.5] mr-[20px]'}>Price:</div>
            <div>175 BUSD</div>
            <Tooltip
              className="ml-2"
              placement="bottom"
              title="First 24h: 175 BUSD then 235 BUSD"
            >
              <ExclamationCircleOutlined/>
            </Tooltip>
          </div>
          <CustomRadio
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const item = e.target.value;
              const selectedToken = selectList.find((i) => i == item);
              selectedToken && setToken(selectedToken);
            }}
            defaultValue={token}
            options={selectList}
          />
        </div>

        {/* divider*/}
        <hr className={'border border-white/[.07] mb-4'}/>

        <div className={'mb-1 text-h8 font-medium mb-4'}>Pool remaining</div>
        <div className="flex justify-center items-center gap-x-6 mb-5 font-medium text-h8 h-fit">
          {PoolRemaining.map((item: any, index: number) => {
            const { label, value } = item;
            return (
              <>
                <div
                  key={index}
                  className="flex justify-between items-center w-[33%]"
                >
                  <div className="flex items-center">
                    <div className="min-w-[10px] min-h-[10px] rounded-sm bg-red-10 mr-2"/>
                    {label}
                  </div>
                  <div>{value}</div>
                </div>

                {index + 1 < PoolRemaining.length && (
                  <div
                    className={
                      'border border-white/[.07] h-full min-h-[1.25em]'
                    }
                  />
                )}
              </>
            );
          })}
        </div>

        {/* divider*/}
        <hr className={'border border-white/[.07] mb-8'}/>

        <div className="flex flex-col text-sm mb-8	">
          <TimelineMintRound timelineMintNft={timelineMintNft}/>
          {/* divider*/}
          <hr className={'border border-green mx-3 my-8'}/>
          <div className="flex justify-between w-full">
            {timelineMintNft.map(
              (phaseInfo: ITimelineMintNftState, index: number) => {
                const { endMintTime, startMintTime } = phaseInfo;
                return (
                  <div
                    className={
                      'flex flex-col justify-center items-center w-[20%] text-h10'
                    }
                    key={index}
                  >
                    <div className="mb-4">
                      Start from:{' '}
                      {convertTimeStampToDate(
                        startMintTime,
                        'hh:mm - MM/DD/YYYY'
                      )}
                    </div>
                    <div>
                      End in:{' '}
                      {convertTimeStampToDate(
                        endMintTime,
                        'hh:mm - MM/DD/YYYY'
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* divider*/}
        <hr className={'border border-white/[.07] mb-8'}/>

        <div className={'flex items-end'}>
          {
            endPubLicPhaseTime< new Date().getTime() ?
              (
                <Countdown
                  customClass={'grow'}
                  title={'Presale for dNFT is ended'}
                  millisecondsRemain={0}
                />
              )
              : phaseRunning && runningPhaseEndTime > new Date().getTime() && new Date().getTime() > runningPhaseStartTime? (
                <>
                  <Countdown
                    customClass={'grow'}
                    title={`Minting phase for ${runningPhaseLabel} end in`}
                    millisecondsRemain={runningPhaseEndTime || 0}
                  />
                </>
              ) : upcomingPhase && new Date().getTime() < upcomingPhaseStartTime ? (
                <>
                  <Countdown
                    customClass={'grow'}
                    title={'You can mint dNFT in'}
                    millisecondsRemain={upcomingPhaseStartTime || 0}
                  />
                </>
              ) : (
                <></>
              )}

          <div className={'flex flex-col items-end rounded-[10px] text-h8'}>
            <Button
              label={`You are ${isConnectWallet && haveEnoughBalance || 'not'} eligible to mint this dNFT `}
              classCustom={'bg-blue-to-pink-102deg !text-h8'}
            />
            <div className={'text-h8 mt-4'}>
              Notice: to mint this dNFT requires 5,000 GXZ Token
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintDNFT;
