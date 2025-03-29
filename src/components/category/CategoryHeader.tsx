interface CategoryHeaderProps {
  categoryName?: string;
}

export function CategoryHeader({ categoryName }: CategoryHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">{categoryName}</h1>
    </div>
  );
}
