"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Church } from "lucide-react";
import Link from "next/link";
import { accountSetupService } from "@/services/accountSetupService";

const accountSetupSchema = z.object({
   token: z.string().min(32, "Invalid token"),
   password: z.string().min(1, "Password is required"),
});

type AccountSetupForm = z.infer<typeof accountSetupSchema>;

export default function AccountSetupPage() {
   const router = useRouter();
   const [isSubmitting, setIsSubmitting] = useState(false);
   const searchParams = useSearchParams();
   const token = searchParams.get("token");

   const form = useForm<AccountSetupForm>({
      resolver: zodResolver(accountSetupSchema),
      defaultValues: {
         token: token || "",
         password: "",
      },
   });

   async function onSubmit(values: AccountSetupForm) {
      setIsSubmitting(true);
      console.log(values);

      try {
         await accountSetupService.setPassword(values);
         router.push("/login");
      } catch {
         // Error toast handled by handleApiCall
      } finally {
         setIsSubmitting(false);
      }
   }

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <Card className="w-full max-w-md">
            <CardHeader className="text-center space-y-2">
               <div className="flex justify-center">
                  <Church className="h-10 w-10 text-primary" />
               </div>
               <CardTitle className="text-2xl">Setup your account</CardTitle>
               <p className="text-sm text-gray-500">
                  Enter your password to access the dashboard
               </p>
            </CardHeader>
            <CardContent>
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-4"
                  >
                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                 <Input
                                    type="password"
                                    placeholder="Enter your password"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                     >
                        {isSubmitting ? "Submiting..." : "Submit"}
                     </Button>
                  </form>
               </Form>

               <div className="mt-4 text-center text-sm text-gray-500">
                  <Link href="/" className="text-primary hover:underline">
                     Back to website
                  </Link>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
