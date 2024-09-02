import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

interface Filters {
  minHeight: number;
  maxHeight: number;
  education: string;
  occupation: string;
}

const AdvancedFilters: React.FC<{ onApplyFilters: (filters: Filters) => void }> = ({ onApplyFilters }) => {
  const { data: session } = useSession();
  const [filters, setFilters] = useState<Filters>({
    minHeight: 150,
    maxHeight: 200,
    education: '',
    occupation: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(filters);
  };

  if (session?.user.subscription !== 'premium') {
    return <p>Upgrade to premium to use advanced filters!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Advanced Filters</h3>
      <label>
        Min Height (cm):
        <input type="number" name="minHeight" value={filters.minHeight} onChange={handleChange} />
      </label>
      <label>
        Max Height (cm):
        <input type="number" name="maxHeight" value={filters.maxHeight} onChange={handleChange} />
      </label>
      <label>
        Education:
        <select name="education" value={filters.education} onChange={handleChange}>
          <option value="">Any</option>
          <option value="high-school">High School</option>
          <option value="bachelors">Bachelor's Degree</option>
          <option value="masters">Master's Degree</option>
          <option value="phd">PhD</option>
        </select>
      </label>
      <label>
        Occupation:
        <input type="text" name="occupation" value={filters.occupation} onChange={handleChange} />
      </label>
      <button type="submit">Apply Filters</button>
    </form>
  );
};

export default AdvancedFilters;