
import React from 'react';
import type { AppData } from '../types';
import Card from './common/Card';

interface DashboardProps {
  data: AppData;
  onSelectClass: (classId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onSelectClass }) => {
  const totalStudents = data.classes.reduce((acc, c) => acc + c.students.length, 0);

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Tableau de Bord</h1>
      <p className="text-lg text-gray-600 mb-8">Bienvenue dans votre journal de bord d'enseignant FLE !</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <h3 className="text-xl font-semibold">Classes</h3>
          <p className="text-5xl font-bold">{data.classes.length}</p>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <h3 className="text-xl font-semibold">Apprenants</h3>
          <p className="text-5xl font-bold">{totalStudents}</p>
        </Card>
        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <h3 className="text-xl font-semibold">Cours Planifiés</h3>
          <p className="text-5xl font-bold">{data.lessons.length}</p>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <h3 className="text-xl font-semibold">Activités</h3>
          <p className="text-5xl font-bold">{data.activities.length}</p>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Accès Rapide aux Classes</h2>
        {data.classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.classes.map(cls => (
              <Card key={cls.id} className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onSelectClass(cls.id)}>
                <h3 className="text-xl font-bold text-indigo-600">{cls.name}</h3>
                <p className="text-gray-500">Niveau: {cls.level}</p>
                <p className="text-gray-500">{cls.students.length} apprenant(s)</p>
                <p className="text-sm text-gray-400 mt-2">{cls.schedule}</p>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-center text-gray-500">Aucune classe n'a été ajoutée. Commencez par créer une nouvelle classe !</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
