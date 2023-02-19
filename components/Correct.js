import { MdClose } from 'react-icons/md'

import styles from './correct.module.css'

export default function Correct({ keyword, onClose }) {
	return (
		<div className={styles['correct']}>
			<MdClose className={styles['close-icon']} onClick={onClose} />
			<span className={styles['heading']}>Correct answer</span>
			<h3 className={styles['keyword']}>{keyword}</h3>
		</div>
	)
}
