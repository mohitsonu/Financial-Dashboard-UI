import { useState, useMemo, useEffect } from 'react';

export default function useFilteredTransactions(transactions, initialSearch = '') {
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');


  const filtered = useMemo(() => {
    let result = [...transactions];

    // search by fund name
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t => t.fundName.toLowerCase().includes(q));
    }

    // type filter
    if (typeFilter !== 'all') {
      result = result.filter(t => t.type === typeFilter);
    }

    // status
    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter);
    }

    // sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return result;
  }, [transactions, search, typeFilter, statusFilter, sortBy]);

  return {
    filtered,
    search, setSearch,
    typeFilter, setTypeFilter,
    statusFilter, setStatusFilter,
    sortBy, setSortBy,
  };
}
