
import React, { useState, useMemo } from 'react';
import type { Class, Student, StudentNote } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Modal from './common/Modal';

interface StudentsViewProps {
  classes: Class[];
  setClasses: (classes: Class[]) => void;
  selectedClassId: string | null;
  setSelectedClassId: (id: string | null) => void;
}

const StudentDetailsModal: React.FC<{ student: Student; onSave: (updatedStudent: Student) => void; onClose: () => void }> = ({ student, onSave, onClose }) => {
    const [newNote, setNewNote] = useState('');

    const handleAddNote = () => {
        if (newNote.trim() === '') return;
        const note: StudentNote = {
            id: `note-${Date.now()}`,
            date: new Date().toLocaleDateString('fr-FR'),
            note: newNote,
        };
        onSave({ ...student, notes: [note, ...student.notes] });
        setNewNote('');
    };

    const handleDeleteNote = (noteId: string) => {
        onSave({ ...student, notes: student.notes.filter(n => n.id !== noteId)});
    };
    
    return (
        <Modal title={`Suivi de ${student.name}`} onClose={onClose} size="lg">
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Ajouter une note de suivi</h3>
                    <textarea value={newNote} onChange={e => setNewNote(e.target.value)} rows={3} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Progrès, difficultés, observations..."></textarea>
                    <div className="text-right mt-2">
                        <Button onClick={handleAddNote}>Ajouter la note</Button>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Historique des notes</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {student.notes.length > 0 ? student.notes.map(note => (
                            <div key={note.id} className="bg-gray-100 p-3 rounded-md">
                                <div className="flex justify-between items-center">
                                  <p className="text-sm font-semibold text-gray-600">{note.date}</p>
                                  <button onClick={() => handleDeleteNote(note.id)} className="text-red-500 hover:text-red-700">&times;</button>
                                </div>
                                <p className="text-gray-800">{note.note}</p>
                            </div>
                        )) : <p className="text-gray-500">Aucune note pour cet apprenant.</p>}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const StudentsView: React.FC<StudentsViewProps> = ({ classes, setClasses, selectedClassId, setSelectedClassId }) => {
  const [newStudentName, setNewStudentName] = useState('');
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  const activeClass = useMemo(() => classes.find(c => c.id === selectedClassId), [classes, selectedClassId]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClass || !newStudentName.trim()) return;

    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name: newStudentName.trim(),
      notes: [],
    };

    const updatedClass = { ...activeClass, students: [...activeClass.students, newStudent] };
    setClasses(classes.map(c => c.id === activeClass.id ? updatedClass : c));
    setNewStudentName('');
  };

  const handleDeleteStudent = (studentId: string) => {
    if (!activeClass) return;
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet apprenant ?")) {
        const updatedClass = { ...activeClass, students: activeClass.students.filter(s => s.id !== studentId) };
        setClasses(classes.map(c => c.id === activeClass.id ? updatedClass : c));
    }
  };
  
  const handleSaveStudentDetails = (updatedStudent: Student) => {
      if (!activeClass) return;
      const updatedStudents = activeClass.students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
      const updatedClass = { ...activeClass, students: updatedStudents };
      setClasses(classes.map(c => c.id === activeClass.id ? updatedClass : c));
      setViewingStudent(updatedStudent); // Keep modal open with updated data
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Suivi des Apprenants</h1>
        {classes.length > 0 && (
          <select value={selectedClassId || ''} onChange={e => setSelectedClassId(e.target.value || null)} className="p-2 border border-gray-300 rounded-md bg-white">
            <option value="">-- Sélectionner une classe --</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </div>

      {!activeClass ? (
        <Card><p className="text-center text-gray-500 py-8">Veuillez sélectionner une classe pour voir les apprenants.</p></Card>
      ) : (
        <div>
          <Card className="mb-6">
            <form onSubmit={handleAddStudent} className="flex items-center space-x-4">
              <input type="text" value={newStudentName} onChange={e => setNewStudentName(e.target.value)} placeholder="Nom du nouvel apprenant" className="flex-grow p-2 border border-gray-300 rounded-md" required />
              <Button type="submit">Ajouter</Button>
            </form>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeClass.students.length > 0 ? activeClass.students.map(student => (
              <Card key={student.id}>
                <h3 className="text-lg font-bold text-indigo-700">{student.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{student.notes.length} note(s) de suivi</p>
                <div className="flex justify-end space-x-2">
                  <Button onClick={() => setViewingStudent(student)} variant="secondary" size="sm">Voir Suivi</Button>
                  <Button onClick={() => handleDeleteStudent(student.id)} variant="danger" size="sm">Supprimer</Button>
                </div>
              </Card>
            )) : <p className="text-gray-500 col-span-full text-center">Aucun apprenant dans cette classe.</p>}
          </div>
        </div>
      )}
      
      {viewingStudent && (
          <StudentDetailsModal student={viewingStudent} onSave={handleSaveStudentDetails} onClose={() => setViewingStudent(null)} />
      )}
    </div>
  );
};

export default StudentsView;
