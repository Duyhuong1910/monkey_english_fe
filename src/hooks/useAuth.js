/* eslint-disable no-unused-vars */

// // import { useState, useEffect } from 'react';

// // export const useAuth = () => {
// //     const [role, setRole] = useState(null);

// //     useEffect(() => {
// //         // Đọc role từ localStorage khi component mount
// //         const storedRole = localStorage.getItem('userRole');
// //         setRole(storedRole);
// //     }, []);

// //     // Hàm kiểm tra vai trò
// //     const isAdmin = () => role === 'admin';
// //     const isStudent = () => role === 'student';
// //     const isAuthenticated = () => !!localStorage.getItem('token'); 

// //     return { isAuthenticated, isAdmin, isStudent, role };
// // };

// // export default useAuth;
// // eslint-disable-next-line no-unused-vars
// import { useState, useEffect } from 'react';

// export const useAuth = () => {
//     // eslint-disable-next-line no-unused-vars
//     const [role, setRole] = useState(localStorage.getItem('userRole'));
//     // eslint-disable-next-line no-unused-vars
//     const [token, setToken] = useState(localStorage.getItem('token'));

//     const isAdmin = () => role === 'admin';
//     const isAuthenticated = () => !!token; 

//     return { isAuthenticated, isAdmin, role };
// };

// export default useAuth; //

import { useState } from 'react';

export const useAuth = () => {
    // Lấy trực tiếp từ localStorage
    const role = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    return { 
        isAuthenticated: !!token, // Trả về true nếu có token
        isAdmin: role === 'admin', // Trả về true nếu là admin
        role 
    };
};

export default useAuth;
