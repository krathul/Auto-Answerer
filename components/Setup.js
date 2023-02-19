import styles from './setup.module.css'

export default function Setup({ url, cssSelectors, onUrl, onCssSelectors, onSubmit }) {
	return (
		<div className={styles['setup']}>
			<h2 className=' mb-4'>Setup</h2>
			<div className='flex items-end'>
				<div className='flex flex-col flex-1 mr-3'>
					<span className='label mb-2'>Webpage URL</span>
					<input
						type='text'
						placeholder='Enter webpage URL'
						value={url}
						onChange={(e) => onUrl(e.target.value)}
					/>
				</div>
				<div className='flex flex-col flex-1 mr-3'>
					<span className='label mb-2'>CSS selectors</span>
					<input
						type='text'
						placeholder='Default: p a'
						value={cssSelectors}
						onChange={(e) => onCssSelectors(e.target.value)}
					/>
				</div>
				<button onClick={onSubmit}>Submit</button>
			</div>
		</div>
	)
}
