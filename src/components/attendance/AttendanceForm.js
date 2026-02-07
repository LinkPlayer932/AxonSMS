
import { ATTENDANCE_OPTIONS } from '../utils/constants';

const AttendanceForm = ({ students, classId, date, onSubmit, onCancel }) => {
  const [attendanceData, setAttendanceData] = useState(
    students.map(student => ({
      studentId: student.id,
      studentName: student.name,
      status: 'Present'
    }))
  );

  const [selectedDate, setSelectedDate] = useState(date || new Date().toISOString().split('T')[0]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev =>
      prev.map(item =>
        item.studentId === studentId ? { ...item, status } : item
      )
    );
  };

  const handleMarkAll = (status) => {
    setAttendanceData(prev =>
      prev.map(item => ({ ...item, status }))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      classId,
      date: selectedDate,
      attendance: attendanceData
    });
  };

  const getStatusColor = (status) => {
    const option = ATTENDANCE_OPTIONS.find(opt => opt.value === status);
    return option?.color || 'bg-gray-500';
  };

  const statusCounts = attendanceData.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Mark Attendance</h2>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-end space-x-2">
          {ATTENDANCE_OPTIONS.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleMarkAll(option.value)}
              className={`px-3 py-2 text-sm ${option.color} text-white rounded hover:opacity-80 transition-opacity`}
            >
              All {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {ATTENDANCE_OPTIONS.map(option => (
          <div key={option.value} className={`${option.color} text-white p-3 rounded text-center`}>
            <div className="text-2xl font-bold">{statusCounts[option.value] || 0}</div>
            <div className="text-sm">{option.label}</div>
          </div>
        ))}
      </div>

      <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roll No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendanceData.map((item, index) => (
              <tr key={item.studentId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.studentName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {ATTENDANCE_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleStatusChange(item.studentId, option.value)}
                        className={`px-3 py-1 text-sm rounded transition-all ${
                          item.status === option.value
                            ? `${option.color} text-white`
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Submit Attendance
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export { AttendanceForm };