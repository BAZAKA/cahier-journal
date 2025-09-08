
import React, { useState } from 'react';
import type { Class } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Modal from './common/Modal';

interface ClassesViewProps {
  classes: Class[];
  setClasses: (classes: Class[]) => void;
  onSelectClass: (classId: string) => void;
}

const ClassForm: React.FC<{ onSave: (cls: Omit<Class, 'id' | 'students'>) => void; onCancel: () => void; initialData?: Class | null; }> = ({ onSave, onCancel, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [level, setLevel] = useState(initialData?.level || '');
  const [schedule, setSchedule] = useState(initialData?.schedule || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && level) {
      onSave({ name, level, schedule });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom de la classe</label>
        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div>
        <label htmlFor="level" className="block text-sm font-medium text-gray-700">Niveau (ex: A1, B2)</label>
        <input type="text" id="level" value={level} onChange={e => setLevel(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div>
        <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">Horaire</label>
        <input type="text" id="schedule" value={schedule} onChange={e => setSchedule(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div className="flex justify-end space-x-2">
        <Button onClick={onCancel} variant="secondary">Annuler</Button>
        <Button type="submit">Sauvegarder</Button>
      </div>
    </form>
  );
};

const ClassesView: React.FC<ClassesViewProps> = ({ classes, setClasses, onSelectClass }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const handleSaveClass = (classData: Omit<Class, 'id' | 'students'>) => {
    if (editingClass) {
      setClasses(classes.map(c => c.id === editingClass.id ? { ...editingClass, ...classData } : c));
    } else {
      const newClass: Class = {
        ...classData,
        id: `class-${Date.now()}`,
        students: [],
      };
      setClasses([...classes, newClass]);
    }
    setIsModalOpen(false);
    setEditingClass(null);
  };

  const handleDeleteClass = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette classe ?")) {
      setClasses(classes.filter(c => c.id !== id));
    }
  };

  const openEditModal = (cls: Class) => {
    setEditingClass(cls);
    setIsModalOpen(true);
  };
  
  const openAddModal = () => {
    setEditingClass(null);
    setIsModalOpen(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Mes Classes</h1>
        <Button onClick={openAddModal}>
          Ajouter une classe
        </Button>
      </div>

      {classes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map(cls => (
            <Card key={cls.id} className="flex flex-col">
              <div className="flex-grow cursor-pointer" onClick={() => onSelectClass(cls.id)}>
                <h2 className="text-xl font-bold text-indigo-700">{cls.name}</h2>
                <p className="text-gray-600">Niveau: {cls.level}</p>
                <p className="text-gray-600 mb-2">{cls.students.length} apprenant(s)</p>
                <p className="text-sm text-gray-500">{cls.schedule}</p>
              </div>
              <div className="border-t mt-4 pt-4 flex justify-end space-x-2">
                <Button onClick={() => openEditModal(cls)} variant="secondary" size="sm">Éditer</Button>
                <Button onClick={() => handleDeleteClass(cls.id)} variant="danger" size="sm">Supprimer</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-center text-gray-500 py-8">Aucune classe pour le moment. Cliquez sur "Ajouter une classe" pour commencer.</p>
        </Card>
      )}

      {isModalOpen && (
        <Modal title={editingClass ? "Éditer la classe" : "Ajouter une classe"} onClose={() => setIsModalOpen(false)}>
          <ClassForm onSave={handleSaveClass} onCancel={() => setIsModalOpen(false)} initialData={editingClass} />
        </Modal>
      )}
    </div>
  );
};

export default ClassesView;
