import LostForm from './components/LostForm'
import FoundForm from './components/FoundForm'
import ItemList from './components/ItemList'

function App() {
  return (
    <main className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
        <h1 className="text-center text-3xl font-bold text-slate-800">
          Lost and Found
        </h1>
        <div className="grid gap-6 md:grid-cols-2">
          <LostForm />
          <FoundForm />
        </div>
        <ItemList />
      </div>
    </main>
  )
}

export default App
