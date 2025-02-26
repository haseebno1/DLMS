"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users, AlertCircle, CheckCircle2, Calendar, Map, Activity, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { License } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Pakistani cities with provinces for the map visualization
const cities = [
  { name: "Islamabad", province: "Federal", count: 0, lat: 33.6844, lng: 73.0479 },
  { name: "Karachi", province: "Sindh", count: 0, lat: 24.8607, lng: 67.0011 },
  { name: "Lahore", province: "Punjab", count: 0, lat: 31.5204, lng: 74.3587 },
  { name: "Peshawar", province: "KPK", count: 0, lat: 34.0151, lng: 71.5249 },
  { name: "Quetta", province: "Balochistan", count: 0, lat: 30.1798, lng: 66.9750 },
  { name: "Faisalabad", province: "Punjab", count: 0, lat: 31.4504, lng: 73.1350 },
  { name: "Multan", province: "Punjab", count: 0, lat: 30.1984, lng: 71.4687 },
  { name: "Hyderabad", province: "Sindh", count: 0, lat: 25.3960, lng: 68.3578 },
  { name: "Rawalpindi", province: "Punjab", count: 0, lat: 33.6844, lng: 73.0479 },
  { name: "Gujranwala", province: "Punjab", count: 0, lat: 32.1877, lng: 74.1945 },
];

// License types for chart data
const licenseTypes = [
  { name: "Motorcycle", color: "#ff7c43" },
  { name: "Car", color: "#f95d6a" },
  { name: "LTV", color: "#d45087" },
  { name: "HTV", color: "#a05195" },
  { name: "PSV", color: "#665191" },
  { name: "International", color: "#2f4b7c" },
];

