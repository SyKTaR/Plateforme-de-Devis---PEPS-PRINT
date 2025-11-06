import { projectId, publicAnonKey } from './supabase/info';
import { DatabaseData } from '../App';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-45305945`;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

export async function fetchData(): Promise<DatabaseData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/data`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data from server:', error);
    return null;
  }
}

export async function initializeData(data: DatabaseData): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/initialize`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to initialize data: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Initialize result:', result);
    return true;
  } catch (error) {
    console.error('Error initializing data:', error);
    return false;
  }
}

export async function updatePapers(papers: any[]): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/papers`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ papers }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error updating papers:', errorData);
      throw new Error(`Failed to update papers: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error updating papers:', error);
    return false;
  }
}

export async function updateFinishes(finishes: any[]): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/finishes`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ finishes }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error updating finishes:', errorData);
      throw new Error(`Failed to update finishes: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error updating finishes:', error);
    return false;
  }
}

export async function updateMachines(machines: any[]): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/machines`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ machines }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error updating machines:', errorData);
      throw new Error(`Failed to update machines: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error updating machines:', error);
    return false;
  }
}

export async function updateLabor(labor: any[]): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/labor`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ labor }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error updating labor:', errorData);
      throw new Error(`Failed to update labor: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error updating labor:', error);
    return false;
  }
}

export async function updateMarginRules(marginRules: any[]): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/marginRules`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ marginRules }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error updating margin rules:', errorData);
      throw new Error(`Failed to update margin rules: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error updating margin rules:', error);
    return false;
  }
}

export async function updateQuotes(quotes: any[]): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/quotes`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ quotes }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error updating quotes:', errorData);
      throw new Error(`Failed to update quotes: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error updating quotes:', error);
    return false;
  }
}
