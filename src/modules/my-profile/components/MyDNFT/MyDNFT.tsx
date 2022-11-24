import { message, Pagination, Spin } from 'antd';
import { getDNFTSignature } from 'apis/dnft';
import BoxPool from 'common/components/boxPool';
import Dropdown from 'common/components/dropdown';
import MyTable from 'common/components/table';
import {
	LIMIT_10,
	RARITY_DNFT,
	SPECIES_DNFT,
} from 'common/constants/constants';
import dayjs from 'dayjs';
import { cloneDeep, get, includes } from 'lodash';
import { getNonces } from 'modules/mint-dnft/services';
import { DNFTStatusMap } from 'modules/my-profile/components/MyDNFT/MyDNFT.constant';
import myProfileConstants from 'modules/my-profile/constant';
import { handleClaimError } from 'modules/my-profile/helpers/handleError';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'stores';
import {
	getMyClaimableDNFTsCountRD,
	getMyDNFTsRD,
	setDNFTsCount,
} from 'stores/myProfile';
import { AbiDnft } from 'web3/abis/types';
import { NEXT_PUBLIC_DNFT } from 'web3/contracts/instance';
import { useContract } from 'web3/contracts/useContract';
import { useActiveWeb3React } from 'web3/hooks';
import DNFTABI from 'modules/web3/abis/abi-dnft.json';

