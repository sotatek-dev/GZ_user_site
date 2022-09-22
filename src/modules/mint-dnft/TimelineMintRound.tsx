import { FC } from 'react';
import { ITimelineMintNftState } from 'pages/mint-dnft';
import { LIST_STATUS_TIME_LINE } from 'common/constants/constants';
import {
	CheckCircleFilled,
	PlayCircleFilled,
	CheckCircleOutlined,
} from '@ant-design/icons';

interface ITimelineMintRoundProps {
	timelineMintNft: Array<ITimelineMintNftState>;
}

const TimelineMintRound: FC<ITimelineMintRoundProps> = ({
	timelineMintNft,
}) => {
	const renderIcon = (status: string) => {
		if (status === LIST_STATUS_TIME_LINE.DONE) {
			return (
				<CheckCircleFilled style={{ fontSize: '20px', color: '#35B770' }} />
			);
		} else if (status === LIST_STATUS_TIME_LINE.RUNNING) {
			return (
				<PlayCircleFilled style={{ fontSize: '20px', color: '#35B770' }} />
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
					return (
						<div className='w-[20%] flex items-center' key={index}>
							<div className='mr-2'>{renderIcon(status)}</div>
							<div className='text-sm	'>{label}</div>
						</div>
					);
				}
			)}
		</div>
	);
};

export default TimelineMintRound;
