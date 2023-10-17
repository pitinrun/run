'use client';
import { useEffect, useState } from 'react';
import ProductCard from './product-card';
import axios from 'axios';
import { BrandType, IProduct, SeasonType } from '@/src/types';
import { JSONToBase64, base64ToJSON } from '@/src/utils';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import OrderDialog from './order-dialog';
import EmptyAlert from './empty-alert';
import StockDialog from './stock-dialog';

export default function ProductCardDashboard__V2({
  selectedBrands = null,
  title,
  season = '',
  onlySpecialDiscount = false,
  sizeSearchKeyword = '',
  perPage = 10,
  onRoundUpToHundred = false,
}: {
  selectedBrands?: BrandType[] | null;
  title?: string;
  season?: SeasonType | '';
  onlySpecialDiscount?: boolean;
  sizeSearchKeyword?: string;
  perPage?: number;
  onRoundUpToHundred?: boolean;
}) {
  const router = useRouter();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [stockDialogCode, setStockDialogCode] = useState<string | null>(null);

  useEffect(() => {
    setProducts([]);
    setPage(1);
  }, [season, onlySpecialDiscount, selectedBrands, sizeSearchKeyword]);

  useEffect(() => {
    let isMounted = true; // 이 플래그로 컴포넌트가 마운트 상태인지 확인

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/api/product?${new URLSearchParams({
            page: page.toString(),
            perPage: perPage.toString(),
            brands: selectedBrands ? selectedBrands.join(',') : '', // NOTE: 배열 무한 호출 방지
            season,
            onlySpecialDiscount: onlySpecialDiscount.toString(),
            sizeSearchKeyword,
            hasStock: 'false',
          }).toString()}`
        );

        if (isMounted) {
          setProducts(prevProducts => [
            ...prevProducts,
            ...response.data.products,
          ]);
          setMaxPage(response.data.pagination.pages);
        }

        setIsLoading(false);
      } catch (error) {
        if (isMounted) {
          console.error('There was an error fetching data', error);
        }
      }
    };

    fetchData(); // 아니면, 기존 로직대로 fetchData를 호출합니다.

    return () => {
      isMounted = false; // 컴포넌트 언마운트 시 플래그를 false로 설정
    };
  }, [page, season, onlySpecialDiscount, selectedBrands, sizeSearchKeyword]);

  if (isLoading && page === 1) {
    return (
      <div className='text-center'>
        <span className='loading loading-spinner loading-lg' />
      </div>
    );
  }

  function onPurchaseClick({
    productCode,
    quantity,
    discountRate,
  }: {
    productCode: string;
    quantity: number;
    discountRate: number;
  }) {
    // Add to wishlist without duplication
    const wishlistBase64 = localStorage.getItem('wishlist');
    const wishlist = wishlistBase64 ? base64ToJSON(wishlistBase64) : [];

    if (wishlist.some((item: any) => item.productCode === productCode)) {
      // If the product is already in the wishlist, just open the order dialog
      toast.error('이미 위시리스트에 추가된 상품입니다.');
      setOrderDialogOpen(true);
      return;
    }

    const wishlistJson = JSONToBase64([
      ...wishlist,
      {
        productCode,
        quantity: quantity < 1 ? 1 : quantity,
        discountRate: discountRate < 0 ? 0 : discountRate / 100,
      },
    ]);
    localStorage.setItem('wishlist', wishlistJson);

    setOrderDialogOpen(true);
  }

  function handleStockClick(productCode: string) {
    // console.log('$$ productCode', productCode);
    setStockDialogCode(productCode);
  }

  if (!isLoading && products.length <= 0) {
    return (
      <EmptyAlert>
        <div className='text-base sm:text-lg'>검색된 제품이 없습니다.</div>
        <div className='text-base sm:text-lg'>검색 조건을 확인해 주세요!</div>
      </EmptyAlert>
    );
  }

  return (
    <div>
      {title && <h2 className='text-lg sm:text-2xl font-bold mb-2'>{title}</h2>}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {products.map((product, index) => (
          <ProductCard
            key={`product-card-${index}-${product.pattern}`}
            onPurchaseClick={onPurchaseClick}
            onRoundUpToHundred={onRoundUpToHundred}
            onStockClick={handleStockClick}
            defaultQuantity={1}
            {...product}
          />
        ))}
      </div>
      {page < maxPage && (
        <button
          className='btn btn-outline w-full btn-ghost btn-block text-2xl my-4'
          onClick={() => setPage(page + 1)}
        >
          + 더보기
        </button>
      )}
      <OrderDialog
        open={orderDialogOpen}
        onConfirm={() => {
          router.push('/wishlist');
          setOrderDialogOpen(false);
        }}
        onClose={() => {
          setOrderDialogOpen(false);
        }}
      />
      <StockDialog
        open={!!stockDialogCode}
        productCode={stockDialogCode}
        onClose={() => {
          setStockDialogCode(null);
        }}
      />
    </div>
  );
}
