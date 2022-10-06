import React, { FC } from 'react';
import { CheckCircleFilled, CheckCircleOutlined } from '@ant-design/icons';
import { ITimelineMintNftState } from 'modules/mintDnft/interfaces';
import { MINT_PHASE_STATUS } from 'modules/mintDnft/constants';
import { convertMiliSecondTimestampToDate } from 'common/utils/functions';

interface ITimelineMintRoundProps {
	timelineMintNft: Array<ITimelineMintNftState>;
}

const TimelineMintRound: FC<ITimelineMintRoundProps> = ({
	timelineMintNft,
}) => {
	const dateFormat = 'HH:mm - MM/DD/YYYY';

	const renderIcon = (status: string) => {
		if (status === MINT_PHASE_STATUS.DONE) {
			return (
				<CheckCircleFilled style={{ fontSize: '20px', color: '#35B770' }} />
			);
		} else if (status === MINT_PHASE_STATUS.RUNNING) {
			return (
				// <PlayCircleFilled style={{ fontSize: '20px', color: '#35B770' }} />
				<div
					className={
						'w-5 h-5 min-w-5 min-h-5 border-2 border-green rounded-full'
					}
				/>
			);
		} else {
			return <CheckCircleOutlined style={{ fontSize: '20px' }} />;
		}
	};

	return (
		<>
			<div className={'hidden desktop:block'}>
				<div className={'flex flex-col text-sm mb-8'}>
					<div className={'flex justify-between'}>
						{timelineMintNft.map(
							(phaseInfo: ITimelineMintNftState, index: number) => {
								const { status, label } = phaseInfo;
								// console.log(phaseInfo);
								// console.log(phaseInfo.status)

								return (
									<div
										className={
											'flex justify-center items-center w-[20%] text-h8'
										}
										key={index}
									>
										<div className={'flex justify-center items-center mr-2'}>
											{renderIcon(status)}
										</div>
										<div>{label}</div>
									</div>
								);
							}
						)}
					</div>
					<hr className={'border border-green mx-3 my-8'} />
					<div className='flex justify-between w-full'>
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
										<div className={'mb-4'}>
											Start from:{' '}
											{convertMiliSecondTimestampToDate(
												startMintTime,
												dateFormat
											)}
										</div>
										<div>
											End in:{' '}
											{convertMiliSecondTimestampToDate(
												endMintTime,
												dateFormat
											)}
										</div>
									</div>
								);
							}
						)}
					</div>
				</div>

				{/* divider*/}
				<hr className={'border-t border-white/[.07] mb-8'} />
			</div>

			<div className={'desktop:hidden'}>
				<div className={'flex flex-col'}>
					{timelineMintNft.map(
						(phaseInfo: ITimelineMintNftState, index: number) => {
							const { status, label, endMintTime, startMintTime } = phaseInfo;
							const l = timelineMintNft.length;

							return (
								<div
									className={'relative flex items-start gap-4 overflow-hidden'}
									key={index}
								>
									{/* line */}
									{index !== l - 1 && (
										<div
											className={
												'absolute left-[9px] top-6 border-r-2 border-green h-full'
											}
										/>
									)}

									<div
										className={
											'relative z-20 flex justify-center items-center h-full py-0.5'
										}
									>
										{renderIcon(status)}
									</div>
									<div className={'flex flex-col gap-4 grow'}>
										<div className={'text-h8'}>{label}</div>
										<div className={'flex flex-col gap-1 text-h10'}>
											<div>
												Start from:{' '}
												{convertMiliSecondTimestampToDate(
													startMintTime,
													dateFormat
												)}
											</div>
											<div>
												End in:{' '}
												{convertMiliSecondTimestampToDate(
													endMintTime,
													dateFormat
												)}
											</div>
										</div>

										<hr className={'border-t border-white/[.07] mb-4'} />
									</div>
								</div>
							);
						}
					)}
				</div>
			</div>
		</>
	);
};

export default TimelineMintRound;
