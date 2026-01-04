const generateMockProducts = () => {
  const today = new Date();
  
  const addDays = (days) => {
    const result = new Date(today);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
  };

  return [
    {
      id: '1',
      name: 'Amoxicillin 500mg',
      category: 'Antibiotics',
      batchNumber: 'AX-2023-001',
      quantity: 1500,
      unit: 'tablets',
      expiryDate: addDays(-10),
      description: 'Broad-spectrum antibiotic used to treat bacterial infections.',
      imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=300'
    },
    {
      id: '2',
      name: 'Paracetamol 650mg',
      category: 'Analgesics',
      batchNumber: 'PA-2024-102',
      quantity: 5000,
      unit: 'tablets',
      expiryDate: addDays(15),
      description: 'Common pain reliever and fever reducer.',
    },
    {
      id: '3',
      name: 'Insulin Glargine',
      category: 'Diabetes',
      batchNumber: 'IG-2024-555',
      quantity: 200,
      unit: 'vials',
      expiryDate: addDays(180),
      description: 'Long-acting insulin analog for diabetes management.',
    },
    {
      id: '4',
      name: 'Lisinopril 10mg',
      category: 'Cardiovascular',
      batchNumber: 'LS-2023-888',
      quantity: 800,
      unit: 'tablets',
      expiryDate: addDays(5),
      description: 'ACE inhibitor used to treat high blood pressure.',
    },
    {
      id: '6',
      name: 'Surgical Masks (N95)',
      category: 'Equipment',
      batchNumber: 'SM-2022-999',
      quantity: 5000,
      unit: 'units',
      expiryDate: addDays(-45),
      description: 'Personal protective equipment for respiratory protection.',
    },
  ];
};

export const MOCK_PRODUCTS = generateMockProducts();