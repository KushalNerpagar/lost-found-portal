import { useState } from 'react'
import LostForm from './components/LostForm'
import FoundForm from './components/FoundForm'
import LostList from './components/LostList'
import FoundList from './components/FoundList'
import MatchList from './components/MatchList'

const TABS = ['Report Items', 'Lost Items', 'Found Items', 'Matches']

function App() {
  const [activeTab, setActiveTab] = useState('Report Items')
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = () => setRefreshKey((k) => k + 1)

  return (
    <main className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
        <h1 className="text-center text-3xl font-bold text-slate-800 underline underline-offset-4"> Lost & Found</h1>

        <div className="flex gap-2 rounded-xl bg-white p-1 shadow">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${activeTab === tab
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Report Items' && (
          <div className="grid gap-6 md:grid-cols-2">
            <LostForm onSubmit={refresh} />
            <FoundForm onSubmit={refresh} />
          </div>
        )}
        {activeTab === 'Lost Items' && <LostList key={refreshKey} />}
        {activeTab === 'Found Items' && <FoundList key={refreshKey} />}
        {activeTab === 'Matches' && <MatchList key={refreshKey} />}
      </div>
    </main>
  )
}

export default App