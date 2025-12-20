import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/src/components/ui/drawer";
import { Loader } from "lucide-react";

interface AddEditCategoryProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValues?: {
    id?: string;
    name: string;
    description: string;
    image_file?: File;
    image_url?: string;
  };
  onSubmit?: (values: {
    id?: string;
    name: string;
    description: string;
    image_file?: File;
  }) => void;
  submitting?: boolean;
}

export function AddEditCategory({
  open,
  setOpen,
  initialValues = { name: "", description: "", image_url: "" },
  onSubmit,
  submitting = false,
}: AddEditCategoryProps) {
  const isEditMode = !!initialValues.name;
  const formik = useFormik({
    initialValues: {
      ...initialValues,
      image_file: undefined as File | undefined,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Category name is required")
        .min(2, "Category name must be at least 2 characters"),
      description: Yup.string().optional(),
      image_file: Yup.mixed().when("image_url", {
        is: (image_url: string | undefined) => !image_url,
        then: (schema) =>
          schema
            .required("Image is required")
            .test("fileType", "Only image files are allowed", (value) =>
              value
                ? ["image/jpeg", "image/png", "image/gif"].includes(
                  (value as File).type
                )
                : false
            ),
        otherwise: (schema) => schema.optional(),
      }),
    }),
    onSubmit: (values) => {
      if (onSubmit) {
        const submitValues = {
          name: values.name,
          description: values.description,
          image_file: values.image_file,
        };
        onSubmit(submitValues);
      }
    },
  });

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue(field, file);
    }
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) formik.resetForm();
      }}
      direction="right"
    >
      {/* 1. Added flex-col to DrawerContent */}
      <DrawerContent className="sm:max-w-[425px] h-full flex flex-col">
        <DrawerHeader>
          <DrawerTitle>
            {initialValues?.id ? "Edit Category" : "Add Category"}
          </DrawerTitle>
        </DrawerHeader>

        {/* 2. Form takes remaining height with hidden overflow */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1 overflow-hidden">

          {/* 3. Scrollable content area for inputs */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Category Name */}
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter category name"
                className={
                  formik.touched.name && formik.errors.name
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter category description (optional)"
                rows={4}
              />
              {formik.touched.description &&
                formik.errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.description}
                  </p>
                )}
            </div>

            {/* Image Upload */}
            <div>
              <Label htmlFor="image_file">Category Image</Label>

              <input
                id="image_file"
                name="image_file"
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={(event) => handleFileChange(event, "image_file")}
                onBlur={formik.handleBlur}
                className="hidden"
              />

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  document.getElementById("image_file")?.click()
                }
                className="mt-2"
              >
                {formik.values.image_file || formik.values.image_url
                  ? "Change Image"
                  : "Upload Image"}
              </Button>

              {(formik.values.image_file || formik.values.image_url) && (
                <img
                  src={
                    formik.values.image_file
                      ? URL.createObjectURL(formik.values.image_file)
                      : formik.values.image_url
                  }
                  alt="Category preview"
                  className="mt-2 h-20 w-20 object-cover rounded border"
                />
              )}

              {formik.touched.image_file &&
                formik.errors.image_file && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.image_file}
                  </p>
                )}
            </div>
          </div>

          {/* 4. Footer stays pinned at bottom */}
          <DrawerFooter className="border-t bg-background pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                formik.resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              )}
              {submitting
                ? (isEditMode ? "Updating..." : "Saving...")
                : (isEditMode ? "Update" : "Save")}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}