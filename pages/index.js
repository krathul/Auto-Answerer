import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { tryKeyword } from '../lib/try-keyword'
import { scrapeKeywords } from '../lib/scrape-keywords'
import { ToastContainer, toast } from 'react-toastify'
import Head from 'next/head'
import Keywords from '../components/Keywords'
import Navbar from '../components/Navbar'
import Queue from '../components/Queue'
import Setup from '../components/Setup'
import Correct from '../components/Correct'

export default function Home() {
	const [queueKeywords, setQueueKeywords] = useState([])

	const [setupKeywords, setSetupKeywords] = useState([])

	const [authToken, setAuthToken] = useState('')

	const [url, setUrl] = useState('')
	const [cssSelectors, setCssSelectors] = useState('')

	const [delay, setDelay] = useState(0)
	const [correct, setCorrect] = useState('')
	const [playing, setPlaying] = useState(false)
	const [trying, setTrying] = useState('')
	const [elapsed, setElapsed] = useState(0)
	const [remaining, setRemaining] = useState(0)

	const playQueueEffect = useRef(false)
	const playingRef = useRef(false)

	useEffect(() => {
		let aTkn = window?.localStorage?.getItem('authToken')
		setAuthToken(aTkn || '')
	}, [])

	useEffect(() => {
		playingRef.current = playing
		if (playQueueEffect.current) {
			playQueueEffect.current = false
			if (playing) play()
		}
	}, [playing, queueKeywords])

	useEffect(() => {
		if (correct) toast.success(`Correct: ${correct}`)
	}, [correct])

	useEffect(() => {
		if (window) {
			window.localStorage.setItem('authToken', authToken)
		}
	}, [authToken])

	function handleScrapeKeywords() {
		let scrape = scrapeKeywords(url, cssSelectors).then((keywords) => {
			let temp = keywords.map((item) => {
				return {
					id: uuidv4(),
					keyword: item,
				}
			})
			setSetupKeywords(temp)
		})

		toast.promise(scrape, {
			pending: 'Scrapping keywords 🛠',
			success: 'Keywords scraped',
			error: 'Failed to scrape webpage ❗️',
		})
	}

	async function play() {
		if (!playing) return
		let complete = true
		for (let keyword of queueKeywords) {
			if (keyword.status === 'tried') continue

			if (keyword.status === 'pending' && playingRef.current) {
				playQueueEffect.current = true
				setTrying(keyword.keyword)
				setQueueKeywords((queueKeywords) =>
					queueKeywords.map((item) => {
						if (item.id === keyword.id) return { ...item, status: 'trying' }
						return item
					})
				)
			} else if (keyword.status === 'trying') {
				let res
				try {
					res = await tryKeyword(keyword.keyword, authToken, delay)
				} catch (err) {
					if (err.message === 'authToken') toast.error('Auth token invalid ❗️')
					else toast.error('Failed to try keyword ⚠️')
					setPlaying(false)
					return
				}

				if (playingRef.current) {
					playQueueEffect.current = true
					setTrying('')
					setQueueKeywords((queueKeywords) =>
						queueKeywords.map((item) => {
							if (item.id === keyword.id) return { ...item, status: 'tried' }
							return item
						})
					)
					if (res?.correct) {
						setCorrect(keyword.keyword)
						setPlaying(false)
					}
				}
			}

			complete = false
			break
		}
		if (complete) setPlaying(false)
	}

	function handleQueueDelete(id) {
		setQueueKeywords((queueKeywords) => queueKeywords.filter((item) => item.id !== id))
	}
	function handleSetupDelete(id) {
		setSetupKeywords((setupKeywords) => setupKeywords.filter((item) => item.id !== id))
	}
	function handleAdd(keyword) {
		if (!keyword) return
		setSetupKeywords((setupKeywords) => [{ id: uuidv4(), keyword: keyword }, ...setupKeywords])
	}
	function handleAddToQueue() {
		setQueueKeywords((queueKeywords) => {
			const temp = setupKeywords.map((item) => {
				return { ...item, status: 'pending' }
			})
			return [...queueKeywords, ...temp]
		})
		setSetupKeywords([])
	}

	function handlePlayPause() {
		setPlaying((playing) => {
			if (!playing) playQueueEffect.current = true
			return !playing
		})
	}
	function handleStop() {
		setPlaying(false)
		setQueueKeywords((queueKeywords) =>
			queueKeywords.map((item) => {
				return { ...item, status: 'pending' }
			})
		)
	}
	function handleQueueReset() {
		setPlaying(false)
		setQueueKeywords([])
	}

	function triedCount() {
		return queueKeywords.filter((item) => item.status === 'tried').length
	}
	function queueAllTried() {
		if (queueKeywords.length === 0) return false
		for (let keyword of queueKeywords) {
			if (keyword.status !== 'tried') return false
		}
		return true
	}
	function pageTitle() {
		if (correct) return `Correct: ${correct}`
		if (queueKeywords.length != 0) return `Auto Answerer  ${triedCount()}/${queueKeywords.length}`
		if (queueAllTried()) return `Auto Answerer - All tried`
		return 'Auto Answerer'
	}

	return (
		<div className='flex flex-col h-screen min-h-fit'>
			<Head>
				<title>{pageTitle()}</title>
			</Head>
			<Navbar authToken={authToken} onAuthToken={setAuthToken} />
			<div className='flex flex-1'>
				<div className={`flex flex-col flex-1 border-right`}>
					<Setup
						url={url}
						cssSelectors={cssSelectors}
						onUrl={setUrl}
						onCssSelectors={setCssSelectors}
						onSubmit={handleScrapeKeywords}
					/>
					<Keywords
						keywords={setupKeywords}
						onAdd={handleAdd}
						onAddToQueue={handleAddToQueue}
						onReset={() => setSetupKeywords([])}
						onDelete={handleSetupDelete}
					/>
				</div>
				<div className='flex flex-col flex-1'>
					{correct && <Correct keyword={correct} onClose={() => setCorrect('')} />}
					<Queue
						keywords={queueKeywords}
						playing={playing}
						trying={trying}
						elapsed={elapsed}
						remaining={remaining}
						onPlayPause={handlePlayPause}
						onStop={handleStop}
						onReset={handleQueueReset}
						onDelete={handleQueueDelete}
					/>
				</div>
			</div>
			<ToastContainer />
		</div>
	)
}
