import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/authContext';
import { MainLayout } from './components/layout/MainLayout';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { BudgetPage } from './pages/BudgetPage';
import { MapPage } from './pages/MapPage';
import { SchemesPage } from './pages/SchemesPage';
import { SchemeDetailPage } from './pages/SchemeDetailPage';
import { SchemeRecommendPage } from './pages/SchemeRecommendPage';
import { SchemeComparePage } from './pages/SchemeComparePage';
import { CivicIssuesPage } from './pages/CivicIssuesPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { GramSabhaPage } from './pages/GramSabhaPage';
import { FarmersPage } from './pages/FarmersPage';
import { ServicesPage } from './pages/ServicesPage';
import { EmploymentPage } from './pages/EmploymentPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { DocumentIntelligencePage } from './pages/DocumentIntelligencePage';
import { AdminPage } from './pages/AdminPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { WelcomeSplash } from './components/common/WelcomeSplash';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <WelcomeSplash durationMs={2500} />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetailPage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="schemes" element={<SchemesPage />} />
            <Route path="schemes/:id" element={<SchemeDetailPage />} />
            <Route path="schemes/recommend" element={<SchemeRecommendPage />} />
            <Route path="schemes/compare" element={<SchemeComparePage />} />
            <Route path="budgets" element={<BudgetPage />} />
            <Route path="issues" element={<CivicIssuesPage />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="gram-sabha" element={<GramSabhaPage />} />
            <Route path="farmers" element={<FarmersPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="employment" element={<EmploymentPage />} />
            <Route path="assistant" element={<AIAssistantPage />} />
            <Route path="documents" element={<DocumentIntelligencePage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
