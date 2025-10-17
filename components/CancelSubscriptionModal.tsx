interface CancelSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading: boolean
}

export default function CancelSubscriptionModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading
}: CancelSubscriptionModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Annuler l'abonnement
        </h3>
        
        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir annuler votre abonnement ? 
          Vous perdrez l'accès aux fonctionnalités premium à la fin de votre période de facturation.
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Retour
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Annulation...' : 'Confirmer l\'annulation'}
          </button>
        </div>
      </div>
    </div>
  )
}


