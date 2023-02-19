import styles from './navbar.module.css'

export default function Navbar({ authToken, onAuthToken }) {
	return (
		<nav className={styles['navbar']}>
			<h1>Auto Answerer</h1>
			<div className='flex items-center'>
				<span className='label mr-2'>Auth token</span>
				<input
					type='text'
					placeholder='Enter auth token'
					value={authToken}
					onChange={(e) => onAuthToken(e.target.value)}
				/>
			</div>
		</nav>
	)
}
