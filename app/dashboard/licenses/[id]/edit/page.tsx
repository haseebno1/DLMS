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
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import AdminAuth from "@/components/admin/AdminAuth";
import { supabase, getSupabaseClient } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { 
  ChevronLeft, 
  Save, 
  User, 
  Activity, 
  FileText, 
  ImageIcon, 
  Calendar, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  UploadCloud,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

// Modified schema for edit - making image and signature optional
const editFormSchema = z.object({
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
  image: z.instanceof(FileList)
    .refine(files => files.length === 0 || files[0]?.size <= 2 * 1024 * 1024, "Image must be less than 2MB")
    .refine(
      files => files.length === 0 || ['image/jpeg', 'image/png'].includes(files[0]?.type || ""), 
      "Only JPEG and PNG formats are allowed"
    )
    .optional(),
  signature: z.instanceof(FileList)
    .refine(files => files.length === 0 || files[0]?.size <= 2 * 1024 * 1024, "Signature must be less than 2MB")
    .refine(
      files => files.length === 0 || files[0]?.type === 'image/png', 
      "Only PNG format is allowed for signature"
    )
    .optional(),
});

export default function EditLicensePage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [license, setLicense] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
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

  // Fetch license data
  useEffect(() => {
    const fetchLicense = async () => {
      try {
        setIsLoading(true);
        const supabaseClient = getSupabaseClient();
        const { data, error } = await supabaseClient
          .from('licenses')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          throw error;
        }

        setLicense(data);
        setImagePreview(data.image_url || null);
        setSignaturePreview(data.signature_url || null);
        
        // Update form values with existing license data
        form.reset({
          cnic: data.cnic || "",
          name: data.name || "",
          fatherName: data.father_name || "",
          address: data.address || "",
          height: data.height || "",
          bloodGroup: data.blood_group || "",
          dateOfBirth: data.date_of_birth || "",
          licenseNo: data.license_no || "",
          licenseTypes: data.license_types || [],
          issueCity: data.issue_city || "",
          validFrom: data.valid_from || "",
          validTo: data.valid_to || "",
        });
      } catch (error) {
        console.error('Error fetching license:', error);
        toast.error('Failed to load license details');
        
        // Clear admin state if unauthorized
        if (error?.message?.includes('unauthorized')) {
          localStorage.removeItem('isAdmin');
          router.push('/');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchLicense();
    }
  }, [params.id, form]);

  // Helper function to convert file to base64
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Update preview when a new image is selected
  const handleImageChange = async (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      try {
        const base64 = await fileToBase64(file);
        setImagePreview(base64);
      } catch (error) {
        console.error('Error previewing image:', error);
      }
    }
  };

  // Update preview when a new signature is selected
  const handleSignatureChange = async (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      try {
        const base64 = await fileToBase64(file);
        setSignaturePreview(base64);
      } catch (error) {
        console.error('Error previewing signature:', error);
      }
    }
  };

  async function onSubmit(values: z.infer<typeof editFormSchema>) {
    try {
      setIsSaving(true);
      
      // Check if user is admin
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      if (!isAdmin) {
        toast.error("Admin authentication required");
        router.push('/');
        return;
      }

      const supabaseClient = getSupabaseClient();

      // Handle image upload if new image is selected
      let imageUrl = license?.image_url;
      if (values.image && values.image.length > 0) {
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

      // Handle signature upload if new signature is selected
      let signatureUrl = license?.signature_url;
      if (values.signature && values.signature.length > 0) {
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

      // Update the license in Supabase
      const { error } = await supabaseClient
        .from('licenses')
        .update(licenseData)
        .eq('id', params.id);

      if (error) {
        throw error;
      }

      toast.success('License updated successfully');
      router.push('/dashboard/licenses');
    } catch (error: any) {
      console.error('Error updating license:', error);
      toast.error(error?.message || 'Failed to update license');
      
      // Clear admin state if unauthorized
      if (error?.message?.includes('unauthorized')) {
        localStorage.removeItem('isAdmin');
        router.push('/');
      }
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <Separator />
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-10 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!license) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center max-w-md p-8 rounded-lg border border-muted bg-card shadow-sm">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold">License Not Found</h2>
          <p className="text-muted-foreground mt-2 mb-6">The requested license could not be found or has been deleted.</p>
          <Button size="lg" onClick={() => router.push('/dashboard/licenses')}>
            Back to Licenses
          </Button>
        </div>
      </div>
    );
  }

  // Determine if license is valid, expired, or expiring soon
  const determineStatus = () => {
    const validTo = new Date(license.valid_to);
    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    
    if (validTo < now) {
      return { 
        label: "Expired", 
        className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />
      };
    } else if (validTo < threeMonthsFromNow) {
      return { 
        label: "Expiring Soon", 
        className: "bg-warning/10 text-warning hover:bg-warning/20",
        icon: <Clock className="h-3.5 w-3.5 mr-1" />
      };
    } else {
      return { 
        label: "Active", 
        className: "bg-success/10 text-success hover:bg-success/20",
        icon: <FileText className="h-3.5 w-3.5 mr-1" />
      };
    }
  };

  const status = determineStatus();

  return (
    <AdminAuth>
      <div className="space-y-6 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => router.push(`/dashboard/licenses/${params.id}`)}
              className="h-10 w-10 rounded-full shadow-sm hover:shadow"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit License</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground">
                  Editing license for <span className="font-medium">{license.name}</span>
                </p>
                <span>•</span>
                <div className="flex items-center">
                  <Badge className={status.className}>
                    <div className="flex items-center">
                      {status.icon}
                      {status.label}
                    </div>
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {/* Personal Information */}
              <Card className="shadow-md hover:shadow-lg transition-all">
                <CardHeader className="bg-muted/50 pb-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </div>
                  <CardDescription>Driver's personal details and identification</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
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
                              className="bg-background shadow-sm transition-all focus:ring-1 focus:ring-primary/50" 
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
                              className="bg-background shadow-sm transition-all focus:ring-1 focus:ring-primary/50" 
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
                              className="bg-background shadow-sm transition-all focus:ring-1 focus:ring-primary/50" 
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
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <FormControl>
                              <Input 
                                type="date" 
                                className="bg-background shadow-sm transition-all focus:ring-1 focus:ring-primary/50" 
                                {...field} 
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className="text-foreground/80">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>Address</span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter complete address" 
                              className="bg-background shadow-sm transition-all focus:ring-1 focus:ring-primary/50" 
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
              <Card className="shadow-md hover:shadow-lg transition-all">
                <CardHeader className="bg-muted/50 pb-3">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-primary" />
                    <CardTitle className="text-lg">Physical Attributes</CardTitle>
                  </div>
                  <CardDescription>Driver's physical characteristics</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
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
                              <SelectTrigger className="bg-background shadow-sm transition-all">
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
                              placeholder="e.g. 5'11''" 
                              className="bg-background shadow-sm transition-all focus:ring-1 focus:ring-primary/50" 
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
              <Card className="shadow-md hover:shadow-lg transition-all">
                <CardHeader className="bg-muted/50 pb-3">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    <CardTitle className="text-lg">License Details</CardTitle>
                  </div>
                  <CardDescription>License identification and validity information</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
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
                              className="bg-background shadow-sm transition-all focus:ring-1 focus:ring-primary/50" 
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
                              <SelectTrigger className="bg-background shadow-sm transition-all">
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
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <FormControl>
                              <Input 
                                type="date" 
                                className="bg-background shadow-sm transition-all focus:ring-1 focus:ring-primary/50" 
                                {...field} 
                              />
                            </FormControl>
                          </div>
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
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <FormControl>
                              <Input 
                                type="date" 
                                className="bg-background shadow-sm transition-all focus:ring-1 focus:ring-primary/50" 
                                {...field} 
                              />
                            </FormControl>
                          </div>
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
              <Card className="shadow-md hover:shadow-lg transition-all">
                <CardHeader className="bg-muted/50 pb-3">
                  <div className="flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2 text-primary" />
                    <CardTitle className="text-lg">Documents</CardTitle>
                  </div>
                  <CardDescription>Update license photos and signature</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80">Photo</FormLabel>
                          <FormControl>
                            <div className="space-y-3">
                              <div className="relative h-48 w-36 overflow-hidden rounded-md border border-muted mx-auto">
                                {imagePreview ? (
                                  <Image
                                    src={imagePreview}
                                    alt="License photo preview"
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-muted/60">
                                    <User className="h-16 w-16 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col gap-2">
                                <div className="relative">
                                  <Input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    onChange={(e) => {
                                      onChange(e.target.files);
                                      handleImageChange(e.target.files);
                                    }}
                                    className="bg-background shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                    {...fieldProps}
                                  />
                                  <UploadCloud className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  JPEG/PNG format, max 2MB. Current photo will be used if no new file is selected.
                                </p>
                              </div>
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
                            <div className="space-y-3">
                              <div className="relative h-24 w-full overflow-hidden rounded-md border border-muted bg-muted/30">
                                {signaturePreview ? (
                                  <Image
                                    src={signaturePreview}
                                    alt="Signature preview"
                                    fill
                                    className="object-contain p-2"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <span className="text-sm text-muted-foreground">No signature uploaded</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col gap-2">
                                <div className="relative">
                                  <Input
                                    type="file"
                                    accept="image/png"
                                    onChange={(e) => {
                                      onChange(e.target.files);
                                      handleSignatureChange(e.target.files);
                                    }}
                                    className="bg-background shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                    {...fieldProps}
                                  />
                                  <UploadCloud className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  PNG format only, max 2MB. Current signature will be used if no new file is selected.
                                </p>
                              </div>
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
              <Link href={`/dashboard/licenses/${params.id}`}>
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
                disabled={isSaving} 
                className="w-full sm:w-auto min-w-[150px] shadow-sm hover:shadow"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminAuth>
  );
} 