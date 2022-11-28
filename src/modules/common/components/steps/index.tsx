import { Steps } from 'antd';
import { FC } from 'react';

const { Step } = Steps;

interface IStepperProps {
	steps: Array<string>;
	activeStep: string;
}

const Stepper: FC<IStepperProps> = ({ steps, activeStep }) => {
	const current = steps.findIndex((step: string) => {
		return step === activeStep;
	});

	return (
		<div className='steps-custom'>
			<Steps
				current={current}
				direction='horizontal'
				responsive={false}
				labelPlacement='vertical'
			>
				{steps.map((step: string, index: number) => {
					return <Step key={index} title={step} />;
				})}
			</Steps>
		</div>
	);
};

export default Stepper;
