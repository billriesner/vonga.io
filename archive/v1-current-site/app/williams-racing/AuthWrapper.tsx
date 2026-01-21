'use client';

import { PasswordAuth } from './auth';

export function AuthWrapper() {
  return <PasswordAuth onSuccess={() => window.location.reload()} />;
}
