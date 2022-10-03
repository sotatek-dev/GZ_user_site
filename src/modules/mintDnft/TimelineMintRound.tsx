import { FC } from 'react';
import { CheckCircleFilled, CheckCircleOutlined } from '@ant-design/icons';
import { ITimelineMintNftState } from 'modules/mintDnft/interfaces';
import { MINT_PHASE_STATUS } from 'modules/mintDnft/constants';

interface ITimelineMintRoundProps {
	timelineMintNft: Array<ITimelineMintNftState>;
}

const TimelineMintRound: FC<ITimelineMintRoundProps> = ({
	timelineMintNft,
}) => {
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
						'w-[20px] h-[20px] min-w-[20px] min-h-[20px] border-2 border-green rounded-full'
					}
				/>
			);
		} else {
			return <CheckCircleOutlined style={{ fontSize: '20px' }} />;
		}
	};

	return (
		<div className='flex justify-between'>
			{timelineMintNft.map(
				(phaseInfo: ITimelineMintNftState, index: number) => {
					const { status, label } = phaseInfo;
					// console.log(phaseInfo);
					// console.log(phaseInfo.status)

					return (
						<div
							className={'flex justify-center items-center w-[20%] text-h8'}
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
	);
};

export default TimelineMintRound;