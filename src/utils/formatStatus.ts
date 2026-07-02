/**
 * Mengubah status key (e.g., 'waiting_approval') menjadi teks rapi (e.g., 'Waiting Approval')
 */
export const formatStatus = (status: string) => {
  if (!status) return '';
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Mendapatkan class warna Tailwind berdasarkan status
 */
export const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'published':
      return 'bg-green-100 text-green-800';
    case 'waiting_approval':
      return 'bg-blue-100 text-blue-800';
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'revision':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-red-100 text-red-800'; // Warna default jika tidak cocok
  }
};