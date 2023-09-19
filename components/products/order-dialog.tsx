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
      <div className='modal-box text-center'>
        <h3 className='font-bold text-lg'>상품 주문 알림</h3>
        <p className='py-4'>
          상품이 장바구니에 등록되었습니다.
          <br />
          장바구니로 이동하시겠습니까?
        </p>
        <div className='modal-action w-full'>
          {/* <form method='dialog flex w-full'> */}
          {/* if there is a button in form, it will close the modal */}
          <button className='btn flex-1' onClick={onClose}>
            더 둘러보기
          </button>
          <button className='btn flex-1 btn-primary' onClick={onClose}>
            장바구니
          </button>
          {/* </form> */}
        </div>
      </div>
    </dialog>
  );
}
