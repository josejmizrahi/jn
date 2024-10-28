"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpRight, ArrowDownLeft } from "lucide-react";

const TRANSACTIONS = [
  {
    id: 1,
    type: "Earned",
    amount: 100,
    description: "Community discussion participation",
    date: "2024-04-02",
    category: "Participation",
  },
  {
    id: 2,
    type: "Spent",
    amount: 500,
    description: "Torah Study Bundle purchase",
    date: "2024-04-01",
    category: "Purchase",
  },
  {
    id: 3,
    type: "Earned",
    amount: 250,
    description: "Event organization bonus",
    date: "2024-03-30",
    category: "Event",
  },
  {
    id: 4,
    type: "Earned",
    amount: 150,
    description: "Torah study completion",
    date: "2024-03-28",
    category: "Education",
  },
  {
    id: 5,
    type: "Spent",
    amount: 300,
    description: "Profile customization",
    date: "2024-03-25",
    category: "Purchase",
  },
];

export function Transactions() {
  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search transactions..." />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350 MP</div>
            <p className="text-xs text-muted-foreground">
              +500 MP from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">800 MP</div>
            <p className="text-xs text-muted-foreground">
              -200 MP from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent MitzvahPoints activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {TRANSACTIONS.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-background">
                    {transaction.type === "Earned" ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={
                      transaction.type === "Earned"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {transaction.type === "Earned" ? "+" : "-"}
                    {transaction.amount} MP
                  </div>
                  <Badge variant="outline" className="mt-1">
                    {transaction.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}