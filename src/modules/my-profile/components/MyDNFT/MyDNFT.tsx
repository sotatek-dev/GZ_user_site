import { useEffect, useState } from 'react';
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
import {
	DNFTStatus,
	DNFTStatuses,
} from 'modules/my-profile/components/MyDNFT/MyDNFT.constant';
import myProfileConstants from 'modules/my-profile/constant';
import { handleClaimError } from 'modules/my-profile/helpers/handleError';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from 'stores';
import { getMyClaimableDNFTsCountRD, getMyDNFTsRD } from 'stores/my-profile';
import { AbiDnft } from 'web3/abis/types';
import { NEXT_PUBLIC_DNFT } from 'web3/contracts/instance';
import { useContract } from 'web3/contracts/useContract';
import { useActiveWeb3React } from 'web3/hooks';
import DNFTABI from 'modules/web3/abis/abi-dnft.json';
import { IDNFT } from 'modules/my-profile/interfaces';

// If Presale 2 phase not active, BE set claim date to this
const TIMESTAMP_LIMIT_VALUE = 2147483647;
const AVAI_TO_UNMERGE = 30; // days

export default function MyDNFT() {
	const router = useRouter();
	const { dnfts, dnft_claimable_count, loading } = useAppSelector(
		(state) => state.myProfile
	);
	const { systemSetting } = useAppSelector((state) => state.systemSetting);
	const { isLogin } = useAppSelector((state) => state.user);
	const [type, setType] = useState<string>('');
	const [status, setStatus] = useState<string>('');
	const [page, setPage] = useState<number>(1);
	const dispatch = useAppDispatch();
	const dnftContract = useContract<AbiDnft>(DNFTABI, NEXT_PUBLIC_DNFT);
	const { account } = useActiveWeb3React();

	const [loadingMap, setLoadingMap] = useState({});

	useEffect(() => {
		if (isLogin) {
			handleGetDNFTs();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLogin, type, status, page]);

	useEffect(() => {
		handleGetClaimableNFTsCount();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dnfts?.pagination.total]);

	const claimableTime = systemSetting?.claim_date;
	const isPresale2Active =
		claimableTime != undefined && claimableTime !== TIMESTAMP_LIMIT_VALUE;

	const mutantDNFTs = (() => {
		if (!dnfts) {
			return [];
		}

		return dnfts.data.map((item) => {
			const _dnft = cloneDeep(item);
			const claimTemMergeTime = dayjs(_dnft.created_at).add(
				AVAI_TO_UNMERGE,
				'days'
			);
			const isOnClaimTemMergeTime = dayjs().isAfter(claimTemMergeTime);
			const isClaimTemMergeStatus =
				_dnft.status === DNFTStatuses.WaitToMerge && isOnClaimTemMergeTime;

			return {
				..._dnft,
				claimable_date: isPresale2Active
					? dayjs.unix(claimableTime).format('DD-MMMM-YYYY HH:mm')
					: '-',
				status: isClaimTemMergeStatus
					? DNFTStatuses.ClaimTemMerge
					: _dnft.status,
				onClick: () => {
					if (_dnft.status === DNFTStatuses.Claimable) {
						return handleClaim(_dnft._id);
					}

					if (_dnft.status === DNFTStatuses.WaitToMerge) {
						if (!isOnClaimTemMergeTime) return handleUnmerge(_dnft._id);
						return handleClaimTemMerge(_dnft._id);
					}
				},
			};
		});
	})();

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

	const handleClaimTemMerge = async (session_id: string) => {
		if (!dnftContract || !account) {
			return;
		}

		try {
			setLoadingMap({ [session_id]: true });

			const nonce = await getNonces(dnftContract, account);
			const res = await getDNFTSignature({ session_id, nonce });
			const { token_ids } = get(res, 'data.data');

			await dnftContract
				.executeTemporaryMerge(token_ids, session_id)
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

	const handleGetClaimableNFTsCount = async () => {
		if (dnfts && dnfts.pagination.total) {
			dispatch(getMyClaimableDNFTsCountRD(dnfts.pagination.total));
		}
	};

	const getExploreTxLink = (hash: string) => {
		return `${process.env.NEXT_PUBLIC_BSC_BLOCK_EXPLORER_URL}/tx/${hash}`;
	};

	const columns = [
		{
			title: 'Species',
			dataIndex: 'species',
			render: (Species: string) => {
				return <div>{Species}</div>;
			},
			width: '20%',
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
			render: (record: IDNFT & { onClick: () => void }) => {
				const dnftStatus = get(DNFTStatus, record.status);
				const isDoAction = get(loadingMap, record._id);
				const isDoClaimingAll = get(loadingMap, 'claimAll');
				const isEnableAction = !dnftStatus.disabled;

				return (
					<button
						disabled={!isEnableAction || isDoAction || isDoClaimingAll}
						onClick={(e) => {
							e.stopPropagation();
							record.onClick();
						}}
						className='text-[#D47AF5] leading-[22px] disabled:text-white/[.3] justify-center font-semibold rounded-[40px] !min-w-[100px] px-3 py-[7px] border-[2px] border-[#D47AF5] disabled:border-[#2B3A51] disabled:bg-[#2B3A51] flex ml-auto'
					>
						{isDoAction ? (
							<Spin
								size='small'
								style={{
									color: '#D47AF5',
								}}
							/>
						) : (
							get(dnftStatus, `title`)
						)}
					</button>
				);
			},
			width: '30%',
		},
	];

	let isAfterClaimTime = false;
	const currentDate = dayjs().unix();
	if (!!claimableTime && currentDate >= claimableTime) {
		isAfterClaimTime = true;
	}

	const canClaimAll =
		isAfterClaimTime && dnft_claimable_count && !get(loadingMap, 'claimAll');

	return (
		<BoxPool>
			<div className='flex justify-between items-start mb-3'>
				<h5 className='text-h6 font-semibold text-white'>My dNFT</h5>
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

			<hr className='border-t border-blue-20/[0.1]' />
			<div className='mt-6'>
				<div className='flex gap-x-2 mb-6 justify-between'>
					<div className='flex items-center justify-between desktop:justify-start grow gap-2.5'>
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
							customStyle='!w-1/2 desktop:!w-[160px]'
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
					onRow={(dnft) => {
						return {
							onClick: () => {
								if (
									includes(
										[DNFTStatuses.Claimed, DNFTStatuses.WaitToMerge],
										dnft.status
									)
								) {
									router.push(`/dnft-detail/${dnft._id}`);
								}
							},
						};
					}}
					columns={columns}
					dataSource={mutantDNFTs}
					className='hidden desktop:inline-block w-full'
				/>

				<div className='desktop:hidden'>
					{mutantDNFTs.map((dnft, item) => {
						const statusMap = get(DNFTStatus, dnft.status);
						const isLoading = get(loadingMap, dnft._id);
						const isClaimingAll = get(loadingMap, 'claimAll');

						return (
							<div
								className='flex flex-col gap-6 mb-6'
								key={item}
								onClick={() => {
									if (
										includes(
											[DNFTStatuses.Claimed, DNFTStatuses.WaitToMerge],
											dnft.status
										)
									) {
										router.push(`/dnft-detail/${dnft._id}`);
									}
								}}
							>
								<hr className='border-t border-white/[0.07]' />
								<button
									disabled={
										get(statusMap, 'disabled') || isLoading || isClaimingAll
									}
									onClick={(e) => {
										e.stopPropagation();
										dnft.onClick();
									}}
									className='text-[#D47AF5] leading-[22px] disabled:text-white/[.3] justify-center font-semibold rounded-[40px] !min-w-[100px] px-3 py-[7px] border-[2px] border-[#D47AF5] disabled:border-[#2B3A51] disabled:bg-[#2B3A51] flex ml-auto'
								>
									{isLoading ? <Spin size='small' /> : get(statusMap, `title`)}
								</button>

								<div className='flex justify-between items-center'>
									<div className='text-h8 text-blue-20 font-medium'>
										Species
									</div>
									<div className='text-h8 text-white font-bold'>
										{dnft.species}
									</div>
								</div>
								<div className='flex justify-between items-center'>
									<div className='text-h8 text-blue-20 font-medium'>Rarity</div>
									<div className='text-h8 text-white font-bold'>
										{dnft.rank_level}
									</div>
								</div>
								<div className='flex justify-between items-center'>
									<div className='text-h8 text-blue-20 font-medium'>
										Claimable date
									</div>
									<div className='text-h8 text-white font-bold'>
										{dnft.claimable_date}
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
