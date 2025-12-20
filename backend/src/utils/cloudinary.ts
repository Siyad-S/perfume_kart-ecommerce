// import { uploadToCloudinary, deleteFromCloudinary } from "@/services/cloudinary.service";

// // Generic interface for file upload results
// export interface FileUploadResult {
//     [key: string]: {
//         url?: string;
//         publicId?: string;
//     };
// }

// // Interface for BrandType (move to appropriate file if shared)
// export interface BrandType {
//     name: string;
//     description?: string;
//     origin?: string;
//     logo_url?: string;
//     banner_url?: string;
//     logo_public_id?: string;
//     banner_public_id?: string;
//     is_deleted?: boolean;
// }

// // Configuration for file uploads
// export interface FileUploadConfig {
//     fieldName: string; // e.g., "logo_file", "product_image"
//     folder: string; // e.g., "brand_logos", "product_images"
//     resourceType?: "image" | "video" | "raw" | "auto"; // Default to "image"
// }

// // Generic helper function to handle file uploads and deletions
// export async function handleFileUploads(
//     files: { [fieldname: string]: Express.Multer.File[] },
//     config: FileUploadConfig[],
//     existingEntity?: Record<string, any>,
//     cleanupOnError: boolean = false
// ): Promise<FileUploadResult> {
//     const result: FileUploadResult = {};

//     for (const { fieldName, folder, resourceType = "image" } of config) {
//         result[fieldName] = {
//             url: existingEntity?.[`${fieldName}_url`],
//             publicId: existingEntity?.[`${fieldName}_public_id`],
//         };

//         if (files[fieldName] && files[fieldName][0]) {
//             try {
//                 // Delete old file from Cloudinary if it exists
//                 if (existingEntity?.[`${fieldName}_public_id`]) {
//                     await deleteFromCloudinary(existingEntity[`${fieldName}_public_id`]);
//                 }
//                 const uploadResult = await uploadToCloudinary(files[fieldName][0].buffer, {
//                     folder,
//                     resource_type: resourceType,
//                 });
//                 result[fieldName] = {
//                     url: uploadResult.url,
//                     publicId: uploadResult.publicId,
//                 };
//             } catch (error) {
//                 if (cleanupOnError && result[fieldName].publicId) {
//                     try {
//                         await deleteFromCloudinary(result[fieldName].publicId!);
//                     } catch (cleanupError) {
//                         console.error(`Cleanup Error (${fieldName}):`, cleanupError);
//                     }
//                 }
//                 throw error; // Re-throw to be handled by the caller
//             }
//         }
//     }

//     return result;
// }