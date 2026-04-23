interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
        {description && <p className="text-blue-100 text-lg">{description}</p>}
      </div>
    </div>
  );
}
