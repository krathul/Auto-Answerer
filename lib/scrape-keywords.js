export function scrapeKeywords(url, cssSelectors) {
	return new Promise((resolve, reject) => {
		fetch(`http://localhost:5500/scrape-keywords`, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({
				url,
				cssSelectors,
			}),
		})
			.then((res) => res.json())
			.then((data) => resolve(data.keywords))
			.catch(reject)
	})
}
