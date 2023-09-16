import { useEffect } from "react";
import {BrowserRouter,Routes,Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import './App.css';

// Admin part
import Login from "./admin-page/auth/Login";
import Home from "./admin-page/Home/Home";
import Product from "./admin-page/Product/Product";
import AdminUser from "./admin-page/Admin-User/AdminUser";
import Category from "./admin-page/category/Category";
import UploadImage from "./admin-page/UploadImage/UploadImage";
import MultipleImage from "./admin-page/Multiple-Image/MultipleImage";

//Layout part
import Dashboard from "./component/Dashboard/Dashboard";
import RootLayout from "./component/RootLayout/RootLayout";

// Page part
import HomePage from "./page/Homepage/HomePage";
import ProductPage from "./page/ProductPage/ProductPage";
import Employee from "./admin-page/Employee/Employee";



function App() {
  const isLogin = localStorage.getItem("is_login") === "1";

  useEffect(() => {
    console.log(window.location.pathname)
  }, [window.location.pathname])

  const is_dashboard = window.location.pathname.includes("dashboard")
  return (
    <BrowserRouter basename="/">
      {/* page part */}
      {!is_dashboard && <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="product-page" element={<ProductPage />} />
          <Route path="*" element={<h1>Route Not Found!</h1>} />
        </Route>
      </Routes>
      }

      {is_dashboard &&
        <div>
          {!isLogin ? (
            // admin part
            <Routes>
              <Route path="dashboard" element={<Login />}>
                <Route path="*" element={<Navigate to="/dashboard/login" />} />
                <Route path='login' element={<Login />} />
              </Route>
            </Routes>
          ) : (
              <Dashboard>
                <Routes>
                  <Route path="dashboard" >
                    <Route index element={<Home />} />
                    <Route path="product" element={<Product />} />
                    <Route path="AdminUser" element={<AdminUser />} />
                    <Route path="category" element={<Category />} />
                    <Route path="upload-image" element={<UploadImage />} />
                    <Route path="multiple-image" element={<MultipleImage />} />
                    <Route path="employee" element={<Employee />} />
                    <Route path="*" element={<h1>Route Not Found!</h1>} />
                  </Route>
                </Routes>
              </Dashboard>
            )
          }
        </div>
      }
    </BrowserRouter>
  );
}

export default App;
