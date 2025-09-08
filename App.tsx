
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ClassesView from './components/ClassesView';
import StudentsView from './components/StudentsView';
import ProgramView from './components/ProgramView';
import LessonsView from './components/LessonsView';
import ActivitiesView from './components/ActivitiesView';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { View, AppData } from './types';
import { INITIAL_APP_DATA } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('DASHBOARD');
  const [data, setData] = useLocalStorage<AppData>('fle-logbook-data', INITIAL_APP_DATA);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const handleSelectClass = useCallback((classId: string) => {
    setSelectedClassId(classId);
    setActiveView('STUDENTS');
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'DASHBOARD':
        return <Dashboard data={data} onSelectClass={handleSelectClass} />;
      case 'CLASSES':
        return <ClassesView classes={data.classes} setClasses={(classes) => setData(prev => ({ ...prev, classes }))} onSelectClass={handleSelectClass} />;
      case 'STUDENTS':
        return <StudentsView 
                  classes={data.classes} 
                  setClasses={(classes) => setData(prev => ({...prev, classes}))} 
                  selectedClassId={selectedClassId} 
                  setSelectedClassId={setSelectedClassId} 
                />;
      case 'PROGRAM':
        return <ProgramView program={data.program} setProgram={(program) => setData(prev => ({ ...prev, program }))} />;
      case 'LESSONS':
        return <LessonsView lessons={data.lessons} setLessons={(lessons) => setData(prev => ({ ...prev, lessons }))} />;
      case 'ACTIVITIES':
        return <ActivitiesView activities={data.activities} setActivities={(activities) => setData(prev => ({ ...prev, activities }))} />;
      default:
        return <Dashboard data={data} onSelectClass={handleSelectClass}/>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
