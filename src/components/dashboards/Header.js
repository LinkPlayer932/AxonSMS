const Header = ({ title, subtitle, actions }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
          </div>
          {actions && (
            <div className="flex space-x-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { Header };