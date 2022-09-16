import { Steps } from 'antd';
import { FC, useEffect, useState } from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Step } = Steps;

interface ITimelineMintRoundProps {
	steps: Array<string>;
	activeStep: string;
}

const TimelineMintRound: FC<ITimelineMintRoundProps> = ({
	steps,
	activeStep,
}) => {
	const [current, setCurrent] = useState<number>(0);

	useEffect(() => {
		const current = steps.findIndex((step: string) => {
			return step === activeStep;
		});
		setCurrent(current);
	}, [activeStep, steps]);

	return (
		<div className='timeline-mint-round'>
			<Steps current={current}>
				{steps.map((step: string, index: number) => {
					return (
						<Step key={index} title={step} icon={<CheckCircleOutlined />} />
					);
				})}
			</Steps>
		</div>
	);
};

export default TimelineMintRound;
