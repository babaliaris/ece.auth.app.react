import { create } from 'zustand';
import { type ApiUserRoleType } from '@/core/services/api/api.models';


export interface EceUserDataI
{
  m_uuid  : string,
  m_email : string,
  m_role  : ApiUserRoleType,
};


interface EceAuthStateI
{
  user            : EceUserDataI | null;
  is_authenticated: boolean;
  is_initialized  : boolean;

  // Actions
  setAuth       : (user: EceUserDataI) => void;
  clearAuth     : () => void;
  setInitialized: (val: boolean) => void;
};

export const useEceAuthStore = create<EceAuthStateI>((set) => (
{
  user            : null,
  is_authenticated: false,
  is_initialized  : false,

  setAuth: (user) => set(
  {
    user,
    is_authenticated: true,
    is_initialized  : true
  }),

  clearAuth: () => set(
  {
    user            : null,
    is_authenticated: false,
    is_initialized  : true
  }),

  setInitialized: (val) => set(
  {
    is_initialized: val
  }),
}));

