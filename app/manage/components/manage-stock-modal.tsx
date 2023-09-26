// app/manage/components/manage-stock-modal.tsx
import { useContext, useEffect } from 'react';
import { ResponseGetOrdersForManager } from 'requests/manage/order.api';
import { OrderModalContext } from '../contexts/order-modal.context';

export default function ManageStockModal({
  open = false,
  onConfirm = () => {},
  onClose = () => {},
}: {
  open?: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
}) {
  const modalClass = open ? 'modal modal-open' : 'modal';

  const { userData, products } = useContext(OrderModalContext);

  console.log('$$ userData', userData);
  useEffect(() => {
    console.log('@@@@ manage-order-list');
    // console.log('$$ isVisible', isVisible);
    console.log('$$ products', products);
    console.log('$$ userData', userData);
  }, [products, userData]);

  return (
    <dialog className={modalClass}>
      <div className='modal-box'>
        <h3 className='font-bold text-lg mb-2'>주문 접수</h3>
        <h4 className='text-sm text-neutral-400'>{userData?.businessName}</h4>
        <div></div>
        <div className='modal-action w-full'>
          {/* <form method='dialog flex w-full'> */}
          {/* if there is a button in form, it will close the modal */}
          <button className='btn flex-1' onClick={onClose}>
            {/* {cancelText} */}
          </button>
          <button className='btn flex-1 btn-primary' onClick={onConfirm}>
            {/* {confirmText} */}
          </button>
          {/* </form> */}
        </div>
      </div>
    </dialog>
  );
}
