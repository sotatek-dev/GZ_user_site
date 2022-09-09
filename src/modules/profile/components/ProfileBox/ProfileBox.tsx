import React from 'react';

import style from './ProfileBox.module.scss';
import { Button, Divider, Input } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

export default function ProfileBox() {
	return (
		<div className={style['profile-box']}>
			<div className={style['title']}>My profile</div>
			<Divider className={style['divider']} />

			<div className={style['form-field']}>
				<div className={style['label']}>My wallet address:</div>
				<div className={style['input-group']}>
					<Input
						className={style['input']}
						placeholder='0xa0bE275692b70a3E7ffa7e41daB2D90E8EbE0aCb '
						suffix={<CopyOutlined className={style['suffix']} />}
					/>
				</div>
			</div>
			<Divider className={style['divider']} />
			<div className={style['form-field']}>
				<div className={style['label']}>Email address: </div>
				<Input className={style['input']} placeholder='long.ngosotatek.com' />
			</div>
			<Divider className={style['divider']} />
			<div className={style['form-field']}>
				<div className={style['label']}>Number of key(s): </div>
				<Input className={style['input']} placeholder='2' type='number' />
			</div>

			<div className={style['btn-field']}>
				<Button className={style['save-btn']}>Save</Button>
			</div>
		</div>
	);
}
