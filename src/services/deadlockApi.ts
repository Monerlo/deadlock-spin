import type { Hero } from '../types';

const API_BASE_URL = "https://assets.deadlock-api.com";

// Ми видалили локальний 'interface Hero' звідси,
// оскільки тепер він імпортується з центрального файлу типів.

export async function fetchHeroes(): Promise<Hero[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/v2/heroes`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: Hero[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch heroes:", error);
    return [];
  }
}

