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
import { DNFTStatusMap } from 'modules/my-profile/components/MyDNFT/MyDNFT.constant';
import myProfileConstants from 'modules/my-profile/constant';
import { handleClaimError } from 'modules/my-profile/helpers/handleError';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from 'stores';
import {
	getMyClaimableDNFTsCountRD,
	getMyDNFTsRD,
	setDNFTsCount,
} from 'stores/my-profile';
import { AbiDnft } from 'web3/abis/types';
import {
	NEXT_PUBLIC_BUSD,
	NEXT_PUBLIC_DNFT,
	NEXT_PUBLIC_KEYNFT,
} from 'web3/contracts/instance';
import { useContract } from 'web3/contracts/useContract';
import { useActiveWeb3React, useApprovalBusd } from 'web3/hooks';
import DNFTABI from '../../../web3/abis/abi-dnft.json';

export default function MyDNFT() {
	const { dnfts, dnft_claimable_count, loading } = useSelector(
		(state) => state.myProfile
	);
	const { isLogin } = useAppSelector((state) => state.user);
	const [type, setType] = useState<string>('');
	const [status, setStatus] = useState<string>('');
	const [page, setPage] = useState<number>(1);
	const dispatch = useAppDispatch();
	const dnftContract = useContract<AbiDnft>(DNFTABI, NEXT_PUBLIC_DNFT);
	const [claimableTime, setClaimableTime] = useState(0);
	const { account } = useActiveWeb3React();
	const { tryApproval, allowanceAmount } = useApprovalBusd(
		NEXT_PUBLIC_BUSD,
		NEXT_PUBLIC_KEYNFT
	);
	const router = useRouter();

	const [loadingMap, setLoadingMap] = useState({});

	useEffect(() => {
		if (isLogin) {
			handleGetDNFTs();
		}
	}, [isLogin, type, status, page]);

	useEffect(() => {
		handleGetClaimableTime();
		handleGetBalanceOf();
	}, [dnftContract, account]);

	const mutantDNFTs = useMemo(() => {
		let canClaimTime = false;
		const currentDate = dayjs().unix();
		if (currentDate > claimableTime) {
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
				claimable_date: dayjs.unix(claimable_date).format('DD-MMMM-YYYY HH:mm'),
				onClick: () => {
					if (cloneItem.status === 'claimable') {
						handleClaim(cloneItem._id);
					} else if (cloneItem.status === 'wait-to-merge') {
						handleUnmerge(cloneItem._id);
					}
				},
			};
		});
	}, [dnfts, claimableTime]);

	const handleUnmerge = async (sessionId: string) => {
		try {
			setLoadingMap({ [sessionId]: true });
			if (!allowanceAmount) {
				await tryApproval(true)
					.then(() => {
						message.success(myProfileConstants.TRANSACTION_COMFIRMATION);
					})
					.catch(() => {
						message.error(myProfileConstants.TRANSACTION_REJECTED);
					});
			}
			const res = await getDNFTSignature(sessionId);
			const { session_id, signature, token_ids, time_stamp } = get(
				res,
				'data.data'
			);

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

	return (
		<BoxPool>
			<div className={'flex justify-between items-start mb-3'}>
				<h5 className={`text-h6 font-semibold text-white`}>My dNFT</h5>
				<button
					disabled={!dnft_claimable_count || get(loadingMap, 'claimAll')}
					onClick={() => handleClaimAll(dnft_claimable_count)}
					className={
						'desktop:hidden text-h8 text-white rounded-[40px] py-2 border-[2px] border-white/[0.3] min-w-[7.125rem]'
					}
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
							emptyOption='All statuses'
							onClick={(value) => {
								setPage(1);
								setStatus(value.key);
							}}
							customStyle={'!w-1/2 desktop:!w-[160px]'}
							list={RARITY_DNFT}
							title='All statuses'
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
						disabled={!dnft_claimable_count || get(loadingMap, 'claimAll')}
						onClick={() => handleClaimAll(dnft_claimable_count)}
						className={
							'hidden desktop:block text-h8 text-white rounded-[40px]  py-2 border-[2px] border-white/[0.3] min-w-[7.125rem]'
						}
					>
						{get(loadingMap, 'claimAll') ? <Spin size='small' /> : 'Claim all'}
					</button>
				</div>

				<MyTable
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
