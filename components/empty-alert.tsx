export default function EmptyAlert({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className='card border border-solid border-neutral-200'>
      <div className='card-body'>
        <div className='text-center text-neutral-600'>
          <div className='text-base sm:text-lg'>{children}</div>
        </div>
      </div>
    </div>
  );
}
