import { Routes, Route } from 'react-router-dom'
import { Home } from '../pages'

export function WebPageRouters() {
    return (
        <>
            <Routes>
                <Route
                    path='/'
                    element={<Home />}
                />
            </Routes>
        </>
    )
}