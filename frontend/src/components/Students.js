import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/students')
      .then((res) => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load students');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading students...</p>;
  if (error) return <p className="error">{error}</p>;
  if (students.length === 0) return <p>No students found.</p>;

  return (
    <div>
      <h2>Students List</h2>
      <ul className="students-list">
        {students.map((student) => (
          <li key={student._id}>
            {student.name} - Class: {student.class} - Age: {student.age}
          </li>
        ))}
      </ul>
    </div>
  );
}
