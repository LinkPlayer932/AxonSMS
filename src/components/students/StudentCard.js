// import React from "react";
// import { Eye, Edit, Trash2 } from "lucide-react";

// const StudentCard = ({ student, onEdit, onDelete, onView }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-sm border p-4 space-y-4">
//       {/* TOP SECTION */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           {/* Avatar */}
//           {student.photo ? (
//             <img
//               src={student.photo}
//               alt={student.name}
//               className="w-12 h-12 rounded-full object-cover"
//             />
//           ) : (
//             <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold">
//               {student.name?.charAt(0) || "S"}
//             </div>
//           )}

//           {/* Basic Info */}
//           <div>
//             <h3 className="font-semibold text-gray-800">{student.name}</h3>
//             <p className="text-sm text-gray-500">
//               Roll No: {student.rollNumber}
//             </p>
//             <p className="text-sm text-gray-500">
//               Class: {student.className}
//             </p>
//           </div>
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => onView(student)}
//             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
//             title="View Details"
//           >
//             <Eye size={18} />
//           </button>

//           <button
//             onClick={() => onEdit(student)}
//             className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
//             title="Edit"
//           >
//             <Edit size={18} />
//           </button>

//           <button
//             onClick={() => onDelete(student)}
//             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
//             title="Delete"
//           >
//             <Trash2 size={18} />
//           </button>
//         </div>
//       </div>

//       {/* DETAILS SECTION */}
//       <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
//         <div>
//           <span className="font-medium">Email:</span>{" "}
//           {student.email || "N/A"}
//         </div>

//         <div>
//           <span className="font-medium">Phone:</span>{" "}
//           {student.phone || "N/A"}
//         </div>

//         <div>
//           <span className="font-medium">Gender:</span>{" "}
//           {student.gender || "N/A"}
//         </div>

//         <div>
//           <span className="font-medium">Status:</span>{" "}
//           <span
//             className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//               student.status === "Active"
//                 ? "bg-green-100 text-green-800"
//                 : "bg-red-100 text-red-800"
//             }`}
//           >
//             {student.status || "Active"}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentCard;
import React from 'react';

const StudentCard = ({ student, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-blue-600">
            {student.name?.charAt(0) || 'S'}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
          <p className="text-sm text-gray-600">Roll No: {student.rollNumber}</p>
          <p className="text-sm text-gray-600">Class: {student.className}</p>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-600">Email:</span>
          <p className="font-medium truncate">{student.email}</p>
        </div>
        <div>
          <span className="text-gray-600">Phone:</span>
          <p className="font-medium">{student.phone}</p>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => onView(student)}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          View
        </button>
        <button
          onClick={() => onEdit(student)}
          className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(student.id)}
          className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default StudentCard;