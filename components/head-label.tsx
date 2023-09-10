export default function HeadLabel({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h2 className={`text-3xl font-semibold ${className}`}>{children}</h2>;
}
