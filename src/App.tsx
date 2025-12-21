import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './appwrite/auth/Login';
import Register from './appwrite/auth/Register';
import PresentationList from './appwrite/components/PresentationList';
import EditorLayout from './appwrite/auth/EditorLayout';
import AuthWrapper from './appwrite/auth/AuthWrapper';
import Player from './appwrite/auth/Player';
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
