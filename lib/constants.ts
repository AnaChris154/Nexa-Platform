// Constantes da aplicação

export const APP_NAME = 'NEXA';
export const APP_DESCRIPTION = 'Plataforma de estudos para escolas públicas';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ALUNO_DASHBOARD: '/aluno/dashboard',
  PROFESSOR_DASHBOARD: '/professor/dashboard',
};

export const USER_TYPES = {
  ALUNO: 'aluno',
  PROFESSOR: 'professor',
} as const;
