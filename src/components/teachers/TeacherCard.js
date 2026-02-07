const TeacherCard = ({ teacher, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-green-600">
            {teacher.name?.charAt(0) || 'T'}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{teacher.name}</h3>
          <p className="text-sm text-gray-600">ID: {teacher.employeeId}</p>
          <p className="text-sm text-gray-600">Subject: {teacher.subject}</p>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-600">Email:</span>
          <p className="font-medium truncate">{teacher.email}</p>
        </div>
        <div>
          <span className="text-gray-600">Phone:</span>
          <p className="font-medium">{teacher.phone}</p>
        </div>
        <div>
          <span className="text-gray-600">Qualification:</span>
          <p className="font-medium">{teacher.qualification}</p>
        </div>
        <div>
          <span className="text-gray-600">Experience:</span>
          <p className="font-medium">{teacher.experience} years</p>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => onView(teacher)}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          View
        </button>
        <button
          onClick={() => onEdit(teacher)}
          className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(teacher.id)}
          className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export { TeacherCard };
