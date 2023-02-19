export function tryKeyword(keyword, authToken, delay) {
	return new Promise((resolve, reject) => {
		console.log('TRYING: ' + keyword)
		setTimeout(() => {
			fetch("https://excelplay-backend-kryptos-xgveswperq-uc.a.run.app/api/submit", {
  				"headers": {
    			"accept": "application/json",
				"authorization": authToken,
				"content-type": "application/json",
  				},
  				"body": JSON.stringify({
					answer: keyword,
					}),
  				"method": "POST"
			})	
				.then((res) => res.json())
				.then((data) => {
					console.log(data)
					if (data.error) throw new Error('authToken')
					if (data.answer === 'wrong') resolve({ correct: false })
					else resolve({ correct: true })
				})
				.catch((err) => {
					console.error(err)
					reject(err)
				})
		}, delay)
	})
}
