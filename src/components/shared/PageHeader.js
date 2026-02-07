import BackButton from "./BackButton";

export default function PageHeader({ 
  title, 
  showBackButton = true, 
  children 
}) {
  return (
    <div className="mb-6">
      {showBackButton && (
        <div className="mb-4">
          <BackButton />
        </div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <div>{children}</div>
      </div>
    </div>
  );
}