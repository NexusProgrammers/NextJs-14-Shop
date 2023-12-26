"use client";

import { Product } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import formatPrice from "@/utils/formatPrice";
import Heading from "@/app/components/Heading";
import Status from "@/app/components/Status";
import {
  MdCached,
  MdClose,
  MdDelete,
  MdDone,
  MdRemoveRedEye,
} from "react-icons/md";
import ActionBtn from "@/app/components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteObject, getStorage, ref } from "firebase/storage";
import firebaseApp from "@/libs/firebase";

interface ManageProductsClientProps {
  products: Product[];
}

const ManageProductsClient: React.FC<ManageProductsClientProps> = ({
  products,
}) => {
  const router = useRouter();
  const storage = getStorage(firebaseApp);

  const rows = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: formatPrice(product.price),
    category: product.category,
    brand: product.brand,
    inStock: product.inStock,
    images: product.images,
  }));

  const handleToggleStock = useCallback(
    async (id: string, inStock: boolean) => {
      try {
        await axios.put("/api/product", {
          id,
          inStock: !inStock,
        });
        toast.success("Product Status Changed");
        router.refresh();
      } catch (error) {
        toast.error("Something went wrong");
        console.error("Error", error);
      }
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string, images: any[]) => {
      try {
        toast.loading("Deleting product...", {
          duration: 3000,
        });

        const handleImageDelete = async () => {
          try {
            for (const item of images) {
              if (item.image) {
                const imageRef = ref(storage, item.image);
                await deleteObject(imageRef);
                console.log("Image Deleted", item.image);
              }
            }
          } catch (error) {
            console.error("Deleting images error", error);
          }
        };

        await handleImageDelete();

        try {
          await axios.delete(`/api/product/${id}`);
          toast.success("Product Delete Successfully");
          router.refresh();
        } catch (error) {
          console.error("Error deleting product", error);
          toast.error("Something went wrong");
        }
      } catch (error) {
        console.error("General error during deletion", error);
      }
    },
    [storage, router]
  );

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 220,
    },
    {
      field: "name",
      headerName: "Name",
      width: 220,
    },
    {
      field: "price",
      headerName: "Price(USB)",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="font-bold text-slate-800">{params.row.price}</div>
        );
      },
    },
    {
      field: "category",
      headerName: "Category",
      width: 100,
    },
    {
      field: "brand",
      headerName: "Brand",
      width: 100,
    },
    {
      field: "inStock",
      headerName: "inStock",
      width: 120,
      renderCell: (params) => {
        return (
          <div>
            {params.row.inStock === true ? (
              <Status
                text="in stock"
                icon={MdDone}
                bg="bg-teal-200"
                color="text-teal-700"
              />
            ) : (
              <Status
                text="out of stock"
                icon={MdClose}
                bg="bg-rose-200"
                color="text-rose-700"
              />
            )}
          </div>
        );
      },
    },

    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex justify-between gap-4 w-full">
            <ActionBtn
              icon={MdCached}
              onClick={() => {
                handleToggleStock(params.row.id, params.row.inStock);
              }}
            />
            <ActionBtn
              icon={MdDelete}
              onClick={() => {
                handleDelete(params.row.id, params.row.images);
              }}
            />
            <ActionBtn
              icon={MdRemoveRedEye}
              onClick={() => {
                router.push(`/product/${params.row.id}`);
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mb-4 mt-8">
        <Heading title="Manage Product" center />
      </div>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 9 },
            },
          }}
          pageSizeOptions={[9, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

export default ManageProductsClient;
