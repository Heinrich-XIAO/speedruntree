"use client"
import { useStoreUserEffect } from '../app/useStoreUserEffect'

export function PutUserInDB() {
  useStoreUserEffect();
  return null;
}
