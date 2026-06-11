import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/userContext';

import PublicRoute from './components/common/PublicRoute';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import PlaceList from './pages/places/PlaceList';
import PlaceDetail from './pages/places/PlaceDetail';
import Gallery from './pages/Gallery';
import GalleryPost from './pages/GalleryPost';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import Itinerary from './pages/Itinerary';

import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <UserProvider>
      <Routes>
        {/* Auth routes (no navbar) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Main app with Navbar on all these pages */}
        <Route element={<Layout />}>
          {/* Public pages */}
          <Route path="/home" element={<Home />} />
          <Route path="/places" element={<PlaceList />} />
          <Route path="/places/:id" element={<PlaceDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:placeId/:mediaId" element={<GalleryPost />} />

          {/* Protected pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/itinerary" element={<Itinerary />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="*"
          element={<ErrorPage code={404} />}
        />
        <Route
          path="*"
          element={<ErrorPage code={500} />}
        />
        <Route
          path="*"
          element={<ErrorPage code={403} />}
        />

      </Routes>
    </UserProvider>
  );
}

export default App;
