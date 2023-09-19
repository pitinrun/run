export default function OrderDialog({
  open = false,
  onClose = () => {},
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const modalClass = open ? 'modal modal-open' : 'modal';

  return (
    <dialog className={modalClass}>
      <div className='modal-box'>
        <h3 className='font-bold text-lg'>Hello!</h3>
        <p className='py-4'>Press ESC key or click the button below to close</p>
        <div className='modal-action'>
          <form method='dialog'>
            {/* if there is a button in form, it will close the modal */}
            <button className='btn' onClick={onClose}>
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
