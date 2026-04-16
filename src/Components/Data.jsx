import { useState, useEffect } from 'react';

 const defaultUsers = [
    {
        user: 'admin',
        password: '12345',
        name: 'admin',
    },
];
 const useUsers = () => {
    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem('users');
        return saved ? JSON.parse(saved) : defaultUsers;
    });

    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);

    return { users, setUsers };
};
export { useUsers };
