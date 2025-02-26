"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ChevronLeft, 
  Printer, 
  Calendar, 
  CreditCard, 
  User, 
  MapPin, 
  DropletIcon, 
  Ruler, 
  Car, 
  Bike, 
  Truck, 
  FileText, 
  Building,
  Clock, 
  Edit2, 
  AlertTriangle,
  Bell,
  LogOut,
  Settings,
  UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { License } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LicenseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [license, setLicense] = useState<License | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3); // Example notification count

  useEffect(() => {
    const fetchLicense = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('licenses')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          throw error;
        }

        setLicense(data);
      } catch (error) {
        console.error('Error fetching license:', error);
        toast.error('Failed to load license details');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchLicense();
    }
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Determine license status based on dates
  const getLicenseStatus = (validTo: string) => {
    const expiryDate = new Date(validTo);
    const now = new Date();
    
    if (expiryDate < now) {
      return { 
        label: "Expired", 
        className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />
      };
    }
    
    // If expiring in the next 3 months
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    
    if (expiryDate < threeMonthsFromNow) {
      return { 
        label: "Expiring Soon", 
        className: "bg-warning/10 text-warning hover:bg-warning/20",
        icon: <Clock className="h-3.5 w-3.5 mr-1" />
      };
    }
    
    return { 
      label: "Active", 
      className: "bg-success/10 text-success hover:bg-success/20",
      icon: <FileText className="h-3.5 w-3.5 mr-1" />
    };
  };

  // Function to render license type icons
  const renderLicenseTypeIcon = (type: string) => {
    switch(type) {
      case 'mcycle':
        return <Bike className="h-5 w-5" />;
      case 'carjeep':
        return <Car className="h-5 w-5" />;
      case 'ltv':
        return <Truck className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  // Function to get license type label
  const getLicenseTypeLabel = (type: string) => {
    switch(type) {
      case 'mcycle':
        return 'Motorcycle';
      case 'carjeep':
        return 'Car/Jeep';
      case 'ltv':
        return 'Light Transport Vehicle';
      case 'htv':
        return 'Heavy Transport Vehicle';
      default:
        return type.toUpperCase();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div>
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-32 mt-1" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Left Column - Personal Details */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <Skeleton className="h-40 w-32 rounded-md" />
                </div>
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-6 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - License Details */}
          <div className="md:col-span-2">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className="h-6 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton key={index} className="h-20 w-full rounded-md" />
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <div className="h-20">
                    <Skeleton className="h-full w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!license) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center max-w-md p-8 rounded-lg border border-muted bg-card">
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

  const status = getLicenseStatus(license.valid_to);
  const expiryDate = new Date(license.valid_to);
  const today = new Date();
  const daysDifference = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => router.push('/dashboard/licenses')}
            className="h-9 w-9 rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">License Details</h1>
            <p className="text-sm text-muted-foreground">Viewing details for {license.name}</p>
          </div>
        </div>
        <div className="flex gap-2 self-end sm:self-auto">
          <Link href={`/dashboard/licenses/${license.id}/edit`}>
            <Button variant="outline" className="gap-1.5">
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button 
            onClick={() => router.push(`/dashboard/licenses/${license.id}/print`)}
            className="gap-1.5"
          >
            <Printer className="h-4 w-4" />
            Print License
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Left Column - Personal Details */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Personal Details</CardTitle>
                </div>
                <Badge className={`${status.className} text-xs px-2 py-0.5`}>
                  <div className="flex items-center">
                    {status.icon}
                    {status.label}
                  </div>
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {daysDifference < 0 ? (
                  <span>Expired {Math.abs(daysDifference)} days ago</span>
                ) : (
                  <span>{daysDifference === 0 ? 'Expires today' : `${daysDifference} days remaining`}</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="flex flex-col items-center pb-4 border-b border-border/40">
                <div className="relative h-32 w-28 overflow-hidden rounded-md border border-border/50 mb-3">
                  {license.image_url ? (
                    <Image
                      src={license.image_url}
                      alt={`${license.name}'s photo`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted/40">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <h2 className="text-lg font-semibold">{license.name}</h2>
                <p className="text-sm text-muted-foreground">{license.cnic}</p>
              </div>
              
              <div className="space-y-3 mt-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Father's Name</p>
                  <p className="text-sm">{license.father_name}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Date of Birth</p>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-sm">{license.date_of_birth}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-muted/30 rounded-md p-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <DropletIcon className="h-3.5 w-3.5 text-primary/70" />
                      <span className="text-xs font-medium">Blood Group</span>
                    </div>
                    <p className="text-sm font-medium">{license.blood_group}</p>
                  </div>
                  
                  <div className="bg-muted/30 rounded-md p-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Ruler className="h-3.5 w-3.5 text-primary/70" />
                      <span className="text-xs font-medium">Height</span>
                    </div>
                    <p className="text-sm">{license.height}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - License Details */}
        <div className="md:col-span-2">
          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">License Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-muted/30 rounded-md p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">License Number</p>
                    <p className="text-base font-medium tracking-wide">{license.license_no}</p>
                  </div>
                  
                  <div className="bg-muted/30 rounded-md p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Issue City</p>
                    <div className="flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-sm capitalize">{license.issue_city}</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 rounded-md p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Valid From</p>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-sm">{formatDate(license.valid_from)}</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 rounded-md p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Valid To</p>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-sm font-medium">{formatDate(license.valid_to)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">License Types</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {license.license_types.map((type) => (
                    <div 
                      key={type} 
                      className="bg-muted/30 rounded-md p-3 flex flex-col items-center text-center"
                    >
                      <div className="p-2 bg-background rounded-full mb-2">
                        {renderLicenseTypeIcon(type)}
                      </div>
                      <p className="text-xs font-medium">{getLicenseTypeLabel(type)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Address</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="text-sm leading-relaxed">{license.address}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Signature</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="relative h-20 w-full overflow-hidden rounded-md bg-muted/30">
                  {license.signature_url ? (
                    <Image
                      src={license.signature_url}
                      alt={`${license.name}'s signature`}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-xs text-muted-foreground">No signature</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 