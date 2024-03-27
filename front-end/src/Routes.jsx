import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import PaginaLogin from "./pages/Login"
import Registration from "./pages/Registration"
import DashBoard from "./pages/Menu"


export default function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<PaginaLogin />} />
				<Route path="/registration" element={<Registration />} />
				<Route path="dashboard" element={<DashBoard />} />
			</Routes>
		</BrowserRouter>
	)
}
