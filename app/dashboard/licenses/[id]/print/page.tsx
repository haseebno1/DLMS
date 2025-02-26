"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { License } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function LicensePrintPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [license, setLicense] = useState<License | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>

        <div className="mt-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!license) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold">License Not Found</h2>
          <p className="text-muted-foreground mt-2">The requested license could not be found.</p>
          <Button className="mt-4" onClick={() => router.push('/dashboard/licenses')}>
            Back to Licenses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="print:hidden space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">Print License</h2>
          </div>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
        <p className="text-muted-foreground">Preview the license below. Click Print to print or save as PDF.</p>
      </div>

      <div className="license-card mx-auto my-8 max-w-4xl border border-gray-300 rounded-lg overflow-hidden shadow-lg print:shadow-none bg-white">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-green-800">Driver License</h1>
              <h2 className="text-xl text-green-700">Islamic Republic of Pakistan</h2>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-700">License No:</div>
              <div className="text-xl font-bold">{license.license_no}</div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1">
              <div className="relative h-40 w-32 overflow-hidden rounded-md border mx-auto">
                {license.image_url ? (
                  <Image
                    src={license.image_url}
                    alt={`${license.name}'s photo`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100">
                    <span className="text-sm text-gray-500">No photo</span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <div className="relative h-16 w-full overflow-hidden mx-auto">
                  {license.signature_url ? (
                    <Image
                      src={license.signature_url}
                      alt="Signature"
                      width={200}
                      height={50}
                      className="object-contain mx-auto"
                    />
                  ) : (
                    <div className="h-16 flex items-center justify-center">
                      <span className="text-sm text-gray-500">No signature</span>
                    </div>
                  )}
                </div>
                <div className="text-center text-sm mt-1">Signature</div>
              </div>
            </div>

            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Name</div>
                  <div className="font-semibold">{license.name}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Father's Name</div>
                  <div className="font-semibold">{license.father_name}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500">CNIC</div>
                  <div className="font-semibold">{license.cnic}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Date of Birth</div>
                  <div className="font-semibold">{license.date_of_birth}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500">Blood Group</div>
                  <div className="font-semibold">{license.blood_group}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Height</div>
                  <div className="font-semibold">{license.height}</div>
                </div>

                <div className="col-span-2">
                  <div className="text-sm font-medium text-gray-500">Address</div>
                  <div className="font-semibold">{license.address}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500">Valid From</div>
                  <div className="font-semibold">{formatDate(license.valid_from)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Valid To</div>
                  <div className="font-semibold">{formatDate(license.valid_to)}</div>
                </div>

                <div className="col-span-2">
                  <div className="text-sm font-medium text-gray-500">License Types</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {license.license_types.map((type) => (
                      <span key={type} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {type === 'mcycle' ? 'Motorcycle' : type === 'carjeep' ? 'Car/Jeep' : type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t pt-4 text-center text-sm text-gray-500">
            <p>Issued by the Traffic Police, {license.issue_city.charAt(0).toUpperCase() + license.issue_city.slice(1)}</p>
            <p className="mt-1">This license must be carried while driving and produced on demand by an authorized officer.</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white;
            padding: 0;
            margin: 0;
          }
          .license-card {
            border: 1px solid #ccc;
            page-break-inside: avoid;
            max-width: 100%;
            box-shadow: none;
          }
        }
      `}</style>
    </>
  );
} 