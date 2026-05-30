import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import HomePage from './pages/Home/Home';
import ProductsPage from './pages/Products/Products';
import ProductDetailPage from './pages/ProductDetail/ProductDetail';
import AboutPage from './pages/About/About';
import ContactPage from './pages/Contact/Contact';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminAddProduct from './pages/Admin/AdminAddProduct';
import AdminEditProduct from './pages/Admin/AdminEditProduct';
import LoginModal from './components/LoginModal/LoginModal';
import { AuthProvider } from './context/AuthContext';
import ZaloWidget from './components/ZaloWidget/ZaloWidget';
import './assets/styles/global.css';

// Public layout containing visitor header and footer
const PublicLayout = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/san-pham" element={<ProductsPage />} />
        <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
        <Route path="/gioi-thieu" element={<AboutPage />} />
        <Route path="/lien-he" element={<ContactPage />} />
        
        {/* Fallback for unknown public paths */}
        <Route path="*" element={<HomePage />} />
      </Routes>
      <ZaloWidget />
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <LoginModal />
        
        <Routes>
          {/* Admin panel — dedicated dashboard viewport */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products/add" element={<AdminAddProduct />} />
          <Route path="/admin/products/edit/:id" element={<AdminEditProduct />} />

          {/* Public guest portal */}
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
