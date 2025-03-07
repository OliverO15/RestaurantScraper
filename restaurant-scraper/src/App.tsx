import { useEffect, useState } from 'react'
import './App.css'
import { getResturantsInstagram } from './services/scraper-api-service'
import Papa from 'papaparse'
import { saveAs } from 'file-saver'
import { Restaurant } from './types/types'

function App() {
  const [numRequests, setNumRequests] = useState(1)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(false)
  const [requestsSent, setRequestsSent] = useState(0)

  const handleNumRequestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumRequests(parseInt(e.target.value))
  }

  const fetchRestaurants = async () => {
    const newRestaurants = await getResturantsInstagram(numRequests)
    const updatedRestaurants = [...restaurants, ...newRestaurants]
    setRestaurants(updatedRestaurants)

    // Save the restaurants to localstorage
    localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants))

    // Update the number of requests sent
    setRequestsSent(requestsSent + (1 * numRequests))
    localStorage.setItem('requestsSent', (requestsSent + (1 * numRequests)).toString())
  }

  const downloadCSV = () => {
    // Convert the restaurants data to CSV format
    const csv = Papa.unparse(restaurants)

    // Create a Blob from the CSV and save it
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'restaurants.csv')
  }

  const resetList = () => {
    setRestaurants([])
  }

  // Fetch restaurants from localstorage
  useEffect(() => {
    const restaurants = localStorage.getItem('restaurants')
    if (restaurants) {
      setRestaurants(JSON.parse(restaurants))
    }

    const requestsSent = localStorage.getItem('requestsSent')
    if (requestsSent) {
      setRequestsSent(parseInt(requestsSent))
    }
  }, [])

  return (
    <>
      <div className="flex flex-col gap-10 items-center">
        <div className="top-content flex flex-col gap-5 max-w-lg items-center">
          <h1>Paris Restaurant Fetcher</h1>
          <h4><b>Instructions & Usage</b></h4>
          <p>This uses Google Places to get restaurants at a random location in <b>Paris</b>. 
          It then finds the instagram link inside the website of the restaurants it finds, 
          if it doesn't find the instagram link it skippes that restaurant. <br /> <br />
          The list can than be downloaded as a CSV file. <br /> <br />
          Note: This can take a long time to process.
          </p>
        </div>
        <div className="main-content flex flex-col gap-5">
          <label htmlFor="num-requests-slider">Slide to select the number of restaurants to search for</label>
          <input type="range" id="num-requests-slider" name="num-requests-slider" min="1" max="5" value={numRequests} onChange={handleNumRequestsChange}/>
          <button onClick={async () => {
            setLoading(true)
            await fetchRestaurants()
            setLoading(false)
          }} disabled={loading || requestsSent >= 500}>
            {loading ? 'Fetching...' : requestsSent >= 500 ? 'Reached your Limit' : `Fetch ${numRequests * 20} Restaurants`}
          </button>
        </div>

        {restaurants.length > 0 && (
          <>
          <div className="flex flex-col gap-5 w-full">
            <div className="flex flex-row gap-5 w-full">
              <button onClick={resetList}>Reset</button>
              <button onClick={downloadCSV}>Download CSV</button>
            </div>
            <table className='border-collapse border border-gray-400'>
              <thead>
                <tr>
                  <th className='border border-gray-300'>Name</th>
                  <th className='border border-gray-300'>Website</th>
                  <th className='border border-gray-300'>Instagram</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((restaurant: Restaurant, index) => (
                  <tr key={index}>
                    <td className='border border-gray-300'>{restaurant.name}</td>
                    <td className='border border-gray-300'><a href={restaurant.website}>{restaurant.website}</a></td>
                    <td className='border border-gray-300'><a href={restaurant.instagram_url}>{restaurant.instagram_url}</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </>
  )
}

export default App