import { BrandType } from '@/src/types';

export default function BrandFilter({
  brands,
  selectedBrands,
  setSelectedBrands,
  className,
}: {
  brands: BrandType[];
  selectedBrands: BrandType[];
  setSelectedBrands: (brands: BrandType[]) => void;
  className?: string;
}) {
  const toggleBrand = (brand: BrandType) => {
    if (selectedBrands.includes(brand)) {
      // Remove brand if it is already selected
      const newSelectedBrands = selectedBrands.filter(b => b !== brand);
      setSelectedBrands(newSelectedBrands);
    } else {
      // Add brand to the list of selected brands
      const newSelectedBrands = [...selectedBrands, brand];
      setSelectedBrands(newSelectedBrands);
    }
  };

  return (
    <div>
      {brands.map((item, index) => {
        if (!item) {
          return;
        }
        return (
          <button
            className={`btn btn-sm sm:btn-md ${
              selectedBrands.includes(item) ? 'btn-primary' : 'btn-ghost'
            } ${className}`}
            name='options'
            aria-label={item}
            key={index}
            onClick={() => toggleBrand(item)}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
