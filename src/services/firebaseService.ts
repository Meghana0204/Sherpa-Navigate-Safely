
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  GeoPoint, 
  Timestamp,
  DocumentData 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CrimeIncident } from '@/types/incidents';

// Convert a Firestore document to CrimeIncident type
const convertToCrimeIncident = (doc: DocumentData): CrimeIncident => {
  const data = doc.data();
  const location = data.location as GeoPoint;
  
  return {
    id: doc.id,
    type: data.type,
    description: data.description,
    severity: data.severity,
    lat: location.latitude,
    lng: location.longitude,
    date: data.date instanceof Timestamp 
      ? data.date.toDate().toLocaleDateString() 
      : data.date,
    time: data.time || '',
    reported_by: data.reported_by || '',
  };
};

// Add a new incident report to Firestore
export const addIncidentReport = async (incident: Omit<CrimeIncident, 'id'>) => {
  try {
    const incidentsRef = collection(db, 'incidents');
    const docRef = await addDoc(incidentsRef, {
      type: incident.type,
      description: incident.description,
      severity: incident.severity,
      location: new GeoPoint(incident.lat, incident.lng),
      date: new Date(),
      time: incident.time,
      reported_by: incident.reported_by,
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding incident report:', error);
    throw error;
  }
};

// Get all incidents from Firestore
export const getAllIncidents = async (): Promise<CrimeIncident[]> => {
  try {
    const incidentsRef = collection(db, 'incidents');
    const snapshot = await getDocs(incidentsRef);
    
    return snapshot.docs.map(convertToCrimeIncident);
  } catch (error) {
    console.error('Error getting incidents:', error);
    throw error;
  }
};

// Get incidents by severity
export const getIncidentsBySeverity = async (severity: string): Promise<CrimeIncident[]> => {
  try {
    const incidentsRef = collection(db, 'incidents');
    const q = query(incidentsRef, where('severity', '==', severity));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(convertToCrimeIncident);
  } catch (error) {
    console.error('Error getting incidents by severity:', error);
    throw error;
  }
};