export default function MyDNFT() {
	const router = useRouter();
	const { dnfts, dnft_claimable_count, loading } = useAppSelector(
		(state) => state.myProfile
	);
	const { isLogin } = useAppSelector((state) => state.user);
	const [type, setType] = useState<string>('');
	const [status, setStatus] = useState<string>('');
	const [page, setPage] = useState<number>(1);
	const dispatch = useAppDispatch();
	const dnftContract = useContract<AbiDnft>(DNFTABI, NEXT_PUBLIC_DNFT);
	const [claimableTime, setClaimableTime] = useState<number | undefined>();
	const { account } = useActiveWeb3React();

	const [loadingMap, setLoadingMap] = useState({});

	useEffect(() => {
		if (isLogin) {
			handleGetDNFTs();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLogin, type, status, page]);

	useEffect(() => {
		handleGetClaimableTime();
		handleGetBalanceOf();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dnftContract, account]);

	const mutantDNFTs = useMemo(() => {
		let canClaimTime = false;
		const currentDate = dayjs().unix();
		if (!!claimableTime && currentDate > claimableTime) {
			canClaimTime = true;
		}

		if (!dnfts) {
			return [];
		}

		return dnfts.data.map((item) => {
			const cloneItem = cloneDeep(item);
			const canClaim =
				!canClaimTime ||
				['claimable', 'wait-to-claim'].includes(cloneItem.status);

			if (canClaim) {
				cloneItem.species = 'TBA';
				cloneItem.rank_level = 'TBA';
			}

			let claimable_date = claimableTime;
			if (cloneItem.status === 'wait-to-merge') {
				claimable_date = dayjs(cloneItem.created_at).add(30, 'day').unix();
			}

			return {
				...cloneItem,
				claimable_date: !claimable_date
					? '-'
					: dayjs.unix(claimable_date).format('DD-MMMM-YYYY HH:mm'),
				onClick: () => {
					if (cloneItem.status === 'claimable') {
						handleClaim(cloneItem._id);
					} else if (cloneItem.status === 'wait-to-merge') {
						handleUnmerge(cloneItem._id);
					}
				},
			};
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dnfts, claimableTime]);

	const handleUnmerge = async (session_id: string) => {
		if (!dnftContract || !account) {
			return;
		}

		try {
			setLoadingMap({ [session_id]: true });

			const nonce = await getNonces(dnftContract, account);
			const res = await getDNFTSignature({ session_id, nonce });
			const { signature, token_ids, time_stamp } = get(res, 'data.data');

			await dnftContract
				?.cancelTemporaryMerge(token_ids, time_stamp, session_id, signature)
				.then((res) => {
					return res.wait();
				})
				.then((res) => {
					message.success({
						content: myProfileConstants.TRANSACTION_COMPLETED,
						onClick: () => {
							window.open(getExploreTxLink(res.transactionHash), '_blank');
						},
					});
					handleGetDNFTs();
				})
				.catch((err) => {
					handleClaimError(err);
				});
		} finally {
			setLoadingMap({});
		}
	};

	const handleGetClaimableTime = async () => {
		if (dnftContract) {
			const time = await dnftContract.claimableTime();
			setClaimableTime(time.toNumber());
		}
	};

	const handleGetBalanceOf = async () => {
		if (dnftContract && account) {
			const balance = await dnftContract.balanceOf(account);
			dispatch(setDNFTsCount(balance.toNumber()));
		}
	};

	const handleClaim = async (id: string) => {
		try {
			setLoadingMap({ [id]: true });
			if (dnftContract) {
				await dnftContract
					.claimPurchasedToken(1)
					.then((res) => {
						return res.wait();
					})
					.then((res) => {
						message.success({
							content: myProfileConstants.TRANSACTION_COMPLETED,
							onClick: () => {
								window.open(getExploreTxLink(res.transactionHash));
							},
						});
						Promise.all([handleGetDNFTs(), handleGetClaimableNFTsCount()]);
					})
					.catch((err) => {
						handleClaimError(err);
					});
			}
		} finally {
			setLoadingMap({});
		}
	};

	const handleClaimAll = async (amount: number) => {
		try {
			setLoadingMap({ claimAll: true });
			if (dnftContract) {
				await dnftContract
					.claimPurchasedToken(amount)
					.then((res) => {
						return res.wait();
					})
					.then((res) => {
						message.success({
							content: myProfileConstants.TRANSACTION_COMPLETED,
							onClick: () => {
								window.open(getExploreTxLink(res.transactionHash));
							},
						});
						Promise.all([handleGetDNFTs(), handleGetClaimableNFTsCount()]);
					})
					.catch((err) => {
						handleClaimError(err);
					});
			}
		} finally {
			setLoadingMap({});
		}
	};

	const handleGetDNFTs = () => {
		dispatch(
			getMyDNFTsRD({ page, limit: LIMIT_10, species: type, rarities: status })
		);
	};

	useEffect(() => {
		handleGetClaimableNFTsCount();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dnfts?.pagination.total]);

	const handleGetClaimableNFTsCount = async () => {
		if (dnfts && dnfts.pagination.total) {
			dispatch(getMyClaimableDNFTsCountRD(dnfts.pagination.total));
		}
	};

	const getExploreTxLink = (hash: string) => {
		return `${
			process.env.NEXT_PUBLIC_BSC_BLOCK_EXPLORER_URL || 'https://bscscan.com'
		}/tx/${hash}`;
	};

	const columns = [
		{
			title: 'Species',
			dataIndex: 'species',
			render: (Species: string) => {
				return <div>{Species}</div>;
			},
			width: '30%',
		},
		{
			title: 'Rarity',
			dataIndex: 'rank_level',
			render: (Rarity: string) => {
				return <div>{Rarity}</div>;
			},
			width: '30%',
		},
		{
			title: 'Claimable date',
			dataIndex: 'claimable_date',
			render: (Claimable_date: string) => {
				return <div>{Claimable_date}</div>;
			},
			width: '30%',
		},
		{
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			render: (record: any) => {
				const statusMap = get(DNFTStatusMap, record.status);
				const isLoading = get(loadingMap, record._id);
				const isClaimingAll = get(loadingMap, 'claimAll');
				return (
					<button
						disabled={get(statusMap, 'disabled') || isLoading || isClaimingAll}
						onClick={(e) => {
							e.stopPropagation();
							record.onClick();
						}}
						className='text-[#D47AF5] disabled:text-white/[.3] justify-center font-semibold rounded-[40px] !min-w-[100px]  py-[7px] border-[2px] border-[#D47AF5] disabled:border-[#2B3A51] disabled:bg-[#2B3A51] flex ml-auto'
					>
						{isLoading ? (
							<Spin
								size='small'
								style={{
									color: '#D47AF5',
								}}
							/>
						) : (
							get(statusMap, `title`)
						)}
					</button>
				);
			},
		},
	];

	let canClaimTime = false;
	const currentDate = dayjs().unix();
	if (!!claimableTime && currentDate > claimableTime) {
		canClaimTime = true;
	}

	const canClaimAll =
		canClaimTime && dnft_claimable_count && !get(loadingMap, 'claimAll');

	return (
		<BoxPool>
			<div className={'flex justify-between items-start mb-3'}>
				<h5 className={`text-h6 font-semibold text-white`}>My dNFT</h5>
				<button
					disabled={!canClaimAll}
					onClick={() => handleClaimAll(dnft_claimable_count)}
					className={`desktop:hidden text-h8 font-semibold rounded-[40px] py-2 border-[2px] border-white/[0.3] min-w-[7.125rem] ${
						!canClaimAll ? 'text-white/[0.3]' : 'text-white'
					}`}
				>
					{get(loadingMap, 'claimAll') ? <Spin size='small' /> : 'Claim all'}
				</button>
			</div>

			<hr className={'border-t border-blue-20/[0.1]'} />
			<div className='mt-6'>
				<div className='flex gap-x-2 mb-6 justify-between'>
					<div
						className={
							'flex items-center justify-between desktop:justify-start grow gap-2.5'
						}
					>
						<Dropdown
							emptyOption='All status'
							onClick={(value) => {
								setPage(1);
								setStatus(value.key);
							}}
							customStyle={'!w-1/2 desktop:!w-[160px]'}
							list={RARITY_DNFT}
							title='All status'
							label={status}
						/>
						<Dropdown
							emptyOption='All types'
							onClick={(value) => {
								setPage(1);
								setType(value.key);
							}}
							customStyle={'!w-1/2 desktop:!w-[160px]'}
							label={type}
							list={SPECIES_DNFT}
							title='All types'
						/>
					</div>
					<button
						disabled={!canClaimAll}
						onClick={() => handleClaimAll(dnft_claimable_count)}
						className={`hidden desktop:block text-h8 rounded-[40px] font-semibold py-2 border-[2px] border-white/[0.3] min-w-[7.125rem] ${
							!canClaimAll ? 'text-white/[0.3]' : 'text-white'
						}
						`}
					>
						{get(loadingMap, 'claimAll') ? <Spin size='small' /> : 'Claim all'}
					</button>
				</div>

				<MyTable
					id='my-dnft-table'
					locale={{
						emptyText: () => {
							if (loading) {
								return <Spin />;
							}
							return 'No data';
						},
					}}
					onRow={(record) => {
						return {
							onClick: () => {
								if (includes(['normal', 'wait-to-merge'], record.status)) {
									router.push(`/dnft-detail/${record._id}`);
								}
							},
						};
					}}
					columns={columns}
					dataSource={mutantDNFTs}
					className={'hidden desktop:inline-block w-full'}
				/>
				<div className={'desktop:hidden'}>
					{mutantDNFTs.map((value, item) => {
						const statusMap = get(DNFTStatusMap, value.status);
						const isLoading = get(loadingMap, value._id);
						const isClaimingAll = get(loadingMap, 'claimAll');
						return (
							<div
								className={'flex flex-col gap-6 mb-6'}
								key={item}
								onClick={() => {
									if (includes(['normal', 'wait-to-merge'], value.status)) {
										router.push(`/dnft-detail/${value._id}`);
									}
								}}
							>
								<hr className={'border-t border-white/[0.07]'} />
								<button
									disabled={
										get(statusMap, 'disabled') || isLoading || isClaimingAll
									}
									onClick={(e) => {
										e.stopPropagation();
										value.onClick();
									}}
									className='text-[#D47AF5] disabled:text-white/[.3] justify-center font-semibold rounded-[40px] !min-w-[100px]  py-[7px] border-[2px] border-[#D47AF5] disabled:border-[#2B3A51] disabled:bg-[#2B3A51] flex ml-auto'
								>
									{isLoading ? <Spin size='small' /> : get(statusMap, `title`)}
								</button>

								<div className={'flex justify-between items-center'}>
									<div className={'text-h8 text-blue-20 font-medium'}>
										Species
									</div>
									<div className={'text-h8 text-white font-bold'}>
										{value.species || 'TBA'}
									</div>
								</div>
								<div className={'flex justify-between items-center'}>
									<div className={'text-h8 text-blue-20 font-medium'}>
										Rarity
									</div>
									<div className={'text-h8 text-white font-bold'}>
										{value.rank_level || 'TBA'}
									</div>
								</div>
								<div className={'flex justify-between items-center'}>
									<div className={'text-h8 text-blue-20 font-medium'}>
										Claimable date
									</div>
									<div className={'text-h8 text-white font-bold'}>
										{value.claimable_date}
									</div>
								</div>
							</div>
						);
					})}
				</div>
				<div className='mt-[30px] w-[100%] flex justify-end'>
					{dnfts && !!get(dnfts, 'data.length') && (
						<Pagination
							defaultCurrent={1}
							pageSize={LIMIT_10}
							current={dnfts.pagination.page}
							total={dnfts.pagination.total}
							onChange={(page) => {
								setPage(page);
							}}
							showLessItems
							showSizeChanger={false}
							className='flex items-center'
						/>
					)}
				</div>
			</div>
		</BoxPool>
	);
}
