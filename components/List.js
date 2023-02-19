import { MdClose } from 'react-icons/md'
import styles from './list.module.css'

export default function List({ keywords, onDelete }) {
	return (
		<div className={styles['list']}>
			{keywords.length == 0 && <div className={styles['empty']}>Nothing here</div>}
			{keywords.length != 0 ? (
				<div className={styles['outer-container']}>
					<div className={styles['scroll-container']}>
						{keywords.map((item, index) => (
							<ListItem
								key={item.id}
								index={index + 1}
								keyword={item.keyword}
								status={item.status}
								onDelete={() => onDelete(item.id)}
							/>
						))}
					</div>
				</div>
			) : (
				''
			)}
		</div>
	)
}

function ListItem({ index, keyword, status, onDelete }) {
	return (
		<div className={styles['list-item']}>
			<div className='flex items-center flex-1'>
				<span className={styles['index']}>{index}</span>
				<span className={styles['keyword']}>{keyword}</span>
			</div>
			{status && <div className={`${styles['status']} ${styles[status]}`}>{status}</div>}
			<div className={styles['delete']} onClick={onDelete}>
				<MdClose />
			</div>
		</div>
	)
}
