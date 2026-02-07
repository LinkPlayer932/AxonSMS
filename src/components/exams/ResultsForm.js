const ResultsForm = ({ exam, students, onSubmit, onCancel }) => {
  const [results, setResults] = useState(
    students.map(student => ({
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      marksObtained: '',
      grade: '',
      remarks: ''
    }))
  );

  const calculateGrade = (marks, totalMarks) => {
    const percentage = (marks / totalMarks) * 100;
    const gradeLevel = GRADE_LEVELS.find(
      level => percentage >= level.min && percentage <= level.max
    );
    return gradeLevel?.value || 'F';
  };

  const handleMarksChange = (studentId, marks) => {
    setResults(prev =>
      prev.map(item => {
        if (item.studentId === studentId) {
          const marksObtained = parseFloat(marks) || 0;
          const grade = calculateGrade(marksObtained, exam.totalMarks);
          return { ...item, marksObtained: marks, grade };
        }
        return item;
      })
    );
  };

  const handleRemarksChange = (studentId, remarks) => {
    setResults(prev =>
      prev.map(item =>
        item.studentId === studentId ? { ...item, remarks } : item
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      examId: exam.id,
      results: results.map(r => ({
        ...r,
        marksObtained: parseFloat(r.marksObtained) || 0
      }))
    });
  };

  const stats = results.reduce((acc, item) => {
    const marks = parseFloat(item.marksObtained) || 0;
    if (marks >= (exam.passingMarks || 0)) {
      acc.passed++;
    } else if (marks > 0) {
      acc.failed++;
    }
    acc.total++;
    acc.totalMarks += marks;
    return acc;
  }, { passed: 0, failed: 0, total: 0, totalMarks: 0 });

  const average = stats.total > 0 ? (stats.totalMarks / stats.total).toFixed(2) : 0;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-2">Enter Exam Results</h2>
      <p className="text-gray-600 mb-6">
        {exam.title} - {exam.subjectName} ({exam.className})
      </p>

      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-700">Total Students</div>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
          <div className="text-sm text-gray-700">Passed</div>
        </div>
        <div className="bg-red-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          <div className="text-sm text-gray-700">Failed</div>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{average}</div>
          <div className="text-sm text-gray-700">Average</div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Roll No
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Student Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Marks (out of {exam.totalMarks})
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Grade
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((item) => (
              <tr key={item.studentId} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.rollNumber}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {item.studentName}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <input
                    type="number"
                    value={item.marksObtained}
                    onChange={(e) => handleMarksChange(item.studentId, e.target.value)}
                    min="0"
                    max={exam.totalMarks}
                    step="0.5"
                    className="w-24 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    item.grade === 'A+' || item.grade === 'A' ? 'bg-green-100 text-green-800' :
                    item.grade === 'B+' || item.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                    item.grade === 'C+' || item.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                    item.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.grade || '-'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={item.remarks}
                    onChange={(e) => handleRemarksChange(item.studentId, e.target.value)}
                    className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional remarks"
                  />
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
          Save Results
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

export { ResultsForm };