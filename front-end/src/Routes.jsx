import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import PaginaLogin from "./pages/Login"
import Registration from "./pages/Registration"

export default function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<PaginaLogin />} />
				<Route path="/registration" element={<Registration />} />
			</Routes>
		</BrowserRouter>
	)
}
