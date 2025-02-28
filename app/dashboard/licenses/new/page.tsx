"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import AdminAuth from "@/components/admin/AdminAuth";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User, Activity, FileText, ImageIcon } from "lucide-react";
import { supabase, getSupabaseClient } from "@/lib/supabase";

const licenseTypes = [
  { id: "mcycle", label: "M.CYCLE" },
  { id: "carjeep", label: "CAR/JEEP" },
] as const;

const pakistaniCities = [
  "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", 
  "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", 
  "Hyderabad", "Abbottabad", "Bahawalpur", "Sargodha", "Sukkur",
  "Jhang", "Sheikhupura", "Larkana", "Gujrat", "Mardan",
  "Kasur", "Rahim Yar Khan", "Sahiwal", "Okara", "Wah Cantonment",
  "Dera Ghazi Khan", "Mirpur Khas", "Nawabshah", "Mingora", "Chiniot",
  "Kamoke", "Sadiqabad", "Burewala", "Jacobabad", "Muzaffargarh",
  "Attock", "Khanewal", "Hafizabad", "Kohat", "Khairpur",
  "Khuzdar", "Dera Ismail Khan", "Charsadda", "Bahawalnagar"
].sort();

const formSchema = z.object({
  cnic: z.string().regex(/^\d{5}-\d{7}-\d{1}$/, "Invalid CNIC format"),
  name: z.string().min(3, "Name must be at least 3 characters").regex(/^[A-Za-z\s]+$/, "Name must contain only alphabets"),
  fatherName: z.string().min(3, "Father's name must be at least 3 characters").regex(/^[A-Za-z\s]+$/, "Father's name must contain only alphabets"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  height: z.string().min(1, "Height is required"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  licenseNo: z.string().min(1, "License number is required"),
  licenseTypes: z.array(z.string()).min(1, "Select at least one license type"),
  issueCity: z.string().min(1, "Issue city is required"),
  validFrom: z.string().min(1, "Valid from date is required"),
  validTo: z.string().min(1, "Valid to date is required"),
  image: z.instanceof(FileList).refine(
    (files) => files.length > 0, 
    "Image is required"
  ).refine(
    (files) => files[0]?.size <= 2 * 1024 * 1024, 
    "Image must be less than 2MB"
  ).refine(
    (files) => ['image/jpeg', 'image/png'].includes(files[0]?.type || ""), 
    "Only JPEG and PNG formats are allowed"
  ),
  signature: z.instanceof(FileList).refine(
    (files) => files.length > 0, 
    "Signature is required"
  ).refine(
    (files) => files[0]?.size <= 2 * 1024 * 1024, 
    "Signature must be less than 2MB"
  ).refine(
    (files) => files[0]?.type === 'image/png', 
    "Only PNG format is allowed for signature"
  ),
});

export default function NewLicensePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cnic: "",
      name: "",
      fatherName: "",
      address: "",
      height: "",
      bloodGroup: "",
      dateOfBirth: "",
      licenseNo: "",
      licenseTypes: [],
      issueCity: "",
      validFrom: "",
      validTo: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      
      // Check if user is admin
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      if (!isAdmin) {
        toast.error("Admin authentication required");
        router.push('/');
        return;
      }

      const supabaseClient = getSupabaseClient();
      
      // Handle image upload
      let imageUrl = null;
      if (values.image.length > 0) {
        const imageFile = values.image[0];
        const imagePath = `${values.cnic}/photo_${Date.now()}`;
        
        const { data: imageData, error: imageError } = await supabaseClient.storage
          .from('license-images')
          .upload(imagePath, imageFile, {
            contentType: imageFile.type,
            upsert: false,
          });

        if (imageError) {
          throw new Error('Failed to upload image');
        }

        const { data: imageUrlData } = supabaseClient.storage
          .from('license-images')
          .getPublicUrl(imagePath);
        
        imageUrl = imageUrlData.publicUrl;
      }

      // Handle signature upload
      let signatureUrl = null;
      if (values.signature.length > 0) {
        const signatureFile = values.signature[0];
        const signaturePath = `${values.cnic}/signature_${Date.now()}`;
        
        const { data: signatureData, error: signatureError } = await supabaseClient.storage
          .from('license-signatures')
          .upload(signaturePath, signatureFile, {
            contentType: 'image/png',
            upsert: false,
          });

        if (signatureError) {
          throw new Error('Failed to upload signature');
        }

        const { data: signatureUrlData } = supabaseClient.storage
          .from('license-signatures')
          .getPublicUrl(signaturePath);
        
        signatureUrl = signatureUrlData.publicUrl;
      }

      // Format the data to match the database schema
      const licenseData = {
        cnic: values.cnic,
        name: values.name,
        father_name: values.fatherName,
        address: values.address,
        height: values.height,
        blood_group: values.bloodGroup,
        date_of_birth: values.dateOfBirth,
        license_no: values.licenseNo,
        license_types: values.licenseTypes,
        issue_city: values.issueCity,
        valid_from: values.validFrom,
        valid_to: values.validTo,
        image_url: imageUrl,
        signature_url: signatureUrl
      };

      // Create the license in Supabase
      const { error } = await supabaseClient
        .from('licenses')
        .insert(licenseData);

      if (error) {
        throw error;
      }

      toast.success("License created successfully!");
      router.push('/dashboard/licenses');
    } catch (error: any) {
      console.error('Error creating license:', error);
      toast.error("Failed to create license");
      
      // Clear admin state if unauthorized
      if (error?.message?.includes('unauthorized')) {
        localStorage.removeItem('isAdmin');
        router.push('/');
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleImageChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    try {
      const file = files[0];
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image');
    }
  };

  const handleSignatureChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    try {
      const file = files[0];
      const base64 = await fileToBase64(file);
      setSignaturePreview(base64);
    } catch (error) {
      console.error('Error processing signature:', error);
      toast.error('Failed to process signature');
    }
  };

  return (
    <AdminAuth>
    <div className="space-y-6">
        <div className="flex items-center justify-between">
      <div>
            <h1 className="text-2xl font-semibold tracking-tight">Create License</h1>
            <p className="text-muted-foreground mt-1">Add a new driver license to the system</p>
          </div>
          <Link href="/dashboard/licenses">
            <Button variant="outline" className="gap-1">
              <ChevronLeft className="h-4 w-4" /> Back to Licenses
            </Button>
          </Link>
      </div>

        <Separator className="my-6" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-muted-foreground" />
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </div>
                  <CardDescription>Driver's personal details and identification</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormField
              control={form.control}
              name="cnic"
              render={({ field }) => (
                <FormItem>
                          <FormLabel className="text-foreground/80">CNIC</FormLabel>
                  <FormControl>
                            <Input 
                              placeholder="12345-1234567-1" 
                              className="bg-background shadow-sm" 
                              {...field} 
                            />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                          <FormLabel className="text-foreground/80">Full Name</FormLabel>
                  <FormControl>
                            <Input 
                              placeholder="Enter full name" 
                              className="bg-background shadow-sm" 
                              {...field} 
                            />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fatherName"
              render={({ field }) => (
                <FormItem>
                          <FormLabel className="text-foreground/80">Father's Name</FormLabel>
                  <FormControl>
                            <Input 
                              placeholder="Enter father's name" 
                              className="bg-background shadow-sm" 
                              {...field} 
                            />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                          <FormLabel className="text-foreground/80">Date of Birth</FormLabel>
                  <FormControl>
                            <Input 
                              type="date" 
                              className="bg-background shadow-sm" 
                              {...field} 
                            />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className="text-foreground/80">Address</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter complete address" 
                              className="bg-background shadow-sm" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Physical Attributes */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-muted-foreground" />
                    <CardTitle className="text-lg">Physical Attributes</CardTitle>
                  </div>
                  <CardDescription>Driver's physical characteristics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormField
              control={form.control}
              name="bloodGroup"
              render={({ field }) => (
                <FormItem>
                          <FormLabel className="text-foreground/80">Blood Group</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                              <SelectTrigger className="bg-background shadow-sm">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                          <FormLabel className="text-foreground/80">Height</FormLabel>
                  <FormControl>
                            <Input 
                              placeholder="e.g. 5'11" 
                              className="bg-background shadow-sm" 
                              {...field} 
                            />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                  </div>
                </CardContent>
              </Card>

              {/* License Details */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                    <CardTitle className="text-lg">License Details</CardTitle>
                  </div>
                  <CardDescription>License identification and validity information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormField
              control={form.control}
                      name="licenseNo"
              render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80">License Number</FormLabel>
                  <FormControl>
                            <Input 
                              placeholder="ABC123456" 
                              className="bg-background shadow-sm" 
                              {...field} 
                            />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issueCity"
              render={({ field }) => (
                <FormItem>
                          <FormLabel className="text-foreground/80">Issue City</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                              <SelectTrigger className="bg-background shadow-sm">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                              {pakistaniCities.map(city => (
                                <SelectItem key={city.toLowerCase()} value={city.toLowerCase()}>
                                  {city}
                                </SelectItem>
                              ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="validFrom"
              render={({ field }) => (
                <FormItem>
                          <FormLabel className="text-foreground/80">Valid From</FormLabel>
                  <FormControl>
                            <Input 
                              type="date" 
                              className="bg-background shadow-sm" 
                              {...field} 
                            />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="validTo"
              render={({ field }) => (
                <FormItem>
                          <FormLabel className="text-foreground/80">Valid To</FormLabel>
                  <FormControl>
                            <Input 
                              type="date" 
                              className="bg-background shadow-sm" 
                              {...field} 
                            />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

                  <div className="mt-6">
                    <FormLabel className="text-foreground/80 mb-2 block">License Types</FormLabel>
                    <div className="bg-muted/30 p-4 rounded-md border border-border/50">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {licenseTypes.map((type) => (
                          <div key={type.id} className="flex items-center space-x-2 bg-background rounded p-2 border border-border/30 hover:border-primary/30 transition-colors">
                            <Checkbox
                              id={`license-type-${type.id}`}
                              checked={form.getValues().licenseTypes?.includes(type.id)}
                              onCheckedChange={(checked) => {
                                const currentValues = [...(form.getValues().licenseTypes || [])];
                                if (checked) {
                                  form.setValue("licenseTypes", [...currentValues, type.id], {
                                    shouldValidate: true,
                                  });
                                } else {
                                  form.setValue(
                                    "licenseTypes",
                                    currentValues.filter((value) => value !== type.id),
                                    { shouldValidate: true }
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor={`license-type-${type.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {type.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      {form.formState.errors.licenseTypes && (
                        <p className="text-sm font-medium text-destructive mt-2">
                          {form.formState.errors.licenseTypes.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents and Images */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                    <CardTitle className="text-lg">Documents</CardTitle>
                  </div>
                  <CardDescription>Upload required documents and images</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80">Photo</FormLabel>
                          <FormControl>
                            <div className="flex flex-col gap-2">
                              <Input
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={(e) => onChange(e.target.files)}
                                className="bg-background shadow-sm"
                                {...fieldProps}
                              />
                              <p className="text-xs text-muted-foreground">
                                JPEG/PNG format, max 2MB
                              </p>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="signature"
                      render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80">Signature</FormLabel>
                          <FormControl>
                            <div className="flex flex-col gap-2">
                              <Input
                                type="file"
                                accept="image/png"
                                onChange={(e) => onChange(e.target.files)}
                                className="bg-background shadow-sm"
                                {...fieldProps}
                              />
                              <p className="text-xs text-muted-foreground">
                                PNG format only, max 2MB
                              </p>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
              <Link href="/dashboard/licenses">
                <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full sm:w-auto"
                >
              Cancel
            </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full sm:w-auto min-w-[150px]"
              >
                {isLoading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>}
              Create License
            </Button>
          </div>
        </form>
      </Form>
    </div>
    </AdminAuth>
  );
}

// Helper function to convert file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}