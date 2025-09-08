
import React, { useState, useCallback } from 'react';
import type { Activity } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Modal from './common/Modal';
import Spinner from './common/Spinner';
import { generateActivityIdeas } from '../services/geminiService';

interface ActivitiesViewProps {
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;
}

const ActivityForm: React.FC<{ onSave: (activity: Omit<Activity, 'id'>) => void; onClose: () => void; initialData?: Activity | null }> = ({ onSave, onClose, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [type, setType] = useState(initialData?.type || '');
  const [duration, setDuration] = useState(initialData?.duration || 15);
  const [description, setDescription] = useState(initialData?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, type, duration, description });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" placeholder="Titre de l'activité" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Type (ex: Brise-glace)" value={type} onChange={e => setType(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
        <input type="number" placeholder="Durée (min)" value={duration} onChange={e => setDuration(parseInt(e.target.value))} required className="w-full p-2 border border-gray-300 rounded-md" />
      </div>
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={4} className="w-full p-2 border border-gray-300 rounded-md"></textarea>
      <div className="flex justify-end space-x-2">
        <Button onClick={onClose} variant="secondary">Annuler</Button>
        <Button type="submit">Sauvegarder</Button>
      </div>
    </form>
  );
};

const IdeaGenerator: React.FC<{ onAddActivity: (activity: Omit<Activity, 'id'>) => void }> = ({ onAddActivity }) => {
  const [topic, setTopic] = useState('');
  const [skill, setSkill] = useState('Oral');
  const [level, setLevel] = useState('A2');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<Omit<Activity, 'id'>[]>([]);

  const handleGenerate = useCallback(async () => {
    if (!topic) {
      setError('Veuillez entrer un thème.');
      return;
    }
    if (!process.env.API_KEY) {
      setError("La clé API Gemini n'est pas configurée. Impossible de générer des idées.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setIdeas([]);
    try {
      const generatedIdeas = await generateActivityIdeas(topic, skill, level);
      setIdeas(generatedIdeas);
    } catch (e) {
      setError("Une erreur est survenue lors de la génération d'idées.");
    } finally {
      setIsLoading(false);
    }
  }, [topic, skill, level]);

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-800">Générateur d'Idées avec Gemini ✨</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Thème (ex: la nourriture)" className="p-2 border rounded-md" />
        <select value={skill} onChange={e => setSkill(e.target.value)} className="p-2 border rounded-md bg-white">
          <option>Oral</option>
          <option>Écrit</option>
          <option>Grammaire</option>
          <option>Vocabulaire</option>
        </select>
        <select value={level} onChange={e => setLevel(e.target.value)} className="p-2 border rounded-md bg-white">
          <option>A1</option>
          <option>A2</option>
          <option>B1</option>
          <option>B2</option>
        </select>
      </div>
      <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
        {isLoading ? <Spinner /> : "Générer des idées"}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {ideas.length > 0 && (
        <div className="space-y-3 mt-4">
          <h4 className="font-semibold">Suggestions :</h4>
          {ideas.map((idea, index) => (
            <Card key={index} className="bg-white">
              <h5 className="font-bold">{idea.title} ({idea.duration} min)</h5>
              <p className="text-sm text-gray-600">{idea.description}</p>
              <div className="text-right mt-2">
                <Button size="sm" onClick={() => onAddActivity(idea)}>Ajouter à ma banque</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};


const ActivitiesView: React.FC<ActivitiesViewProps> = ({ activities, setActivities }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const handleSave = (activityData: Omit<Activity, 'id'>) => {
    if(editingActivity) {
      setActivities(activities.map(a => a.id === editingActivity.id ? {...editingActivity, ...activityData} : a));
    } else {
      const newActivity: Activity = {...activityData, id: `activity-${Date.now()}`};
      setActivities([...activities, newActivity]);
    }
    setIsModalOpen(false);
    setEditingActivity(null);
  };
  
  const handleDelete = (id: string) => {
    if(window.confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      setActivities(activities.filter(a => a.id !== id));
    }
  }
  
  const addGeneratedActivity = (activity: Omit<Activity, 'id'>) => {
      const newActivity: Activity = {...activity, id: `activity-${Date.now()}`};
      setActivities([newActivity, ...activities]);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Banque d'Activités</h1>
        <Button onClick={() => { setEditingActivity(null); setIsModalOpen(true); }}>Ajouter une activité</Button>
      </div>

      <Card className="mb-8">
          <IdeaGenerator onAddActivity={addGeneratedActivity} />
      </Card>
      
      {activities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map(activity => (
            <Card key={activity.id}>
              <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-indigo-700">{activity.title}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 my-2">
                        <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded-md">{activity.type}</span>
                        <span>{activity.duration} minutes</span>
                    </div>
                    <p className="text-gray-600">{activity.description}</p>
                  </div>
                  <div className="flex flex-col space-y-2 flex-shrink-0 ml-4">
                      <Button onClick={() => { setEditingActivity(activity); setIsModalOpen(true); }} variant="secondary" size="sm">Éditer</Button>
                      <Button onClick={() => handleDelete(activity.id)} variant="danger" size="sm">Supprimer</Button>
                  </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-center text-gray-500 py-8">Aucune activité dans votre banque. Ajoutez-en une manuellement ou utilisez le générateur d'idées !</p>
        </Card>
      )}

      {isModalOpen && (
        <Modal title={editingActivity ? "Éditer l'activité" : "Ajouter une activité"} onClose={() => setIsModalOpen(false)} size="lg">
          <ActivityForm onSave={handleSave} onClose={() => setIsModalOpen(false)} initialData={editingActivity} />
        </Modal>
      )}
    </div>
  );
};

export default ActivitiesView;
