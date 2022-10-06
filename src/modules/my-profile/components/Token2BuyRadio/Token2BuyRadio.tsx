import { Token2Buy } from '../BuyInfo/BuyInfo.constants';

interface Props {
	token: Token2Buy;
}

export default function Token2BuyRadio({ token }: Props) {
	return <div className='select-card-wrapper'>{token}</div>;
}
