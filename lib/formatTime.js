export function formatTime(s) {
	if (isNaN(s)) return { seconds: 0, minutes: null, hours: null }
	let seconds = s % 60
	let minutes = Math.floor(s / 60) % 60
	let hours = Math.floor(s / 3600)
	let res = { seconds, minutes: minutes === 0 ? null : minutes, hours: hours === 0 ? null : hours }
	return res
}
