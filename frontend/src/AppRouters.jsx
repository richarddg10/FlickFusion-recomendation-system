import { Routes, Route } from 'react-router-dom'
import { WebPageRouters } from './routers/WebPageRouters'

export function AppRouters () {
    return (
      <>
        <main>
            <Routes>
                <Route
                  path='/*'
                  element={<WebPageRouters />}
                />
            </Routes>
        </main>
      </>
    )
  }
  