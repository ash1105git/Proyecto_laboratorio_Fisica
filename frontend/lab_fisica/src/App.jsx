import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"

import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import HomePage from "./pages/HomePage"
import EquipmentPage from "./pages/EquipmentPage"
import EquipmentDetailPage from "./pages/EquipmentDetails"
import CreateEquipment from "./pages/CreateEquipment"
import ProtectedRoute from "./ProtectedRoute"
import { EquipmentsProvider } from "./context/EquipmentsContext"
import Navbar from "./components/Navbar/Navbar"
import { LoanCartProvider } from "./context/loanContext"
import LoanPage from "./pages/LoanPage"
import LoanHistory from "./pages/LoanHistory"
import AdminLoan from "./pages/AdminLoan"
import LoanReceipt from "./pages/LoanReceipt"
import Dashboard from "./components/Dashboard/Dashboard"
import AcceptLoan from "./pages/AcceptLoan"

function App() {


  return (
    <LoanCartProvider>
    <AuthProvider>
      <EquipmentsProvider>
      <BrowserRouter>
      
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/equipments" element={<EquipmentPage />} />
          <Route path="/equipment/:id" element={<EquipmentDetailPage />} />
          <Route path="/loan" element={<LoanPage />} />
          <Route path="/loan-history" element={<LoanHistory />} />
          <Route path="/loans/:id/receipt" element={<LoanReceipt />} />

          {/* Rutas protegidas */}

          <Route element={<ProtectedRoute />}>
            <Route path="/admin/loans" element={<AdminLoan />} />
            <Route path="/add-equipment" element={<CreateEquipment />} />
            <Route path="/equipments/:id" element={<CreateEquipment />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/loans/:id/accept" element={<AcceptLoan />} />
          </Route>
        </Routes>

      </BrowserRouter>
      </EquipmentsProvider>
    </AuthProvider>
    </LoanCartProvider>
  )
}

export default App
