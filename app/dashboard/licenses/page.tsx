"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  FileText,
  User,
  Calendar,
  Car,
  Trash2,
  Pencil,
  Printer,
  MoreHorizontal,
  X,
  Filter,
  ChevronRight,
  Bike,
  Truck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { License } from "@/lib/supabase";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// License type mapping with proper icons
const LICENSE_TYPES = {
  mcycle: {
    label: "Motorcycle",
    icon: Bike,
  },
  carjeep: {
    label: "Car/Jeep",
    icon: Car,
  },
  ltv: {
    label: "LTV",
    icon: Truck,
  },
  htv: {
    label: "HTV",
    icon: Truck,
  },
} as const;

type LicenseType = keyof typeof LICENSE_TYPES;

// Function to get license type info
const getLicenseTypeInfo = (type: string) => {
  const licenseType = type as LicenseType;
  if (licenseType in LICENSE_TYPES) {
    return LICENSE_TYPES[licenseType];
  }
  return {
    label: type.toUpperCase(),
    icon: FileText,
  };
};

export default function LicensesPage() {
  const [search, setSearch] = useState("");
  const [licenses, setLicenses] = useState<License[]>([]);
  const [filteredLicenses, setFilteredLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [licenseToDelete, setLicenseToDelete] = useState<License | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch licenses
  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('licenses')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setLicenses(data || []);
        setFilteredLicenses(data || []);
      } catch (error) {
        console.error('Error fetching licenses:', error);
        toast.error('Failed to load licenses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLicenses();
  }, []);

  // Handle search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredLicenses(licenses);
      return;
    }

    const searchTerm = search.toLowerCase().trim();
    const results = licenses.filter(
      (license) =>
        license.cnic.toLowerCase().includes(searchTerm) ||
        license.license_no.toLowerCase().includes(searchTerm) ||
        license.name.toLowerCase().includes(searchTerm)
    );

    setFilteredLicenses(results);
  }, [search, licenses]);

  // Handle delete
  const handleDelete = async () => {
    if (!licenseToDelete) return;
    
    try {
      setIsDeleting(true);
      
      // Get admin token from localStorage
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        toast.error("Admin authentication required");
        return;
      }
      
      const response = await fetch('/api/admin-delete-license', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: licenseToDelete.id,
          adminToken,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success("License deleted successfully!");
        // Remove the deleted license from the state
        setLicenses(licenses.filter(license => license.id !== licenseToDelete.id));
        setLicenseToDelete(null);
        setShowDeleteDialog(false);
      } else {
        toast.error(`Failed to delete license: ${result.error}`);
        
        // If unauthorized, show login message
        if (response.status === 401) {
          toast.error("Admin authentication required");
        }
      }
    } catch (error) {
      console.error("License deletion error:", error);
      toast.error("Failed to delete license");
    } finally {
      setIsDeleting(false);
    }
  };

  // Determine license status based on dates
  const getLicenseStatus = (validTo: string) => {
    const expiryDate = new Date(validTo);
    const now = new Date();
    
    if (expiryDate < now) {
      return { label: "Expired", className: "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400" };
    }
    
    // If expiring in the next 3 months
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    
    if (expiryDate < threeMonthsFromNow) {
      return { label: "Expiring Soon", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400" };
    }
    
    return { label: "Active", className: "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400" };
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Licenses</h1>
          <p className="text-muted-foreground mt-1">Manage driver licenses</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search licenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[250px] pl-9 pr-8 shadow-sm"
            />
            {search && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 h-full w-8 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setSearch("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
        </div>
        <Link href="/dashboard/licenses/new">
            <Button className="hover:shadow-md transition-all">
              <Plus className="mr-1 h-4 w-4" /> Create License
            </Button>
        </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredLicenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-muted/20 rounded-lg p-12 border border-border/50">
          <div className="h-16 w-16 rounded-full bg-background flex items-center justify-center mb-4 shadow-sm">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium">No licenses found</h3>
          <p className="text-muted-foreground mt-1 text-center max-w-md">
            {search ? "No licenses match your search criteria." : "Start by creating a new driver license."}
          </p>
          {!search && (
            <Link href="/dashboard/licenses/new" className="mt-4">
              <Button className="hover:shadow-md transition-all">
                <Plus className="mr-1 h-4 w-4" /> Create License
              </Button>
            </Link>
          )}
          {search && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSearch("")}
            >
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div>
          {search && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Found <span className="font-medium text-foreground">{filteredLicenses.length}</span> {filteredLicenses.length === 1 ? 'license' : 'licenses'} matching "<span className="font-medium text-foreground">{search}</span>"
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredLicenses.map((license) => {
              const status = getLicenseStatus(license.valid_to);
              
              return (
                <Card 
                  key={license.id} 
                  className="overflow-hidden hover:shadow-md transition-all group border border-border/80"
                >
                  <CardHeader className="p-5 pb-2">
                    <div className="flex justify-between items-start">
                      <Link href={`/dashboard/licenses/${license.id}`} className="flex items-center">
                        {license.image_url ? (
                          <div className="h-12 w-12 rounded-full overflow-hidden mr-3 border-2 border-border">
                            <Image
                              src={license.image_url}
                              alt={license.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
        />
      </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mr-3">
                            <User className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-base group-hover:text-primary transition-colors">
                            {license.name}
                          </CardTitle>
                          <CardDescription className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" /> {license.license_no}
                          </CardDescription>
                        </div>
                      </Link>
                      <Badge className={status.className}>
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">CNIC</p>
                        <p className="font-medium">{license.cnic}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Issued</p>
                        <p className="font-medium">{formatDate(license.valid_from)}</p>
                      </div>
                      <div className="col-span-2 mt-1">
                        <p className="text-muted-foreground text-xs">License Types</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {license.license_types.map((type) => {
                            const { label, icon: Icon } = getLicenseTypeInfo(type);
                            return (
                              <Badge 
                                key={type} 
                                variant="outline"
                                className="bg-secondary font-normal text-xs py-0 h-5"
                              >
                                <Icon className="h-3 w-3 mr-1" /> {label}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                      <div className="col-span-2 mt-2">
                        <p className="text-muted-foreground text-xs">Expiration</p>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          <p className="font-medium">{formatDate(license.valid_to)}</p>
                          
                          {(() => {
                            const daysRemaining = Math.ceil((new Date(license.valid_to).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                            
                            let textColor = "text-green-600";
                            if (daysRemaining < 0) textColor = "text-red-600";
                            else if (daysRemaining < 90) textColor = "text-yellow-600";
                            
                            return (
                              <span className={`ml-2 text-xs ${textColor}`}>
                                ({daysRemaining < 0 ? Math.abs(daysRemaining) + ' days overdue' : daysRemaining + ' days left'})
                  </span>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 p-3 flex justify-between">
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setLicenseToDelete(license);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Link href={`/dashboard/licenses/${license.id}/edit`}>
                        <Button variant="ghost" size="sm" className="h-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/licenses/${license.id}/print`}>
                        <Button variant="ghost" size="sm" className="h-8">
                          <Printer className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    <Link href={`/dashboard/licenses/${license.id}`}>
                      <Button size="sm" variant="outline" className="h-8 group">
                        Details
                        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
      </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete License</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the license for <span className="font-medium">{licenseToDelete?.name}</span> 
              {licenseToDelete?.cnic && <span> (CNIC: <span className="font-medium">{licenseToDelete.cnic}</span>)</span>}.
              <p className="mt-2 text-destructive font-medium">This action cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              {isDeleting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}