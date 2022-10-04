import { Steps } from 'antd';
import { FC, useEffect, useState } from 'react';

const { Step } = Steps;

interface IStepperProps {
	steps: Array<string>;
	activeStep: string;
}

const Stepper: FC<IStepperProps> = ({ steps, activeStep }) => {
	const [current, setCurrent] = useState<number>(0);

	useEffect(() => {
		const current = steps.findIndex((step: string) => {
			return step === activeStep;
		});
		setCurrent(current);
	}, [activeStep, steps]);
	return (
		<div className='steps-custom'>
			<Steps
				current={current}
				direction={'horizontal'}
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
