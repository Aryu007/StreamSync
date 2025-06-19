import React from 'react'
import { Routes, Route } from 'react-router';
import { HomePage } from './pages/HomePage.jsx';
import { SignUpPage } from './pages/SignUpPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { NotificationsPage } from './pages/NotificationsPage.jsx';
import { CallPage } from './pages/CallPage.jsx';
import { OnboardingPage } from './pages/OnboardingPage.jsx';
import { ChatPage } from './pages/ChatPage.jsx';
import { Toaster } from 'react-hot-toast';
import { axiosInstance } from './lib/axios.js';
import { useQuery } from '@tanstack/react-query';

const App = () => {
  //Tanstack Query
  const {data, isLoading, error} = useQuery({
    queryKey: ['exampleData'],
    queryFn: async () => {
      const response = await axiosInstance.get('/auth/me');
       return response.data;
    },
  });
  console.log(data, isLoading, error);
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/notifications" element ={<NotificationsPage />}/>
          <Route path="/call" element={<CallPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
        <Toaster/>
    </div>
  )
};

export default App;
