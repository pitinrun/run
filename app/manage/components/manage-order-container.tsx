import OrderModalProvider from '../contexts/order-modal.context';
import ManageOrderList from './manage-order-list';

export default function ManageOrderContainer() {
  return (
    <OrderModalProvider>
      <ManageOrderList />
    </OrderModalProvider>
  );
}
