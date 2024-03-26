import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import PaginaLogin from "./pages/Login"

export default function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<PaginaLogin />} />
			</Routes>
		</BrowserRouter>
	)
}
