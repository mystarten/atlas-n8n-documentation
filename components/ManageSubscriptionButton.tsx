'use client';

import React from 'react';

export default function ManageSubscriptionButton() {
  async function handleManageSubscription() {
    try {
      const res = await fetch('/api/create-portal-session', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Impossible d’ouvrir le portail client: ' + (data.error || 'Erreur inconnue'));
      }
    } catch (e) {
      alert('Erreur réseau, veuillez réessayer plus tard.');
      console.error(e);
    }
  }

  return (
    <button onClick={handleManageSubscription} className="btn-primary" type="button">
      Gérer mon abonnement
    </button>
  );
}
