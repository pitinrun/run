export default function ConfirmDialog({
  title,
  children,
  confirmText = '확인',
  cancelText = '취소',
  open = false,
  onConfirm = () => {},
  onClose = () => {},
}: {
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  open?: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
}) {
  const modalClass = open ? 'modal modal-open' : 'modal';

  return (
    <dialog className={modalClass}>
      <div className='modal-box text-center'>
        <h3 className='font-bold text-lg'>{title}</h3>
        <p className='py-4'>{children}</p>
        <div className='modal-action w-full'>
          {/* <form method='dialog flex w-full'> */}
          {/* if there is a button in form, it will close the modal */}
          <button className='btn flex-1' onClick={onClose}>
            {cancelText}
          </button>
          <button className='btn flex-1 btn-primary' onClick={onConfirm}>
            {confirmText}
          </button>
          {/* </form> */}
        </div>
      </div>
    </dialog>
  );
}
