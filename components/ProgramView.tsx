
import React, { useState } from 'react';
import type { Program, ProgramModule } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Modal from './common/Modal';

interface ProgramViewProps {
  program: Program;
  setProgram: (program: Program) => void;
}

const ModuleForm: React.FC<{ onSave: (module: Omit<ProgramModule, 'id'>) => void; onClose: () => void; initialData?: ProgramModule | null }> = ({ onSave, onClose, initialData }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [topics, setTopics] = useState(initialData?.topics.join(', ') || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, topics: topics.split(',').map(t => t.trim()) });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Titre du module</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Thèmes (séparés par des virgules)</label>
                <textarea value={topics} onChange={e => setTopics(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>
            <div className="flex justify-end space-x-2">
                <Button onClick={onClose} variant="secondary">Annuler</Button>
                <Button type="submit">Sauvegarder</Button>
            </div>
        </form>
    );
}

const ProgramView: React.FC<ProgramViewProps> = ({ program, setProgram }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ProgramModule | null>(null);

  const handleSaveModule = (moduleData: Omit<ProgramModule, 'id'>) => {
    if (editingModule) {
      setProgram({ ...program, modules: program.modules.map(m => m.id === editingModule.id ? { ...editingModule, ...moduleData } : m) });
    } else {
      const newModule: ProgramModule = { ...moduleData, id: `module-${Date.now()}` };
      setProgram({ ...program, modules: [...program.modules, newModule] });
    }
    setIsModalOpen(false);
    setEditingModule(null);
  };
  
  const handleDeleteModule = (id: string) => {
      setProgram({ ...program, modules: program.modules.filter(m => m.id !== id)});
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">{program.title}</h1>
      
      <Card className="mb-8 bg-indigo-50 border-indigo-200">
        <h2 className="text-2xl font-bold text-indigo-800 mb-3">Objectifs Annuels</h2>
        <ul className="list-disc list-inside space-y-1 text-indigo-700">
          {program.goals.map((goal, index) => <li key={index}>{goal}</li>)}
        </ul>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-gray-700">Modules du Programme</h2>
        <Button onClick={() => { setEditingModule(null); setIsModalOpen(true); }}>Ajouter un Module</Button>
      </div>

      <div className="space-y-6">
        {program.modules.map(module => (
          <Card key={module.id}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{module.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {module.topics.map((topic, i) => (
                    <span key={i} className="px-3 py-1 bg-green-200 text-green-800 text-sm font-medium rounded-full">{topic}</span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2 flex-shrink-0">
                  <Button onClick={() => { setEditingModule(module); setIsModalOpen(true); }} variant="secondary" size="sm">Éditer</Button>
                  <Button onClick={() => handleDeleteModule(module.id)} variant="danger" size="sm">Supprimer</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {isModalOpen && (
          <Modal title={editingModule ? "Éditer le module" : "Ajouter un module"} onClose={() => setIsModalOpen(false)}>
              <ModuleForm onSave={handleSaveModule} onClose={() => setIsModalOpen(false)} initialData={editingModule} />
          </Modal>
      )}
    </div>
  );
};

export default ProgramView;
