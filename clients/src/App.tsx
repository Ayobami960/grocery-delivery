import { Toaster } from "react-hot-toast"
import { Route, Routes } from "react-router"
import Login from "./page/Login"
import AppLayout from "./page/AppLayout"
import Home from "./page/Home"
import ProductPage from "./page/ProductPage"
import SearchResults from "./page/SearchResults"
import FlashDeals from "./page/FlashDeals"
import OrderTracking from "./page/OrderTracking"
import MyOrders from "./page/MyOrders"
import Checkout from "./page/Checkout"
import Addresses from "./page/Addresses"
import ProtectedRoute from "./components/ProtectedRoute"
import Product from "./page/Product"
import AdminLayout from "./page/admin/AdminLayout"
import AdminDashboard from "./page/admin/AdminDashboard"
import AdminProducts from "./page/admin/AdminProducts"
import AdminProductForm from "./page/admin/AdminProductForm"
import AdminOrders from "./page/admin/AdminOrders"
import AdminDeliveryPartners from "./page/admin/AdminDeliveryPartners"
import DeliveryLogin from "./page/delivery/DeliveryLogin"
import DeliveryLayout from "./page/delivery/DeliveryLayout"
import DeliveryDashboard from "./page/delivery/DeliveryDashboard"


function App() {

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        duration: 3000, style: {
          background: "#1B3022", color: "#fff", borderRadius: "12px", fontSize: "14px"
        }
      }} />


      <Routes>
        {/* Auth page - No Navbar/Footer */}
        <Route path="/login" element={<Login />} />

        {/* Mani pages - with Navbar/Footer */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Product />} />   
          <Route path="products/:id" element={<ProductPage />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="deals" element={<FlashDeals />} />
          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="orders/:id" element={<OrderTracking />} />
            <Route path="addresses" element={<Addresses />} />
          </Route>
        </Route>

        {/* Admin pages */}
        <Route path="/admin" element={<AdminLayout />} >
        <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />   
          <Route path="products/new" element={<AdminProductForm />} />   
          <Route path="products/:id/edit" element={<AdminProductForm />} />   
          <Route path="orders" element={<AdminOrders />} />   
          <Route path="delivery-partners" element={<AdminDeliveryPartners />} />   
        </Route>

        {/* delivery-partners */}
        <Route path="/delivery/login" element={<DeliveryLogin />} />
         <Route path="/delivery" element={<DeliveryLayout />} >
          <Route index element={<DeliveryDashboard />} />   
        </Route>
        
      </Routes>
    </>
  )
}

export default App
