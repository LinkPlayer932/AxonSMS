import React from 'react';

const ClassCard = ({ classData, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-purple-600">
              {classData.name?.charAt(0) || 'C'}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{classData.name}</h3>
            <p className="text-sm text-gray-600">Section: {classData.section}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Class Teacher:</span>
          <span className="font-medium">{classData.classTeacher || 'Not assigned'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Students:</span>
          <span className="font-medium">{classData.studentCount || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Capacity:</span>
          <span className="font-medium">{classData.capacity || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Room No:</span>
          <span className="font-medium">{classData.roomNumber || 'N/A'}</span>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => onView(classData)}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          View
        </button>
        <button
          onClick={() => onEdit(classData)}
          className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(classData.id)}
          className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ClassCard;
