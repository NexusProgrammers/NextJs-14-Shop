"use client";

import { imageType } from "@/app/admin/add-products/AddProductForm";
import { useCallback, useEffect, useState } from "react";
import SelectImage from "./SelectImage";
import Button from "../Button";

interface SelectColorProps {
  item: imageType;
  addImageToState: (value: imageType) => void;
  removeImageFromState: (value: imageType) => void;
  isProductCreated: boolean;
}

const SelectColor: React.FC<SelectColorProps> = ({
  item,
  addImageToState,
  removeImageFromState,
  isProductCreated,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (isProductCreated) {
      setIsSelected(false);
      setFile(null);
    }
  }, [isProductCreated]);

  const handleFileChange = useCallback(
    (value: File) => {
      setFile(value);
      addImageToState({ ...item, image: value });
    },
    [addImageToState, item]
  );

  const hanldeCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsSelected(e.target.checked);
      if (!e.target.checked) {
        setFile(null);
        removeImageFromState(item);
      }
    },
    [item, removeImageFromState]
  );

  return (
    <div className="grid grid-col-1 overflow-y-auto border-b-[1.2px] border-slate-200 items-center p-2">
      <div className="flex flex-row gap-2 items-center h-[60px]">
        <input
          id={item.color}
          type="checkbox"
          checked={isSelected}
          onChange={hanldeCheck}
          className="cursor-pointer"
        />
        <label htmlFor={item.color} className="font-medium cursor-pointer">
          {item.color}
        </label>
      </div>
      <>
        {isSelected && !file && (
          <div className="col-span-2 text-center">
            <SelectImage item={item} handleFileChange={handleFileChange} />
          </div>
        )}
        {file && (
          <div className="flex flex-row gap-2 text-sm col-span-2 items-center justify-between border border-red-900">
            <p>{file?.name}</p>
            <div className="w-[70px]">
              <Button
                small
                outline
                label="Cancel"
                onClick={() => {
                  setFile(null);
                  removeImageFromState(item);
                }}
              />
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default SelectColor;
