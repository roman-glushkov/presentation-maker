import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './services/auth/Login';
import Register from './services/auth/Register';
import PresentationList from './services/components/PresentationList';
import EditorLayout from './services/auth/EditorLayout';
import AuthWrapper from './services/auth/AuthWrapper';
import Player from './services/auth/Player';
import './appwrite/styles/AuthStyles.css';
import './common/view/styles.css';

function ProtectedRoutes() {
  return (
    <div className="presentation-body">
      <Routes>
        <Route path="/" element={<Navigate to="/presentations" replace />} />
        <Route path="/presentations" element={<PresentationList />} />
        <Route path="/editor" element={<EditorLayout />} />
        <Route path="/editor/:presentationId" element={<EditorLayout />} />
        <Route path="/player" element={<Player />} />
        <Route path="/player/:presentationId" element={<Player />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <AuthWrapper>
              <ProtectedRoutes />
            </AuthWrapper>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
