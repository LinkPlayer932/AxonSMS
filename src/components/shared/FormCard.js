export default function FormCard({ 
  children, 
  onSubmit, 
  className = "" 
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={`bg-white p-6 rounded-md shadow-md space-y-4 ${className}`}
    >
      {children}
    </form>
  );
}