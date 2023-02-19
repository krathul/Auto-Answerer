import { useState } from 'react'
import { IoMdAddCircle, IoMdRefresh } from 'react-icons/io'
import List from './List'
import styles from './keywords.module.css'

export default function Keywords({ keywords, onAdd, onAddToQueue, onReset, onDelete }) {
	const [addText, setAddText] = useState('')

	function handleAdd(e) {
		e.preventDefault()
		onAdd(addText)
		setAddText('')
	}

	return (
		<div className={styles['keywords']}>
			<div className='flex items-center mb-4'>
				<h2 className='mr-3'>Keywords</h2>
				<div className='num-wrapper'>{keywords.length}</div>
			</div>

			<div className='flex items-center justify-between mb-4'>
				<form onSubmit={handleAdd} className='flex items-center'>
					<input
						type='text'
						placeholder='Enter keyword'
						value={addText}
						onChange={(e) => setAddText(e.target.value)}
					/>
					<button className='ml-3 btn-blue' type='submit'>
						Add
					</button>
				</form>

				<div className='flex items-center'>
					<button className='btn-pink mr-3' onClick={onAddToQueue}>
						<IoMdAddCircle className='text-lg mr-1' />
						<span>Queue</span>
					</button>
					<button className='btn-circle btn-grey' onClick={onReset}>
						<IoMdRefresh className='text-xl' />
					</button>
				</div>
			</div>

			<List keywords={keywords} onDelete={onDelete} />
		</div>
	)
}
