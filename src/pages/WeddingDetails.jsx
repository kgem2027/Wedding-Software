import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

const REGISTRY_API = "/api/registry"

const WeddingDetails = () => {
  const location = useLocation()
  const wedding = location.state

  const [registryItems, setRegistryItems] = useState([])
  const [registryLoading, setRegistryLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRegistryItems = async () => {
      try {
        setError(null)
        const res = await axios.get(
          `${REGISTRY_API}/registryItemsByWeddingId/${wedding._id}`
        )
        setRegistryItems(res.data)
      } catch (err) {
        console.error("Error fetching registry items:", err)
        setError("Failed to load registry items.")
      } finally {
        setRegistryLoading(false)
      }
    }

    if (wedding?._id) {
      fetchRegistryItems()
    }
  }, [wedding])

  if (!wedding) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center font-serif text-stone-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Wedding Details</h1>
          <p className="text-stone-400 text-sm font-sans">No wedding data found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 font-serif text-stone-900 flex flex-col">
      <div className="border-b-2 border-stone-900 px-8 py-5 pt-20 flex items-end justify-between flex-shrink-0">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{wedding.weddingName}</h1>
          <div className="flex gap-4 mt-1 text-sm text-stone-400 font-sans flex-wrap">
            <span>{wedding.weddingDate}</span>
            {wedding.plannerId?.name && <span>Planner: {wedding.plannerId.name}</span>}
            <span className="capitalize">{wedding.privacy}</span>
          </div>
        </div>

        <span className="text-xs font-sans text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full">
          Guest View
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-6 border-r border-stone-200">
          <h2 className="text-lg font-bold text-stone-700 mb-4 flex items-center gap-2">
            Registry Items
            <span className="text-xs font-sans font-normal bg-stone-900 text-white rounded-full px-2.5 py-0.5">
              {registryItems.length}
            </span>
          </h2>

          {error && (
            <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-md px-3 py-2 font-sans">
              {error}
            </p>
          )}

          {registryLoading ? (
            <p className="text-stone-400 italic text-sm font-sans">Loading registry…</p>
          ) : registryItems.length === 0 ? (
            <p className="text-stone-400 italic text-sm">No registry items found.</p>
          ) : (
            <ul className="space-y-3">
              {registryItems.map((item) => (
                <li
                  key={item._id}
                  className="bg-white border border-stone-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-semibold text-stone-900">
                        {item.itemName}
                      </span>
                      <span className="text-xs text-stone-400 font-sans">
                        Qty: {item.quantity}&nbsp;&nbsp;·&nbsp;&nbsp;Store: {item.store}
                      </span>

                      {item.description && (
                        <p className="text-sm text-stone-500 mt-0.5">{item.description}</p>
                      )}

                    {item.link ? (
                    <a
                        href={item.link.startsWith("http") ? item.link : `https://${item.link}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-sans"
                    >
                        View Item →
                    </a>
                    ) : (
                    <span className="text-stone-400 text-sm italic">No link provided</span>
                    )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="w-80 flex-shrink-0 overflow-y-auto px-8 py-6 bg-white">
          <h2 className="text-lg font-bold text-stone-700 mb-5">Wedding Details</h2>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wide font-sans mb-0.5">
                Wedding
              </p>
              <p className="text-sm text-stone-800">{wedding.weddingName}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wide font-sans mb-0.5">
                Date
              </p>
              <p className="text-sm text-stone-800">{wedding.weddingDate}</p>
            </div>

            {wedding.plannerId?.name && (
              <div>
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wide font-sans mb-0.5">
                  Planner
                </p>
                <p className="text-sm text-stone-800">{wedding.plannerId.name}</p>
              </div>
            )}

            <div>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wide font-sans mb-0.5">
                Privacy
              </p>
              <p className="text-sm text-stone-800 capitalize">{wedding.privacy}</p>
            </div>

            <div className="border-t border-stone-100 pt-4">
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wide font-sans mb-2">
                Guests
              </p>
              <p className="text-sm text-stone-800">
                {wedding.accessList?.length ?? 0} people
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeddingDetails