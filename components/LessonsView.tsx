
import React, { useState } from 'react';
import type { Lesson } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Modal from './common/Modal';

interface LessonsViewProps {
  lessons: Lesson[];
  setLessons: (lessons: Lesson[]) => void;
}

const LessonForm: React.FC<{ onSave: (lesson: Omit<Lesson, 'id'>) => void; onClose: () => void; initialData?: Lesson | null }> = ({ onSave, onClose, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [objectives, setObjectives] =useState(initialData?.objectives.join(', ') || '');
  const [materials, setMaterials] = useState(initialData?.materials.join(', ') || '');
  const [procedure, setProcedure] = useState(initialData?.procedure || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title, date, notes, procedure,
      objectives: objectives.split(',').map(s => s.trim()),
      materials: materials.split(',').map(s => s.trim())
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Titre du cours" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
      </div>
      <textarea value={objectives} onChange={e => setObjectives(e.target.value)} placeholder="Objectifs (séparés par des virgules)" rows={2} className="w-full p-2 border border-gray-300 rounded-md"></textarea>
      <textarea value={materials} onChange={e => setMaterials(e.target.value)} placeholder="Matériel nécessaire (séparés par des virgules)" rows={2} className="w-full p-2 border border-gray-300 rounded-md"></textarea>
      <textarea value={procedure} onChange={e => setProcedure(e.target.value)} placeholder="Déroulement du cours" rows={4} className="w-full p-2 border border-gray-300 rounded-md"></textarea>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes / Devoirs" rows={2} className="w-full p-2 border border-gray-300 rounded-md"></textarea>
      <div className="flex justify-end space-x-2">
        <Button onClick={onClose} variant="secondary">Annuler</Button>
        <Button type="submit">Sauvegarder</Button>
      </div>
    </form>
  );
};


const LessonsView: React.FC<LessonsViewProps> = ({ lessons, setLessons }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const handleSave = (lessonData: Omit<Lesson, 'id'>) => {
    if(editingLesson) {
        setLessons(lessons.map(l => l.id === editingLesson.id ? {...editingLesson, ...lessonData} : l));
    } else {
        const newLesson: Lesson = {...lessonData, id: `lesson-${Date.now()}`};
        setLessons([...lessons, newLesson]);
    }
    setIsModalOpen(false);
    setEditingLesson(null);
  };
  
  const handleDelete = (id: string) => {
      if(window.confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
          setLessons(lessons.filter(l => l.id !== id));
      }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Mes Cours</h1>
        <Button onClick={() => { setEditingLesson(null); setIsModalOpen(true); }}>Planifier un cours</Button>
      </div>

      {lessons.length > 0 ? (
        <div className="space-y-4">
          {lessons.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(lesson => (
            <Card key={lesson.id}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-indigo-700">{lesson.title}</h2>
                  <p className="text-sm font-semibold text-gray-500">{new Date(lesson.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => { setEditingLesson(lesson); setIsModalOpen(true); }} variant="secondary" size="sm">Éditer</Button>
                  <Button onClick={() => handleDelete(lesson.id)} variant="danger" size="sm">Supprimer</Button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold">Objectifs:</h3>
                  <p className="text-gray-600">{lesson.objectives.join(', ')}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-center text-gray-500 py-8">Aucun cours planifié. Cliquez sur "Planifier un cours" pour commencer.</p>
        </Card>
      )}

      {isModalOpen && (
          <Modal title={editingLesson ? "Éditer le cours" : "Planifier un cours"} onClose={() => setIsModalOpen(false)} size="lg">
              <LessonForm onSave={handleSave} onClose={() => setIsModalOpen(false)} initialData={editingLesson} />
          </Modal>
      )}
    </div>
  );
};

export default LessonsView;
