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

interface AddEditBrandProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValues?: { name: string; description: string; origin?: string; logo_url?: string; banner_url?: string };
  onSubmit?: (values: { id?: string; name: string; description: string; origin?: string; logo_file?: File; banner_file?: File }) => void;
  submitting: boolean;
}

export function AddEditBrand({
  open,
  setOpen,
  initialValues = { name: "", description: "", origin: "", logo_url: "", banner_url: "" },
  onSubmit,
  submitting,
}: AddEditBrandProps) {

  // Helper to determine mode
  const isEditMode = !!initialValues.name;

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      logo_file: undefined as File | undefined,
      banner_file: undefined as File | undefined,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Brand name is required")
        .min(2, "Brand name must be at least 2 characters"),
      description: Yup.string().optional(),
      origin: Yup.string()
        .required("Origin is required")
        .min(2, "Origin must be at least 2 characters"),
      logo_file: Yup.mixed().when("logo_url", {
        is: (logo_url: string | undefined) => !logo_url,
        then: (schema) =>
          schema
            .required("Logo image is required")
            .test("fileType", "Only image files are allowed", (value) =>
              value ? ["image/jpeg", "image/png", "image/gif"].includes((value as File).type) : false
            ),
        otherwise: (schema) => schema.optional(),
      }),
    }),
    onSubmit: (values) => {
      if (onSubmit) {
        const submitValues = {
          name: values.name,
          description: values.description,
          origin: values.origin,
          logo_file: values.logo_file,
        };
        onSubmit(submitValues);
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue(field, file);
    }
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) formik.resetForm();
    }} direction="right">
      <DrawerContent className="sm:max-w-[425px] h-full flex flex-col">
        <DrawerHeader>
          {/* Title Logic */}
          <DrawerTitle>{isEditMode ? "Edit Brand" : "Add Brand"}</DrawerTitle>
        </DrawerHeader>

        <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <Label htmlFor="name">Brand Name</Label>
              <Input
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter brand name"
                className={formik.touched.name && formik.errors.name ? "border-red-500" : ""}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter brand description (optional)"
                rows={4}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
              )}
            </div>
            <div>
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                name="origin"
                value={formik.values.origin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter brand origin"
                className={formik.touched.origin && formik.errors.origin ? "border-red-500" : ""}
              />
              {formik.touched.origin && formik.errors.origin && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.origin}</p>
              )}
            </div>
            <div>
              <Label htmlFor="logo_file">Logo Image</Label>
              <input
                id="logo_file"
                name="logo_file"
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={(event) => handleFileChange(event, "logo_file")}
                onBlur={formik.handleBlur}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("logo_file")?.click()}
                className="mt-2"
              >
                {formik.values.logo_file || formik.values.logo_url ? "Change Logo" : "Upload Logo"}
              </Button>
              {(formik.values.logo_file || formik.values.logo_url) && (
                <img
                  src={
                    formik.values.logo_file
                      ? URL.createObjectURL(formik.values.logo_file)
                      : formik.values.logo_url
                  }
                  alt="Logo preview"
                  className="mt-2 h-20 w-20 object-cover rounded border"
                />
              )}
              {formik.touched.logo_file && formik.errors.logo_file && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.logo_file}</p>
              )}
            </div>
          </div>

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

            {/* UPDATED BUTTON LOGIC HERE */}
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              {submitting
                ? (isEditMode ? "Updating..." : "Saving...")
                : (isEditMode ? "Update" : "Save")
              }
            </Button>

          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}