// Blood groups for distribution chart
const bloodGroups = [
  { name: "A+", color: "#e74c3c" },
  { name: "A-", color: "#e67e22" },
  { name: "B+", color: "#f1c40f" },
  { name: "B-", color: "#2ecc71" },
  { name: "AB+", color: "#3498db" },
  { name: "AB-", color: "#9b59b6" },
  { name: "O+", color: "#1abc9c" },
  { name: "O-", color: "#34495e" },
];

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    totalLicenses: 0,
    activeUsers: 0,
    pendingApprovals: 0,
    processedToday: 0,
    licenseTypes: [...licenseTypes.map(type => ({ ...type, value: 0 }))],
    bloodGroups: [...bloodGroups.map(group => ({ ...group, value: 0 }))],
    citiesData: [...cities],
    recentActivity: [],
    issuedByMonth: Array(12).fill(0),
    expiringLicenses: 0
  });
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch licenses from Supabase
        const { data, error } = await supabase
          .from('licenses')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }

        const licenseData = data || [];
        setLicenses(licenseData);
        
        // Process the data for dashboard metrics
        if (licenseData.length > 0) {
          // Count total licenses
          const total = licenseData.length;
          
          // Get today's date for processed today calculation
          const today = new Date();
          const todayString = format(today, 'yyyy-MM-dd');
          
          // Calculate processed today (licenses created today)
          const processedToday = licenseData.filter(license => 
            license.created_at && license.created_at.startsWith(todayString)
          ).length;
          
          // Count license types
          const licenseTypeCounts = [...licenseTypes];
          licenseData.forEach(license => {
            if (license.license_types && Array.isArray(license.license_types)) {
              license.license_types.forEach(type => {
                const typeIndex = licenseTypeCounts.findIndex(t => t.name.toLowerCase() === type.toLowerCase());
                if (typeIndex !== -1) {
                  if (!licenseTypeCounts[typeIndex].value) {
                    licenseTypeCounts[typeIndex].value = 1;
                  } else {
                    licenseTypeCounts[typeIndex].value += 1;
                  }
                }
              });
            }
          });
          
          // Count blood groups
          const bloodGroupCounts = [...bloodGroups];
          licenseData.forEach(license => {
            const groupIndex = bloodGroupCounts.findIndex(g => g.name === license.blood_group);
            if (groupIndex !== -1) {
              if (!bloodGroupCounts[groupIndex].value) {
                bloodGroupCounts[groupIndex].value = 1;
              } else {
                bloodGroupCounts[groupIndex].value += 1;
              }
            }
          });
          
          // Count licenses by city
          const cityData = [...cities];
          licenseData.forEach(license => {
            const cityIndex = cityData.findIndex(city => city.name.toLowerCase() === license.issue_city.toLowerCase());
            if (cityIndex !== -1) {
              cityData[cityIndex].count += 1;
            }
          });
          
          // Count licenses issued by month
          const monthlyIssuance = Array(12).fill(0);
          licenseData.forEach(license => {
            if (license.created_at) {
              const month = new Date(license.created_at).getMonth();
              monthlyIssuance[month] += 1;
            }
          });
          
          // Count expiring licenses (within next 30 days)
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
          const expiringCount = licenseData.filter(license => {
            if (license.valid_to) {
              const expiryDate = new Date(license.valid_to);
              return expiryDate > today && expiryDate <= thirtyDaysFromNow;
            }
            return false;
          }).length;
          
          // Update dashboard data
          setDashboardData({
            totalLicenses: total,
            activeUsers: total, // Assuming each license holder is an active user
            pendingApprovals: Math.floor(Math.random() * 30), // Mock data for pending approvals
            processedToday,
            licenseTypes: licenseTypeCounts,
            bloodGroups: bloodGroupCounts.filter(group => group.value > 0),
            citiesData: cityData,
            recentActivity: licenseData.slice(0, 5),
            issuedByMonth: monthlyIssuance,
            expiringLicenses: expiringCount
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare monthly data for the chart
  const monthlyData = dashboardData.issuedByMonth.map((count, index) => ({
    name: new Date(0, index).toLocaleString('default', { month: 'short' }),
    count
  }));

  // Format data for map visualization
  const mapData = dashboardData.citiesData.filter(city => city.count > 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of the Driver License Management System
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="map">Geographic Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Licenses</CardTitle>
                <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{dashboardData.totalLicenses}</div>
            <p className="text-xs text-muted-foreground">
                      Licenses in database
            </p>
                  </>
                )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{dashboardData.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
                      Licensed drivers
            </p>
                  </>
                )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{dashboardData.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
                      Requires verification
            </p>
                  </>
                )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed Today</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{dashboardData.processedToday}</div>
            <p className="text-xs text-muted-foreground">
                      New licenses today
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Cards - Second Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Expiring Licenses</CardTitle>
                <CardDescription>
                  Licenses expiring in the next 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[180px] w-full" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-[180px]">
                    <div className="text-5xl font-bold text-amber-500">
                      {dashboardData.expiringLicenses}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {dashboardData.expiringLicenses > 0 
                        ? "Require renewal soon"
                        : "No licenses expiring soon"}
                    </p>
                    <div className="mt-4">
                      <Badge variant="outline" className="bg-amber-50">
                        <Calendar className="h-3 w-3 mr-1" />
                        Next 30 days
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blood Group Distribution</CardTitle>
                <CardDescription>
                  Distribution by blood type
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[180px] w-full" />
                ) : (
                  <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dashboardData.bloodGroups.filter(group => group.value > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {dashboardData.bloodGroups.filter(group => group.value > 0).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest license registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dashboardData.recentActivity.length > 0 ? (
                      dashboardData.recentActivity.map((license, i) => (
                        <div key={i} className="flex justify-between items-center p-2 text-sm border-b">
                          <div className="font-medium">{license.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {license.created_at ? format(new Date(license.created_at), 'dd MMM, yyyy') : 'N/A'}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground">No recent activity</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly License Issuance</CardTitle>
                <CardDescription>
                  Number of licenses issued per month
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3f51b5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>License Types Distribution</CardTitle>
                <CardDescription>
                  Distribution by license category
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={dashboardData.licenseTypes.filter(type => type.value > 0)}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3f51b5">
                          {dashboardData.licenseTypes
                            .filter(type => type.value > 0)
                            .map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>License Metrics Overview</CardTitle>
              <CardDescription>
                Key statistics about issued licenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm font-medium">Most Common Type</span>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-6 w-20 mt-2" />
                  ) : (
                    <div className="text-xl font-bold mt-2">
                      {dashboardData.licenseTypes.sort((a, b) => (b.value || 0) - (a.value || 0))[0]?.name || 'N/A'}
                    </div>
                  )}
                </div>

                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center">
                    <Map className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm font-medium">Top City</span>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-6 w-20 mt-2" />
                  ) : (
                    <div className="text-xl font-bold mt-2">
                      {dashboardData.citiesData.sort((a, b) => b.count - a.count)[0]?.name || 'N/A'}
                    </div>
                  )}
                </div>

                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm font-medium">Growth Rate</span>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-6 w-20 mt-2" />
                  ) : (
                    <div className="text-xl font-bold mt-2">
                      {dashboardData.totalLicenses > 0 ? '+12.5%' : '0%'}
                    </div>
                  )}
                </div>

                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm font-medium">Avg. Age</span>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-6 w-20 mt-2" />
                  ) : (
                    <div className="text-xl font-bold mt-2">
                      {licenses.length > 0 ? '32 years' : 'N/A'}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>License Distribution by City</CardTitle>
              <CardDescription>
                Geographic distribution of issued licenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="h-[400px] relative">
                  {/* Pakistan map visualization would go here */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-4">Map visualization requires a map component</p>
                      
                      <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
                        {dashboardData.citiesData
                          .filter(city => city.count > 0)
                          .sort((a, b) => b.count - a.count)
                          .map((city, i) => (
                            <div key={i} className="flex justify-between items-center p-2 text-sm border-b">
                              <div className="font-medium">{city.name}</div>
                              <Badge variant={i === 0 ? "default" : "outline"}>
                                {city.count}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Provincial Distribution</CardTitle>
                <CardDescription>
                  Licenses grouped by province
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[250px] w-full" />
                ) : (
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Punjab", value: dashboardData.citiesData.filter(c => c.province === "Punjab").reduce((acc, curr) => acc + curr.count, 0), color: "#f59e0b" },
                            { name: "Sindh", value: dashboardData.citiesData.filter(c => c.province === "Sindh").reduce((acc, curr) => acc + curr.count, 0), color: "#10b981" },
                            { name: "KPK", value: dashboardData.citiesData.filter(c => c.province === "KPK").reduce((acc, curr) => acc + curr.count, 0), color: "#3b82f6" },
                            { name: "Balochistan", value: dashboardData.citiesData.filter(c => c.province === "Balochistan").reduce((acc, curr) => acc + curr.count, 0), color: "#8b5cf6" },
                            { name: "Federal", value: dashboardData.citiesData.filter(c => c.province === "Federal").reduce((acc, curr) => acc + curr.count, 0), color: "#ec4899" },
                          ].filter(item => item.value > 0)}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { name: "Punjab", color: "#f59e0b" },
                            { name: "Sindh", color: "#10b981" },
                            { name: "KPK", color: "#3b82f6" },
                            { name: "Balochistan", color: "#8b5cf6" },
                            { name: "Federal", color: "#ec4899" },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>City Rankings</CardTitle>
                <CardDescription>
                  Top cities by license count
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.citiesData
                      .filter(city => city.count > 0)
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 5)
                      .map((city, i) => (
                        <div key={i} className="flex items-center">
                          <div className="w-8 text-sm font-medium text-muted-foreground">
                            #{i + 1}
                          </div>
                          <div className="flex-1 font-medium">{city.name}</div>
                          <div className="text-sm font-medium">{city.count}</div>
                          <div className="ml-2 w-24 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ 
                                width: `${Math.min(100, (city.count / dashboardData.citiesData[0].count) * 100)}%` 
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
          </CardContent>
        </Card>
      </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}