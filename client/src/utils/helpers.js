export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const calculateRentalPrice = (product, duration, unit) => {
  if (!product || !duration || !unit) return 0;
  switch (unit) {
    case 'day': return product.rentPricePerDay * duration;
    case 'week': return product.rentPricePerWeek * duration;
    case 'month': return product.rentPricePerMonth * duration;
    default: return 0;
  }
};

export const getStatusColor = (status) => {
  const colors = {
    processing: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    returned: 'bg-purple-100 text-purple-800',
    pending: 'bg-orange-100 text-orange-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusLabel = (status) => {
  const labels = {
    pending: 'unpaid',
  };

  return labels[status] || status;
};
