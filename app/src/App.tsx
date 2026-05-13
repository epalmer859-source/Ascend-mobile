import { useState, useEffect } from 'react';
import { CartProvider } from '@/hooks/useCart';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WelcomePage } from '@/pages/WelcomePage';
import { HomePage } from '@/pages/HomePage';
import { WhyAscendPage } from '@/pages/WhyAscendPage';
import { AboutPage } from '@/pages/AboutPage';
import { SystemPage } from '@/pages/SystemPage';
import { FormulationPage } from '@/pages/FormulationPage';
import { ShopPage } from '@/pages/ShopPage';
import { ProductPage } from '@/pages/ProductPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { ReviewsPage } from '@/pages/ReviewsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SubscriptionsPage } from '@/pages/SubscriptionsPage';
import { OrderHistoryPage } from '@/pages/OrderHistoryPage';
import { SignInPage } from '@/pages/SignInPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { MyAccountPage } from '@/pages/MyAccountPage';
import { ContactPage } from '@/pages/ContactPage';
import { ComparePage } from '@/pages/ComparePage';

function App() {
  const [page, setPage] = useState('Welcome');

  // After Stripe payment, return URL has ?checkout=success — open Checkout (review step)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') setPage('Checkout');
  }, []);

  const productId = page.startsWith('Product:') ? parseInt(page.replace('Product:', ''), 10) : null;

  const renderPage = () => {
    if (productId) return <ProductPage productId={productId} setPage={setPage} />;
    switch (page) {
      case 'Welcome':
        return <WelcomePage setPage={setPage} />;
      case 'Home':
        return <HomePage setPage={setPage} />;
      case 'About':
        return <AboutPage setPage={setPage} />;
      case 'Why ASCEND':
        return <WhyAscendPage setPage={setPage} />;
      case 'Our System':
        return <SystemPage />;
      case 'Our Formulation':
        return <FormulationPage />;
      case 'Shop':
        return <ShopPage setPage={setPage} />;
      case 'Reviews':
        return <ReviewsPage />;
      case 'Contact':
        return <ContactPage />;
      case 'Compare':
        return <ComparePage setPage={setPage} />;
      case 'Cart':
        return <CartPage setPage={setPage} />;
      case 'Checkout':
        return <CheckoutPage setPage={setPage} />;
      case 'Profile':
        return <ProfilePage setPage={setPage} />;
      case 'Subscriptions':
        return <SubscriptionsPage setPage={setPage} />;
      case 'OrderHistory':
        return <OrderHistoryPage setPage={setPage} />;
      case 'SignIn':
        return <SignInPage setPage={setPage} />;
      case 'ForgotPassword':
        return <ForgotPasswordPage setPage={setPage} />;
      case 'MyAccount':
        return <MyAccountPage setPage={setPage} />;
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-[var(--bg)] text-white w-full max-w-[100vw] overflow-x-hidden">
          <Navigation page={page} setPage={setPage} />
          <main key={page} className="page-enter">{renderPage()}</main>
          {page !== 'Welcome' && <Footer setPage={setPage} />}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
